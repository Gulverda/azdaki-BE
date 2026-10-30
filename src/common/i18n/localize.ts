import type { Lang } from './lang';

/**
 * ბაზიდან წამოსულ ობიექტს (რეკურსიულად, nested relation-ებიანად) აქცევს ერთენოვნად:
 *   { titleKa: 'ჰამლეტი', titleEn: 'Hamlet' }  →  { title: 'Hamlet' }   (lang = en)
 * თუ ინგლისური თარგმანი ცარიელია, ბრუნდება ქართული (fallback).
 */
export function localize(data: unknown, lang: Lang): unknown {
  if (Array.isArray(data)) return data.map((item) => localize(item, lang));
  if (data === null || typeof data !== 'object' || data instanceof Date) {
    return data;
  }

  const source = data as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source)) {
    if (key.endsWith('Ka')) {
      const base = key.slice(0, -2);
      const en = source[`${base}En`];
      result[base] = lang === 'en' && en ? en : value;
    } else if (key.endsWith('En') && `${key.slice(0, -2)}Ka` in source) {
      continue; // უკვე დამუშავდა Ka ველთან ერთად
    } else {
      result[key] = localize(value, lang);
    }
  }

  return result;
}
