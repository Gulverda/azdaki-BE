# Azdaki Theatre — Backend (NestJS + Prisma + PostgreSQL)

## გაშვება

```bash
npm install
# .env-ში ჩაწერე DATABASE_URL (Postgres-ის პაროლი), ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:migrate -- --name init   # ქმნის ცხრილებს
npm run db:seed                     # ქმნის ადმინს და "ჩვენს შესახებ" გვერდს
npm run start:dev
```

- API: http://localhost:3000/api
- Swagger დოკუმენტაცია და ტესტირება: http://localhost:3000/docs
- Prisma Studio (ბაზის GUI): `npm run db:studio`

## ადმინპანელი (AdminJS)

**http://localhost:3000/admin**: შესვლა `.env`-ის `ADMIN_EMAIL` / `ADMIN_PASSWORD`-ით (seed-ის შემდეგ).

- კოდი: `src/admin-panel/`
  - `admin-panel.module.ts`: AdminJS-ის ჩართვა და ავტორიზაცია
  - `resources.ts`: ყველა ცხრილის კონფიგურაცია (ველები, ატვირთვები, hook-ები)
  - `translations.ts`: ქართული წარწერები
- ფაილები ინახება `uploads/`-ში, ბაზაში კი იწერება `/uploads/<uuid>.jpg`, იგივე ფორმატი, რასაც REST API აბრუნებს.
  ტიპი და ზომა სერვერზეც მოწმდება.
- ცარიელი slug სათაურიდან ავტომატურად იქმნება. სიახლის გამოქვეყნებისას თარიღიც ავტომატურად ჩაიწერება.
- ადმინების მართვა და პაროლის შეცვლა: **სისტემა → ადმინისტრატორები**.
- Login-ზე rate limit: ერთი IP-დან 15 წუთში 10 მცდელობა (`/api/auth/login` და `/admin/login`, `express-rate-limit` `main.ts`-ში).
  მთვლელები Postgres-ის `RateLimit` ცხრილშია, session-ები კი `session` ცხრილში (`connect-pg-simple`), რომ Vercel-ზე იმუშაოს.
- AdminJS-ის პაკეტები მხოლოდ ESM-ია, ამიტომ dynamic `import()`-ით ჩაიტვირთება (იხ. კომენტარი `admin-panel.module.ts`-ში).

## Deploy: Vercel + Supabase

- `api/index.js`: serverless entry, რომელიც `dist/main`-ის `createApp()`-ს იძახებს. `vercel.json` ყველა მოთხოვნას აქ აგზავნის.
- Build (`npm run vercel-build`): `prisma generate` → `nest build` → `admin:bundle`.
  AdminJS-ის bundle წინასწარ იწყობა `admin-bundle/`-ში, რადგან Vercel-ზე დისკი read-only-ა.
- Vercel-ის Environment Variables: `.env.example`-ის ყველა ცვლადი. `DATABASE_URL` არის Supabase-ის Transaction pooler
  (`:6543` + `?pgbouncer=true&connection_limit=1`), `DIRECT_URL` კი Session pooler / Direct (`:5432`).
  `CORS_ORIGINS`-ში ფრონტის დომენი ჩაწერე.
- Migration-ები ავტომატურად არ ეშვება. ახალი migration-ის შემდეგ ლოკალურად გაუშვი (`DIRECT_URL` → Supabase):
  `npx prisma migrate deploy`. პირველად `npm run db:seed`-იც.
- ⚠ R2-მდე: ატვირთული ფაილები Vercel-ზე `/tmp`-ში იწერება და იკარგება. `/uploads/...` ბმულები production-ზე არ იმუშავებს.

## Express → Nest

