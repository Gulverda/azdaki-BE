/**
 * AdminJS-ის frontend bundle-ს აწყობს build-ის დროს: `npm run admin:bundle` → admin-bundle/bundle.js
 *
 * production-ში AdminJS ამას ჩვეულებრივ სერვერის გაშვებისას აკეთებს და დისკზე წერს,
 * Vercel-ზე კი ფაილური სისტემა read-only-ა. ამიტომ ვაწყობთ წინასწარ და გაშვებისას
 * ADMIN_JS_SKIP_BUNDLE=true-თი ვტოვებთ (იხ. api/index.js).
 */

import { PrismaService } from '../prisma/prisma.service';
import { buildAdminJsOptions } from './admin-panel.module';

// default `.adminjs` არ გამოდგება: Express-ის sendFile წერტილით დაწყებულ ფოლდერზე 404-ს აბრუნებს.
// იგივე მნიშვნელობა api/index.js-შიცაა.
const ADMIN_BUNDLE_DIR = 'admin-bundle';

async function main() {
  // AdminJS NODE_ENV-ს import-ისას კითხულობს, ამიტომ dynamic import-ებამდე უნდა დაყენდეს
  process.env.NODE_ENV = 'production';
  process.env.ADMIN_JS_TMP_DIR = ADMIN_BUNDLE_DIR;
  delete process.env.ADMIN_JS_SKIP_BUNDLE;

  const { default: AdminJS } = await import('adminjs');
  // ბაზასთან კავშირი არ სჭირდება — resource-ების აღწერა Prisma-ს სქემიდან მოდის
  const admin = new AdminJS(await buildAdminJsOptions(new PrismaService()));
  await admin.initialize();
  console.log(`AdminJS bundle: ${ADMIN_BUNDLE_DIR}/bundle.js`);
}

void main();
