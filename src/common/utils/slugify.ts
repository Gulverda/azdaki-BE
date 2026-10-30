const GEORGIAN: Record<string, string> = {
  ა: 'a',
  ბ: 'b',
  გ: 'g',
  დ: 'd',
  ე: 'e',
  ვ: 'v',
  ზ: 'z',
  თ: 't',
  ი: 'i',
  კ: 'k',
  ლ: 'l',
  მ: 'm',
  ნ: 'n',
  ო: 'o',
  პ: 'p',
  ჟ: 'zh',
  რ: 'r',
  ს: 's',
  ტ: 't',
  უ: 'u',
  ფ: 'p',
  ქ: 'k',
  ღ: 'gh',
  ყ: 'q',
  შ: 'sh',
  ჩ: 'ch',
  ც: 'ts',
  ძ: 'dz',
  წ: 'ts',
  ჭ: 'ch',
  ხ: 'kh',
  ჯ: 'j',
  ჰ: 'h',
};

/** "ჰამლეტი — პრემიერა" → "hamleti-premiera" */
export function slugify(text: string): string {
  const slug = [...text.toLowerCase()]
    .map((char) => GEORGIAN[char] ?? char)
    .join('')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'item';
}

/** თუ slug დაკავებულია, ბოლოში ამატებს -2, -3 ... */
export async function uniqueSlug(
  text: string,
  isTaken: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(text);
  let slug = base;
  for (let i = 2; await isTaken(slug); i++) slug = `${base}-${i}`;
  return slug;
}
