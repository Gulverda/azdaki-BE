import type { Request } from 'express';

export const LANGS = ['ka', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'ka';

/**
 * ენის განსაზღვრა პრიორიტეტით:
 * 1. ?lang=en query პარამეტრი
 * 2. Accept-Language header
 * 3. default — ქართული
 */
export function resolveLang(req: Request): Lang {
  const query = req.query.lang;
  if (typeof query === 'string' && isLang(query)) return query;

  const header = req.headers['accept-language']?.slice(0, 2).toLowerCase();
  if (header && isLang(header)) return header;

  return DEFAULT_LANG;
}

function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}