| Express                              | Nest                                         | სად ნახო                                  |
| ------------------------------------ | -------------------------------------------- | ----------------------------------------- |
| `router.get('/news', fn)`            | `@Controller('news')` + `@Get()`             | `news/news.controller.ts`                 |
| ლოგიკა route-ში ან helper ფაილში    | `@Injectable()` Service                      | `news/news.service.ts`                    |
| `require('./db')` ყველგან            | Dependency Injection (constructor)           | `constructor(private prisma: PrismaService)` |
| ფოლდერების სტრუქტურა თვითონ          | `@Module()` ერთი feature-ისთვის            | `news/news.module.ts`                     |
| `req.body` + ხელით ვალიდაცია / Joi   | DTO + class-validator + `ValidationPipe`     | `news/dto/create-news.dto.ts`             |
| auth middleware                      | Guard (`canActivate`)                        | `auth/admin.guard.ts`                     |
| `res.json()`-მდე პასუხის შეცვლა      | Interceptor                                  | `common/interceptors/localize.interceptor.ts` |
| error-handling middleware            | Exception Filter                             | `common/filters/prisma-exception.filter.ts` |
| `parseInt(req.params.id)`            | Pipe: `@Param('id', ParseIntPipe)`           | ყველა admin controller                    |
| `req.user`                           | custom decorator `@CurrentAdmin()`           | `auth/current-admin.decorator.ts`         |

მოთხოვნის გზა: **Middleware → Guard → Interceptor (before) → Pipe → Controller → Service → Interceptor (after) → Filter (შეცდომისას)**

## ორენოვნება

- ბაზაში თითოეული თარგმნადი ველი ორჯერ ინახება: `titleKa` (სავალდებულო) და `titleEn` (არასავალდებულო).
- **საჯარო API** (`/api/news`, `/api/performances` ...) აბრუნებს ერთ ენას: `?lang=en` ან `Accept-Language: en`. Default ენა ქართულია.
  ```json
  { "title": "Hamlet", "description": "..." }
  ```
  თუ ინგლისური თარგმანი ცარიელია, ბრუნდება ქართული.
- **Admin API** (`/api/admin/...`) აბრუნებს ორივე ენას (`titleKa`, `titleEn`), რადგან ადმინკის ფორმას ორივე სჭირდება.

## Endpoint-ები

### საჯარო

| Method | Path                       | გვერდი                                                                 |
| ------ | -------------------------- | ---------------------------------------------------------------------- |
| GET    | `/api/news?page=1&limit=12` | სიახლეები (pagination)                                                |
| GET    | `/api/news/:slug`          | კონკრეტული სიახლე                                                     |
| GET    | `/api/performances`        | სპექტაკლები + უახლოესი ჩვენება                                        |
| GET    | `/api/performances/:slug`  | დეტალური გვერდი: ფოტოები, მონაწილეები, ჩვენებები, გალერეა              |
| GET    | `/api/gallery?type=IMAGE`  | გალერეა (`IMAGE` / `VIDEO`, `performanceId` ფილტრი)                    |
| GET    | `/api/staff?category=ACTOR` | დასი / სტაფი                                                          |
| GET    | `/api/staff/:id`           | მსახიობის გვერდი + მისი სპექტაკლები                                   |
| GET    | `/api/about`               | ჩვენს შესახებ: ტექსტი, ფოტოები, ვიდეოები, სპექტაკლები, სტაფი          |

### ადმინი (`Authorization: Bearer <token>`)

| Method                | Path                          |
| --------------------- | ----------------------------- |
| POST                  | `/api/auth/login` → `{ accessToken }` |
| GET                   | `/api/auth/me`                |
| POST                  | `/api/admin/uploads` (multipart, ველი `file`) → `{ url }` |
| GET/POST/PATCH/DELETE | `/api/admin/news[/:id]`       |
| GET/POST/PATCH/DELETE | `/api/admin/performances[/:id]` |
| GET/POST/PATCH/DELETE | `/api/admin/staff[/:id]`      |
| GET/POST/PATCH/DELETE | `/api/admin/gallery[/:id]`    |
| GET/PUT               | `/api/admin/about`            |

**ფაილების ატვირთვა:** ჯერ ფაილი იტვირთება `/api/admin/uploads`-ზე, მიღებული `url` კი იწერება შესაბამის ველში
(`coverImage`, `photo`, `images[]`, gallery `url` ...). ვიდეოსთვის შეიძლება YouTube ლინკის მითითებაც.

**სპექტაკლის update:** თუ `images`, `cast` ან `showtimes` მოაწოდე, ძველი სია მთლიანად ჩანაცვლდება ახლით.

## ახალი მოდულის დამატება

```bash
npx nest g resource events   # ქმნის module, controller, service, dto-ებს
```
