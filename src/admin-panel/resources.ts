import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { copyFile, rm } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import type {
  ActionContext,
  ActionRequest,
  ComponentLoader,
  PropertyOptions,
  ResourceWithOptions,
  UploadedFile,
} from 'adminjs' with { 'resolution-mode': 'import' };
import { slugify, uniqueSlug } from '../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { UPLOAD_DIR } from '../uploads/uploads.controller';

const IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_FILE_SIZE = 200 * 1024 * 1024;

const NAV = {
  content: { name: 'კონტენტი', icon: 'FileText' },
  performances: { name: 'სპექტაკლები', icon: 'Film' },
  team: { name: 'დასი', icon: 'Users' },
  system: { name: 'სისტემა', icon: 'Settings' },
};

// upload-ის key ველი (მაგ. coverImage) ფორმაში არ ჩანს, მის ნაცვლად ჩანს ფაილის ატვირთვის ველი
const HIDDEN: PropertyOptions = { isVisible: false };
const RICH: PropertyOptions = { type: 'richtext' };
const TEXTAREA: PropertyOptions = { type: 'textarea' };
const READONLY: PropertyOptions = {
  isVisible: { list: false, filter: true, show: true, edit: false },
};
const TIMESTAMPS = { createdAt: READONLY, updatedAt: READONLY };
const SLUG: PropertyOptions = {
  isRequired: false,
  description: 'ცარიელი დატოვე და სათაურიდან ავტომატურად შეიქმნება',
};

const toDisk = (key: string) => join(UPLOAD_DIR, basename(key));
const isTrue = (value: unknown) => value === true || value === 'true';

type SlugCheck = (slug: string, excludeId?: number) => Promise<boolean>;

/** ცარიელი slug → სათაურიდან ვაგენერირებთ (იგივე ლოგიკა, რაც REST API-ში) */
const slugHook = (isTaken: SlugCheck) => async (request: ActionRequest) => {
  const { payload, method, params } = request;
  if (method !== 'post' || !payload) return request;

  const id = params.recordId ? Number(params.recordId) : undefined;
  payload.slug = payload.slug
    ? slugify(String(payload.slug))
    : await uniqueSlug(String(payload.titleEn || payload.titleKa), (slug) =>
        isTaken(slug, id),
      );
  return request;
};

/** სიახლის პირველად გამოქვეყნებისას თარიღი ავტომატურად ჩაიწერება */
const publishedAtHook = (request: ActionRequest) => {
  const { payload, method } = request;
  if (method === 'post' && payload && isTrue(payload.isPublished)) {
    payload.publishedAt ||= new Date().toISOString();
  }
  return request;
};

