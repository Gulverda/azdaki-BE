import type { ClientRateLimitInfo, Options, Store } from 'express-rate-limit';
import type { PrismaClient } from '@prisma/client';

/**
 * express-rate-limit-ის მთვლელები Postgres-ში. Vercel-ზე ყოველ instance-ს თავისი მეხსიერება
 * აქვს და ხშირად ნულდება, ამიტომ default MemoryStore იქ პრაქტიკულად არ ზღუდავს არაფერს.
 */
export class PrismaRateLimitStore implements Store {
  private windowMs = 60_000;

  /** prefix: ერთ ცხრილს რამდენიმე limiter იყენებს (მაგ. 'api-login:', 'admin-login:') */
  constructor(
    private readonly prisma: PrismaClient,
    readonly prefix: string,
  ) {}

  init(options: Options) {
    this.windowMs = options.windowMs;
  }

  /** ერთი atomic query: ვადაგასული მთვლელი თავიდან იწყება, დანარჩენი +1 */
  async increment(key: string): Promise<ClientRateLimitInfo> {
    const resetAt = new Date(Date.now() + this.windowMs);
    const [row] = await this.prisma.$queryRaw<
      { hits: number; resetAt: Date }[]
    >`
      INSERT INTO "RateLimit" ("key", "hits", "resetAt")
      VALUES (${this.prefix + key}, 1, ${resetAt})
      ON CONFLICT ("key") DO UPDATE SET
        "hits"    = CASE WHEN "RateLimit"."resetAt" < now() THEN 1 ELSE "RateLimit"."hits" + 1 END,
        "resetAt" = CASE WHEN "RateLimit"."resetAt" < now() THEN EXCLUDED."resetAt" ELSE "RateLimit"."resetAt" END
      RETURNING "hits", "resetAt"
    `;
    return { totalHits: row.hits, resetTime: row.resetAt };
  }

  async decrement(key: string) {
    await this.prisma.rateLimit.updateMany({
      where: { key: this.prefix + key, hits: { gt: 0 } },
      data: { hits: { decrement: 1 } },
    });
  }

  async resetKey(key: string) {
    await this.prisma.rateLimit.deleteMany({
      where: { key: this.prefix + key },
    });
  }
}
