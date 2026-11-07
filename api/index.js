// Vercel serverless entry: ყველა მოთხოვნა აქ მოდის (იხ. vercel.json → rewrites).
// კოდი უკვე აწყობილია dist/-ში (`npm run vercel-build`), აქ მხოლოდ Express instance-ს ვაბრუნებთ.

// AdminJS-ის bundle build-ის დროს აიწყო (admin-bundle/bundle.js), გაშვებისას აღარ ვაწყობთ.
// ფოლდერის სახელი იგივე უნდა იყოს, რაც src/admin-panel/bundle-admin.ts-ში.
process.env.ADMIN_JS_SKIP_BUNDLE ??= 'true';
process.env.ADMIN_JS_TMP_DIR ??= 'admin-bundle';

const { createApp } = require('../dist/main');

// აპი ერთხელ იქმნება და instance-ის სიცოცხლის განმავლობაში მომდევნო მოთხოვნებს ემსახურება
let server;
const getServer = () =>
  (server ??= createApp()
    .then(async (app) => {
      await app.init();
      return app.getHttpAdapter().getInstance();
    })
    .catch((error) => {
      server = undefined; // შემდეგი მოთხოვნა თავიდან სცდის
      throw error;
    }));

module.exports = async (req, res) => (await getServer())(req, res);