export async function buildResources(
  prisma: PrismaService,
  componentLoader: ComponentLoader,
): Promise<ResourceWithOptions[]> {
  const [
    { default: uploadFeature, BaseProvider },
    { getModelByName },
    { ValidationError, buildFeature },
  ] = await Promise.all([
    import('@adminjs/upload'),
    import('@adminjs/prisma'),
    import('adminjs'),
  ]);

  /** ფაილს ინახავს uploads/-ში, ბაზაში კი წერს "/uploads/<uuid>.jpg"-ს, ისევე როგორც REST upload */
  class UploadsProvider extends BaseProvider {
    constructor() {
      super('uploads');
    }

    async upload(file: UploadedFile, key: string) {
      await copyFile(file.path, toDisk(key));
      await rm(file.path, { force: true });
    }

    async delete(key: string) {
      await rm(toDisk(key), { force: true });
    }

    path(key: string) {
      return key;
    }
  }
  const provider = new UploadsProvider();

  /**
   * AdminJS ფაილის ტიპს მხოლოდ ბრაუზერში ამოწმებს, ამიტომ სერვერზეც ვამოწმებთ.
   * ეს hook upload feature-ის შემდეგ ეშვება, როცა ფაილი უკვე context['adminjs-upload']-შია.
   * required: ბაზაში ველი NOT NULL-ია, feature კი key-ს ჩანაწერის შექმნის შემდეგ წერს.
   */
  const validateUpload =
    (key: string, mimeTypes: string[], required: boolean) =>
    (request: ActionRequest, context: ActionContext) => {
      const { payload, method, params } = request;
      if (method !== 'post' || !payload) return request;

      const fileProperty = `${key}File`;
      const uploads = context['adminjs-upload'] as
        Record<string, UploadedFile | UploadedFile[] | undefined> | undefined;
      const files = ([] as UploadedFile[]).concat(
        uploads?.[fileProperty] ?? [],
      );
      const isNew = !params.recordId;

      const error = (message: string) =>
        new ValidationError({ [fileProperty]: { message } });
      if (required && isNew && !files.length) {
        throw error('ფაილი სავალდებულოა');
      }
      if (files.some((file) => !mimeTypes.includes(file.type))) {
        throw error('ამ ტიპის ფაილის ატვირთვა არ შეიძლება');
      }
      if (files.some((file) => file.size > MAX_FILE_SIZE)) {
        throw error('ფაილი ძალიან დიდია (მაქს. 200MB)');
      }

      if (required && isNew) payload[key] = ''; // upload-ის შემდეგ ჩაიწერება ნამდვილი მისამართი
      return request;
    };

  // ერთ resource-ზე რამდენიმე upload ველი რომ იმუშაოს, თითოეულს ცალკე virtual ველები სჭირდება
  const upload = (
    key: string,
    mimeTypes: string[],
    { multiple = false, required = false } = {},
  ) => [
    uploadFeature({
      componentLoader,
      provider,
      multiple,
      properties: {
        key,
        file: `${key}File`,
        filePath: `${key}FilePath`,
        filesToDelete: `${key}FilesToDelete`,
      },
      uploadPath: (_record, filename) =>
        `/uploads/${randomUUID()}${extname(filename).toLowerCase()}`,
      validation: { mimeTypes, maxSize: MAX_FILE_SIZE },
    }),
    buildFeature({
      actions: {
        new: { before: validateUpload(key, mimeTypes, required) },
        edit: { before: validateUpload(key, mimeTypes, false) },
      },
    }),
  ];

  const model = (name: string) => {
    const dmmfModel: unknown = getModelByName(name);
    return { model: dmmfModel, client: prisma };
  };

  const newsSlugTaken: SlugCheck = async (slug, excludeId) =>
    !!(await prisma.news.findFirst({
      where: { slug, NOT: { id: excludeId } },
    }));
  const performanceSlugTaken: SlugCheck = async (slug, excludeId) =>
    !!(await prisma.performance.findFirst({
      where: { slug, NOT: { id: excludeId } },
    }));

  const hashPassword = async (request: ActionRequest) => {
    const { payload, method, params } = request;
    if (method !== 'post' || !payload) return request;

    if (payload.password) {
      payload.passwordHash = await bcrypt.hash(String(payload.password), 10);
    } else if (!params.recordId) {
      throw new ValidationError({
        password: { message: 'პაროლი სავალდებულოა' },
      });
    }
    delete payload.password;
    return request;
  };

  return [
    {
      resource: model('News'),
      options: {
        navigation: NAV.content,
        sort: { sortBy: 'createdAt', direction: 'desc' },
        listProperties: [
          'coverImageFile',
          'titleKa',
          'isPublished',
          'publishedAt',
        ],
        properties: {
          slug: SLUG,
          coverImage: HIDDEN,
          excerptKa: TEXTAREA,
          excerptEn: TEXTAREA,
          contentKa: RICH,
          contentEn: RICH,
          ...TIMESTAMPS,
        },
        actions: {
          new: { before: [slugHook(newsSlugTaken), publishedAtHook] },
          edit: { before: [slugHook(newsSlugTaken), publishedAtHook] },
        },
      },
      features: upload('coverImage', IMAGE_TYPES),
    },
    {
      resource: model('Performance'),
      options: {
        navigation: NAV.performances,
        sort: { sortBy: 'order', direction: 'asc' },
        listProperties: [
          'coverImageFile',
          'titleKa',
          'premiereDate',
          'isPublished',
          'order',
        ],
        properties: {
          slug: SLUG,
          coverImage: HIDDEN,
          shortDescriptionKa: TEXTAREA,
          shortDescriptionEn: TEXTAREA,
          descriptionKa: RICH,
          descriptionEn: RICH,
          trailerUrl: { description: 'YouTube ლინკი' },
          ...TIMESTAMPS,
        },
        actions: {
          new: { before: slugHook(performanceSlugTaken) },
          edit: { before: slugHook(performanceSlugTaken) },
        },
      },
      features: upload('coverImage', IMAGE_TYPES),
    },
    {
      resource: model('PerformanceImage'),
      options: {
        navigation: NAV.performances,
        listProperties: ['urlFile', 'performance', 'order'],
        properties: { url: HIDDEN },
      },
      features: upload('url', IMAGE_TYPES, { required: true }),
    },
    {
      resource: model('PerformanceCast'),
      options: {
        navigation: NAV.performances,
        listProperties: ['performance', 'staff', 'roleKa', 'order'],
      },
    },
    {
      resource: model('Showtime'),
      options: {
        navigation: NAV.performances,
        sort: { sortBy: 'startsAt', direction: 'desc' },
        listProperties: ['performance', 'startsAt', 'venueKa', 'ticketUrl'],
      },
    },
    {
      resource: model('StaffMember'),
      options: {
        navigation: NAV.team,
        sort: { sortBy: 'order', direction: 'asc' },
        listProperties: [
          'photoFile',
          'nameKa',
          'positionKa',
          'category',
          'order',
          'isActive',
        ],
        properties: {
          photo: HIDDEN,
          bioKa: TEXTAREA,
          bioEn: TEXTAREA,
          ...TIMESTAMPS,
        },
      },
      features: upload('photo', IMAGE_TYPES),
    },
    {
      resource: model('GalleryItem'),
      options: {
        navigation: NAV.content,
        sort: { sortBy: 'createdAt', direction: 'desc' },
        listProperties: ['urlFile', 'type', 'titleKa', 'performance', 'order'],
        properties: { url: HIDDEN, thumbnail: HIDDEN, createdAt: READONLY },
      },
      features: [
        ...upload('url', [...IMAGE_TYPES, ...VIDEO_TYPES], { required: true }),
        ...upload('thumbnail', IMAGE_TYPES),
      ],
    },
    {
      resource: model('AboutPage'),
      options: {
        navigation: NAV.content,
        listProperties: ['titleKa', 'updatedAt'],
        properties: {
          contentKa: RICH,
          contentEn: RICH,
          heroImage: HIDDEN,
          images: HIDDEN,
          videos: HIDDEN,
          updatedAt: READONLY,
        },
        // ერთადერთი გვერდია: ახალს არ ვქმნით და არ ვშლით
        actions: {
          new: { isAccessible: false },
          delete: { isAccessible: false },
          bulkDelete: { isAccessible: false },
        },
      },
      features: [
        ...upload('heroImage', IMAGE_TYPES),
        ...upload('images', IMAGE_TYPES, { multiple: true }),
        ...upload('videos', VIDEO_TYPES, { multiple: true }),
      ],
    },
    {
      resource: model('Admin'),
      options: {
        navigation: NAV.system,
        listProperties: ['email', 'createdAt'],
        properties: {
          passwordHash: { isVisible: false },
          password: {
            type: 'password',
            isVisible: { list: false, filter: false, show: false, edit: true },
            description: 'რედაქტირებისას ცარიელი დატოვე, თუ არ ცვლი',
          },
          createdAt: READONLY,
        },
        actions: {
          new: { before: hashPassword },
          edit: { before: hashPassword },
        },
      },
    },
  ];
}
