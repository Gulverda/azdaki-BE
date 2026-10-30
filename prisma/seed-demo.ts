/**
 * სადემონსტრაციო კონტენტი ფრონტის დასაწყობად: სპექტაკლები, დასი, სიახლეები, გალერეა.
 *   npm run db:seed:demo
 *
 * შეიძლება რამდენჯერმე გაეშვას — ჩანაწერები slug-ით / სახელით ახლდება და არ დუბლირდება.
 * სურათები picsum.photos-იდან იწერება uploads/demo-*.jpg-ში (თუ ინტერნეტი არ არის, ველი ცარიელი რჩება).
 */
import { MediaType, PrismaClient, StaffCategory } from '@prisma/client';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const prisma = new PrismaClient();
const UPLOAD_DIR = join(process.cwd(), 'uploads');

/** ჩამოტვირთავს სურათს ერთხელ და აბრუნებს `/uploads/demo-<name>.jpg`-ს */
async function image(name: string, width = 1200, height = 800) {
  const file = `demo-${name}.jpg`;
  const path = join(UPLOAD_DIR, file);
  if (!existsSync(path)) {
    try {
      const res = await fetch(
        `https://picsum.photos/seed/azdaki-${name}/${width}/${height}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      writeFileSync(path, Buffer.from(await res.arrayBuffer()));
    } catch (error) {
      console.warn(`სურათი ვერ ჩამოიტვირთა (${name}):`, error);
      return null;
    }
  }
  return `/uploads/${file}`;
}

const daysFromNow = (days: number, hour = 19) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const STAFF = [
  {
    key: 'nino',
    nameKa: 'ნინო ბერიძე',
    nameEn: 'Nino Beridze',
    positionKa: 'სამხატვრო ხელმძღვანელი, რეჟისორი',
    positionEn: 'Artistic Director, Director',
    category: StaffCategory.DIRECTOR,
    bioKa:
      '<p>დაამთავრა შოთა რუსთაველის სახელობის თეატრისა და კინოს უნივერსიტეტი. დადგმული აქვს ოცზე მეტი სპექტაკლი საქართველოსა და ევროპის თეატრებში.</p>',
    bioEn:
      '<p>Graduated from the Shota Rustaveli Theatre and Film University. She has staged more than twenty productions in Georgia and across Europe.</p>',
  },
  {
    key: 'giorgi',
    nameKa: 'გიორგი კაპანაძე',
    nameEn: 'Giorgi Kapanadze',
    positionKa: 'რეჟისორი',
    positionEn: 'Director',
    category: StaffCategory.DIRECTOR,
    bioKa:
      '<p>ახალგაზრდა რეჟისორი, რომლის ნამუშევრები კლასიკური ტექსტების თანამედროვე ინტერპრეტაციით გამოირჩევა.</p>',
    bioEn:
      '<p>A young director known for contemporary readings of classical texts.</p>',
  },
  {
    key: 'levan',
    nameKa: 'ლევან ჯაფარიძე',
    nameEn: 'Levan Japaridze',
    positionKa: 'მსახიობი',
    positionEn: 'Actor',
    category: StaffCategory.ACTOR,
    bioKa:
      '<p>თეატრის დასში 2015 წლიდან. როლები: ჰამლეტი, ყვარყვარე, ტრეპლევი.</p>',
    bioEn:
      '<p>Member of the company since 2015. Roles include Hamlet, Kvarkvare and Treplev.</p>',
  },
  {
    key: 'mariam',
    nameKa: 'მარიამ ცერცვაძე',
    nameEn: 'Mariam Tsertsvadze',
    positionKa: 'მსახიობი',
    positionEn: 'Actress',
    category: StaffCategory.ACTOR,
    bioKa:
      '<p>თეატრალური პრემია „დურუჯის“ ლაურეატი საუკეთესო ქალის როლისთვის.</p>',
    bioEn: '<p>Winner of the Duruji theatre award for Best Actress.</p>',
  },
  {
    key: 'davit',
    nameKa: 'დავით ლომიძე',
    nameEn: 'Davit Lomidze',
    positionKa: 'მსახიობი',
    positionEn: 'Actor',
    category: StaffCategory.ACTOR,
    bioKa: '<p>თეატრის ერთ-ერთი დამფუძნებელი. სცენაზე 25 წელია.</p>',
    bioEn: '<p>One of the founders of the theatre, on stage for 25 years.</p>',
  },
  {
    key: 'tamar',
    nameKa: 'თამარ ხუციშვილი',
    nameEn: 'Tamar Khutsishvili',
    positionKa: 'მსახიობი',
    positionEn: 'Actress',
    category: StaffCategory.ACTOR,
    bioKa: '<p>დასს შეუერთდა 2021 წელს, სტუდენტობისთანავე.</p>',
    bioEn: '<p>Joined the company in 2021, straight out of drama school.</p>',
  },
  {
    key: 'saba',
    nameKa: 'საბა გოგიჩაიშვილი',
    nameEn: 'Saba Gogichaishvili',
    positionKa: 'მსახიობი',
    positionEn: 'Actor',
    category: StaffCategory.ACTOR,
    bioKa: '<p>მუშაობს როგორც დრამატულ, ისე მუსიკალურ სპექტაკლებში.</p>',
    bioEn: '<p>Works in both drama and musical productions.</p>',
  },
  {
    key: 'ana',
    nameKa: 'ანა მესხი',
    nameEn: 'Ana Meskhi',
    positionKa: 'მსახიობი',
    positionEn: 'Actress',
    category: StaffCategory.ACTOR,
    bioKa: '<p>ასევე ასწავლის სასცენო მეტყველებას თეატრის სტუდიაში.</p>',
    bioEn: "<p>Also teaches stage speech at the theatre's studio.</p>",
  },
  {
    key: 'irakli',
    nameKa: 'ირაკლი ჩხეიძე',
    nameEn: 'Irakli Chkheidze',
    positionKa: 'მთავარი მხატვარი',
    positionEn: 'Production Designer',
    category: StaffCategory.ARTISTIC,
  },
  {
    key: 'ketevan',
    nameKa: 'ქეთევან ნაკაშიძე',
    nameEn: 'Ketevan Nakashidze',
    positionKa: 'კომპოზიტორი',
    positionEn: 'Composer',
    category: StaffCategory.ARTISTIC,
  },
  {
    key: 'zurab',
    nameKa: 'ზურაბ მაისურაძე',
    nameEn: 'Zurab Maisuradze',
    positionKa: 'დირექტორი',
    positionEn: 'Managing Director',
    category: StaffCategory.ADMINISTRATION,
  },
  {
    key: 'eka',
    nameKa: 'ეკა გელაშვილი',
    nameEn: 'Eka Gelashvili',
    positionKa: 'PR მენეჯერი',
    positionEn: 'PR Manager',
    category: StaffCategory.ADMINISTRATION,
  },
  {
    key: 'nika',
    nameKa: 'ნიკა ბაქრაძე',
    nameEn: 'Nika Bakradze',
    positionKa: 'განათების მხატვარი',
    positionEn: 'Lighting Designer',
    category: StaffCategory.TECHNICAL,
  },
  {
    key: 'beka',
    nameKa: 'ბექა ტაბიძე',
    nameEn: 'Beka Tabidze',
    positionKa: 'ხმის რეჟისორი',
    positionEn: 'Sound Engineer',
    category: StaffCategory.TECHNICAL,
  },
];

type StaffKey = (typeof STAFF)[number]['key'];

const VENUE = { venueKa: 'დიდი სცენა', venueEn: 'Main Stage' };
const SMALL_VENUE = { venueKa: 'მცირე სცენა', venueEn: 'Small Stage' };

const PERFORMANCES = [
  {
    slug: 'hamlet',
    titleKa: 'ჰამლეტი',
    titleEn: 'Hamlet',
    authorKa: 'უილიამ შექსპირი',
    authorEn: 'William Shakespeare',
    shortDescriptionKa:
      'დანიელი პრინცის ტრაგედია შურისძიებაზე, ეჭვსა და სიგიჟეზე.',
    shortDescriptionEn:
      'The tragedy of the Danish prince: revenge, doubt and madness.',
    descriptionKa:
      '<p>მამის აჩრდილი ჰამლეტს უმხელს, რომ ის საკუთარმა ძმამ, ახლანდელმა მეფემ მოკლა. პრინცი შურისძიების გზას ადგება, თუმცა ყოველი ნაბიჯი მას ახალ კითხვებთან აყენებს.</p><p>სპექტაკლი თანამედროვე სამყაროში გადმოიტანს შექსპირის ტექსტს და ძალაუფლებისა და სინდისის საკითხებს სვამს.</p>',
    descriptionEn:
      "<p>The ghost of Hamlet's father reveals he was murdered by his own brother, now king. The prince sets out on the path of revenge, yet every step confronts him with new questions.</p><p>The production moves Shakespeare's text into the present day, asking questions about power and conscience.</p>",
    durationMinutes: 180,
    ageRestriction: 16,
    premiereDate: new Date('2024-10-12T19:00:00Z'),
    trailerUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    isPublished: true,
    order: 1,
    cast: [
      { staff: 'nino', roleKa: 'რეჟისორი', roleEn: 'Director' },
      { staff: 'levan', roleKa: 'ჰამლეტი', roleEn: 'Hamlet' },
      { staff: 'mariam', roleKa: 'ოფელია', roleEn: 'Ophelia' },
      { staff: 'davit', roleKa: 'კლავდიუსი', roleEn: 'Claudius' },
      { staff: 'ana', roleKa: 'გერტრუდა', roleEn: 'Gertrude' },
      { staff: 'saba', roleKa: 'ჰორაციო', roleEn: 'Horatio' },
      { staff: 'irakli', roleKa: 'მხატვარი', roleEn: 'Set Design' },
      { staff: 'ketevan', roleKa: 'კომპოზიტორი', roleEn: 'Music' },
    ],
    showtimes: [3, 10, 24].map((d) => ({ startsAt: daysFromNow(d), ...VENUE })),
  },
  {
    slug: 'kvarkvare',
    titleKa: 'ყვარყვარე თუთაბერი',
    titleEn: 'Kvarkvare Tutaberi',
    authorKa: 'პოლიკარპე კაკაბაძე',
    authorEn: 'Polikarp Kakabadze',
    shortDescriptionKa:
      'სატირული კომედია ადამიანზე, რომელიც ნებისმიერ ხელისუფლებას ერგება.',
    shortDescriptionEn:
      'A satirical comedy about a man who adapts to any regime.',
    descriptionKa:
      '<p>ყვარყვარე — სოფლის უსაქმური, რომელიც რევოლუციის ქარიშხალში უცებ ძალაუფლების მწვერვალზე აღმოჩნდება. კაკაბაძის კლასიკური კომედია დღესაც ისეთივე აქტუალურია, როგორც ასი წლის წინ.</p>',
    descriptionEn:
      "<p>Kvarkvare, a village idler, suddenly finds himself at the top of power amid the storm of revolution. Kakabadze's classic comedy is as relevant today as it was a hundred years ago.</p>",
    durationMinutes: 140,
    ageRestriction: 12,
    premiereDate: new Date('2025-03-27T19:00:00Z'),
    isPublished: true,
    order: 2,
    cast: [
      { staff: 'giorgi', roleKa: 'რეჟისორი', roleEn: 'Director' },
      { staff: 'davit', roleKa: 'ყვარყვარე', roleEn: 'Kvarkvare' },
      { staff: 'tamar', roleKa: 'ყვარყვარეს ცოლი', roleEn: "Kvarkvare's wife" },
      { staff: 'saba', roleKa: 'კომისარი', roleEn: 'The Commissar' },
      { staff: 'irakli', roleKa: 'მხატვარი', roleEn: 'Set Design' },
    ],
    showtimes: [5, 12, 19].map((d) => ({ startsAt: daysFromNow(d), ...VENUE })),
  },
  {
    slug: 'the-seagull',
    titleKa: 'თოლია',
    titleEn: 'The Seagull',
    authorKa: 'ანტონ ჩეხოვი',
    authorEn: 'Anton Chekhov',
    shortDescriptionKa:
      'სიყვარულის, ხელოვნებისა და აუხდენელი ოცნებების შესახებ.',
    shortDescriptionEn: 'On love, art and unfulfilled dreams.',
    descriptionKa:
      '<p>ზაფხული ტბის პირას მდებარე მამულში. ახალგაზრდა მწერალი ტრეპლევი ახალ ფორმებს ეძებს, ნინა კი მსახიობობაზე ოცნებობს. ჩეხოვის პიესა ინტიმურ მცირე სცენაზე, მაყურებელთან ახლოს.</p>',
    descriptionEn:
      '<p>Summer at a lakeside estate. The young writer Treplev searches for new forms, while Nina dreams of becoming an actress. Chekhov on the intimate small stage, close to the audience.</p>',
    durationMinutes: 150,
    ageRestriction: 14,
    premiereDate: new Date('2025-11-20T19:00:00Z'),
    isPublished: true,
    order: 3,
    cast: [
      { staff: 'giorgi', roleKa: 'რეჟისორი', roleEn: 'Director' },
      { staff: 'levan', roleKa: 'ტრეპლევი', roleEn: 'Treplev' },
      { staff: 'tamar', roleKa: 'ნინა ზარეჩნაია', roleEn: 'Nina Zarechnaya' },
      { staff: 'ana', roleKa: 'არკადინა', roleEn: 'Arkadina' },
      { staff: 'ketevan', roleKa: 'კომპოზიტორი', roleEn: 'Music' },
    ],
    showtimes: [20, 21, 35].map((d) => ({
      startsAt: daysFromNow(d),
      ...SMALL_VENUE,
    })),
  },
  {
    slug: 'the-caucasian-chalk-circle',
    titleKa: 'კავკასიური ცარცის წრე',
    titleEn: 'The Caucasian Chalk Circle',
    authorKa: 'ბერტოლტ ბრეხტი',
    authorEn: 'Bertolt Brecht',
    shortDescriptionKa: 'იგავი სამართალსა და დედობაზე — ცოცხალი მუსიკით.',
    shortDescriptionEn: 'A parable of justice and motherhood, with live music.',
    descriptionKa:
      '<p>გრუშე, მოახლე გოგონა, ომის ქაოსში მიტოვებულ ბავშვს იხსნის. წლების შემდეგ მოსამართლე აზდაკმა უნდა გადაწყვიტოს, ვინ არის ნამდვილი დედა.</p>',
    descriptionEn:
      '<p>Grusha, a servant girl, rescues a child abandoned amid the chaos of war. Years later, the judge Azdak must decide who the real mother is.</p>',
    durationMinutes: 165,
    ageRestriction: 12,
    premiereDate: null,
    isPublished: true,
    order: 0,
    cast: [
      { staff: 'nino', roleKa: 'რეჟისორი', roleEn: 'Director' },
      { staff: 'saba', roleKa: 'აზდაკი', roleEn: 'Azdak' },
      { staff: 'mariam', roleKa: 'გრუშე', roleEn: 'Grusha' },
      { staff: 'ketevan', roleKa: 'კომპოზიტორი', roleEn: 'Music' },
      { staff: 'nika', roleKa: 'განათება', roleEn: 'Lighting' },
    ],
    showtimes: [45, 46].map((d) => ({ startsAt: daysFromNow(d), ...VENUE })),
  },
  {
    // დრაფტი — საჯარო API-ში არ უნდა გამოჩნდეს
    slug: 'medea',
    titleKa: 'მედეა',
    titleEn: 'Medea',
    authorKa: 'ევრიპიდე',
    authorEn: 'Euripides',
    shortDescriptionKa: 'მზადების პროცესშია.',
    shortDescriptionEn: 'In rehearsal.',
    descriptionKa: '<p>აღწერა მალე დაემატება.</p>',
    descriptionEn: '<p>Description coming soon.</p>',
    durationMinutes: null,
    ageRestriction: 16,
    premiereDate: null,
    isPublished: false,
    order: 10,
    cast: [{ staff: 'nino', roleKa: 'რეჟისორი', roleEn: 'Director' }],
    showtimes: [],
  },
];

const NEWS = [
  {
    slug: 'new-season-2026-2027',
    titleKa: 'თეატრი 2026–2027 წლების სეზონს ხსნის',
    titleEn: 'The theatre opens the 2026–2027 season',
    excerptKa: 'ახალ სეზონში მაყურებელს ოთხი პრემიერა და საგასტროლო ტური ელის.',
    excerptEn:
      'Four premieres and a touring programme await audiences this season.',
    contentKa:
      '<p>ახალი სეზონი „კავკასიური ცარცის წრის“ პრემიერით გაიხსნება. რეპერტუარში დარჩება „ჰამლეტი“, „ყვარყვარე თუთაბერი“ და „თოლია“.</p><p>ბილეთები უკვე იყიდება სალაროსა და ონლაინ.</p>',
    contentEn:
      '<p>The new season opens with the premiere of The Caucasian Chalk Circle. Hamlet, Kvarkvare Tutaberi and The Seagull remain in the repertoire.</p><p>Tickets are now on sale at the box office and online.</p>',
    isPublished: true,
    publishedAt: daysFromNow(-2, 12),
  },
  {
    slug: 'seagull-premiere',
    titleKa: '„თოლიას“ პრემიერა მცირე სცენაზე',
    titleEn: 'The Seagull premieres on the Small Stage',
    excerptKa:
      'გიორგი კაპანაძის ახალი დადგმა ჩეხოვის კლასიკას ახლებურად კითხულობს.',
    excerptEn:
      "Giorgi Kapanadze's new production offers a fresh reading of Chekhov.",
    contentKa:
      '<p>სპექტაკლი სპეციალურად მცირე სცენისთვის შეიქმნა — დარბაზში მხოლოდ 80 ადგილია, რაც მაყურებელს მსახიობებთან განსაკუთრებულ სიახლოვეს აძლევს.</p>',
    contentEn:
      '<p>The production was created specifically for the Small Stage. With only 80 seats, the audience is unusually close to the actors.</p>',
    isPublished: true,
    publishedAt: daysFromNow(-15, 12),
  },
  {
    slug: 'hamlet-festival-award',
    titleKa: '„ჰამლეტი“ საერთაშორისო ფესტივალის გამარჯვებულია',
    titleEn: 'Hamlet wins at an international festival',
    excerptKa:
      'ლევან ჯაფარიძე საუკეთესო მამაკაცის როლის შემსრულებლად დასახელდა.',
    excerptEn: 'Levan Japaridze was named Best Actor.',
    contentKa:
      '<p>ფესტივალის ჟიურიმ სპექტაკლი სამ ნომინაციაში დააჯილდოვა: საუკეთესო რეჟისურა, საუკეთესო მამაკაცის როლი და საუკეთესო სცენოგრაფია.</p>',
    contentEn:
      '<p>The festival jury honoured the production in three categories: Best Direction, Best Actor and Best Set Design.</p>',
    isPublished: true,
    publishedAt: daysFromNow(-40, 12),
  },
  {
    slug: 'theatre-studio-enrollment',
    titleKa: 'თეატრალურ სტუდიაში მიღება იწყება',
    titleEn: 'Enrollment opens for the theatre studio',
    excerptKa: 'სტუდია 12–17 წლის მოზარდებს სამსახიობო ოსტატობას ასწავლის.',
    excerptEn: 'The studio teaches acting to teenagers aged 12 to 17.',
    contentKa:
      '<p>მეცადინეობები კვირაში ორჯერ ჩატარდება. სეზონის ბოლოს სტუდენტები საკუთარ სპექტაკლს წარმოადგენენ მცირე სცენაზე.</p><p>რეგისტრაცია: info@azdaki.ge</p>',
    contentEn:
      '<p>Classes take place twice a week. At the end of the season, students present their own production on the Small Stage.</p><p>Registration: info@azdaki.ge</p>',
    isPublished: true,
    publishedAt: daysFromNow(-60, 12),
  },
  {
    slug: 'kvarkvare-100th-show',
    titleKa: '„ყვარყვარე თუთაბერი“ მე-100-ედ ითამაშება',
    titleEn: 'Kvarkvare Tutaberi reaches its 100th performance',
    excerptKa:
      'საიუბილეო ჩვენების შემდეგ მაყურებელს შემოქმედებით ჯგუფთან შეხვედრა ელის.',
    excerptEn:
      'The anniversary show will be followed by a meet-the-company session.',
    contentKa:
      '<p>სპექტაკლი პრემიერიდან სულ რაღაც ერთ წელიწადში ასჯერ ითამაშა გაყიდული დარბაზით.</p>',
    contentEn:
      '<p>Within roughly a year of its premiere, the production has played one hundred sold-out shows.</p>',
    isPublished: true,
    publishedAt: daysFromNow(-90, 12),
  },
  {
    // დრაფტი — საჯარო API-ში არ უნდა გამოჩნდეს
    slug: 'medea-casting',
    titleKa: '„მედეას“ კასტინგი',
    titleEn: 'Casting for Medea',
    excerptKa: null,
    excerptEn: null,
    contentKa: '<p>ტექსტი მზადდება.</p>',
    contentEn: null,
    isPublished: false,
    publishedAt: null,
  },
];

async function seedStaff() {
  const ids = {} as Record<StaffKey, number>;
  for (const [order, { key, ...data }] of STAFF.entries()) {
    const values = {
      ...data,
      order,
      photo: await image(`staff-${key}`, 600, 800),
    };
    const existing = await prisma.staffMember.findFirst({
      where: { nameKa: data.nameKa },
    });
    const member = existing
      ? await prisma.staffMember.update({
          where: { id: existing.id },
          data: values,
        })
      : await prisma.staffMember.create({ data: values });
    ids[key] = member.id;
  }
  return ids;
}

async function seedPerformances(staffIds: Record<StaffKey, number>) {
  const ids: Record<string, number> = {};
  for (const { cast, showtimes, ...data } of PERFORMANCES) {
    const coverImage = await image(`perf-${data.slug}`);
    const images = (
      await Promise.all([1, 2, 3].map((i) => image(`perf-${data.slug}-${i}`)))
    ).filter((url): url is string => !!url);

    const nested = {
      images: { create: images.map((url, order) => ({ url, order })) },
      cast: {
        create: cast.map(({ staff, ...role }, order) => ({
          ...role,
          order,
          staffId: staffIds[staff],
        })),
      },
      showtimes: {
        create: showtimes.map((s) => ({
          ...s,
          ticketUrl: 'https://tkt.ge',
        })),
      },
    };

    const performance = await prisma.performance.upsert({
      where: { slug: data.slug },
      create: { ...data, coverImage, ...nested },
      update: {
        ...data,
        coverImage,
        images: { deleteMany: {}, ...nested.images },
        cast: { deleteMany: {}, ...nested.cast },
        showtimes: { deleteMany: {}, ...nested.showtimes },
      },
    });
    ids[data.slug] = performance.id;
  }
  return ids;
}

async function seedNews() {
  for (const data of NEWS) {
    const values = { ...data, coverImage: await image(`news-${data.slug}`) };
    await prisma.news.upsert({
      where: { slug: data.slug },
      create: values,
      update: values,
    });
  }
}

async function seedGallery(performanceIds: Record<string, number>) {
  // წინა გაშვების დემო ჩანაწერები იშლება და თავიდან იქმნება
  await prisma.galleryItem.deleteMany({
    where: {
      OR: [
        { url: { startsWith: '/uploads/demo-' } },
        { thumbnail: { startsWith: '/uploads/demo-' } },
      ],
    },
  });

  const photos = [
    {
      name: 'gallery-1',
      titleKa: 'რეპეტიცია',
      titleEn: 'Rehearsal',
      slug: 'hamlet',
    },
    {
      name: 'gallery-2',
      titleKa: 'პრემიერის საღამო',
      titleEn: 'Premiere night',
      slug: 'hamlet',
    },
    {
      name: 'gallery-3',
      titleKa: 'კულისებში',
      titleEn: 'Backstage',
      slug: 'kvarkvare',
    },
    {
      name: 'gallery-4',
      titleKa: 'ფინალური სცენა',
      titleEn: 'Final scene',
      slug: 'kvarkvare',
    },
    {
      name: 'gallery-5',
      titleKa: 'ტბის პირას',
      titleEn: 'By the lake',
      slug: 'the-seagull',
    },
    {
      name: 'gallery-6',
      titleKa: 'დიდი სცენა',
      titleEn: 'Main Stage',
      slug: null,
    },
    { name: 'gallery-7', titleKa: 'ფოიე', titleEn: 'Foyer', slug: null },
    {
      name: 'gallery-8',
      titleKa: 'სტუდიის მოსწავლეები',
      titleEn: 'Studio students',
      slug: null,
    },
  ];

  let order = 0;
  for (const { name, slug, ...titles } of photos) {
    const url = await image(name);
    if (!url) continue;
    await prisma.galleryItem.create({
      data: {
        type: MediaType.IMAGE,
        url,
        ...titles,
        order: order++,
        performanceId: slug ? performanceIds[slug] : null,
      },
    });
  }

  const videos = [
    {
      titleKa: 'ჰამლეტი — ტრეილერი',
      titleEn: 'Hamlet — trailer',
      slug: 'hamlet',
    },
    {
      titleKa: 'სეზონის ანონსი',
      titleEn: 'Season announcement',
      slug: null,
    },
  ];
  for (const { slug, ...titles } of videos) {
    await prisma.galleryItem.create({
      data: {
        type: MediaType.VIDEO,
        url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        thumbnail: await image(`video-${slug ?? 'season'}`),
        ...titles,
        order: order++,
        performanceId: slug ? performanceIds[slug] : null,
      },
    });
  }
}

async function seedAbout() {
  const data = {
    titleKa: 'ჩვენს შესახებ',
    titleEn: 'About us',
    contentKa:
      '<p>თეატრი „აზდაკი“ 2010 წელს დაარსდა ახალგაზრდა მსახიობებისა და რეჟისორების ჯგუფის მიერ. სახელი ბრეხტის „კავკასიური ცარცის წრის“ პერსონაჟს, მოსამართლე აზდაკს ეკუთვნის.</p><p>ჩვენი რეპერტუარი აერთიანებს ქართულ და მსოფლიო კლასიკას და თანამედროვე დრამატურგიას. თეატრს აქვს ორი სცენა — დიდი (350 ადგილი) და მცირე (80 ადგილი) — და მოზარდთა თეატრალური სტუდია.</p>',
    contentEn:
      "<p>Azdaki Theatre was founded in 2010 by a group of young actors and directors. It is named after Azdak, the judge from Brecht's The Caucasian Chalk Circle.</p><p>Our repertoire brings together Georgian and world classics alongside contemporary drama. The theatre has two stages, the Main Stage (350 seats) and the Small Stage (80 seats), plus a youth theatre studio.</p>",
    heroImage: await image('about-hero', 1920, 1080),
    images: (
      await Promise.all([1, 2, 3, 4].map((i) => image(`about-${i}`)))
    ).filter((url): url is string => !!url),
    videos: ['https://www.youtube.com/watch?v=aqz-KE-bpKQ'],
  };
  await prisma.aboutPage.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
}

async function main() {
  mkdirSync(UPLOAD_DIR, { recursive: true });
  const staffIds = await seedStaff();
  const performanceIds = await seedPerformances(staffIds);
  await seedNews();
  await seedGallery(performanceIds);
  await seedAbout();
  console.log(
    `Demo: ${STAFF.length} staff, ${PERFORMANCES.length} performances, ${NEWS.length} news, gallery, about`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
