import { createHash } from 'node:crypto';

// Omikuji draw, served as a Vercel function at /api/omikuji.
//
// The slip is a pure function of (visitor, Japan date): the visitor id is a salted
// hash of IP + user agent, so the same person gets the same slip all day without
// any storage, and the raw IP never leaves this function. Redis (Upstash, optional)
// only adds the "N people drew today" counter.

// Sensō-ji's real distribution over its 100 sticks.
const RANKS = [
  { key: 'daikichi', jp: '大吉', reading: 'daikichi', en: 'Great blessing', weight: 17, tier: 'good', tie: false,
    headline: 'The wind is at your back. Act boldly.' },
  { key: 'kichi', jp: '吉', reading: 'kichi', en: 'Blessing', weight: 35, tier: 'good', tie: false,
    headline: 'Steady steps bring good things.' },
  { key: 'hankichi', jp: '半吉', reading: 'hankichi', en: 'Half blessing', weight: 5, tier: 'mid', tie: false,
    headline: 'Good and bad in equal measure. Choose with care.' },
  { key: 'shokichi', jp: '小吉', reading: 'shōkichi', en: 'Small blessing', weight: 4, tier: 'mid', tie: false,
    headline: 'Small joys add up. Notice them.' },
  { key: 'sueshokichi', jp: '末小吉', reading: 'sue-shōkichi', en: 'Small blessing, later', weight: 3, tier: 'mid', tie: true,
    headline: 'A little luck, a little later. Keep going.' },
  { key: 'suekichi', jp: '末吉', reading: 'suekichi', en: 'Blessing, later', weight: 6, tier: 'mid', tie: true,
    headline: 'Luck arrives late, but it arrives.' },
  { key: 'kyo', jp: '凶', reading: 'kyō', en: 'Bad luck', weight: 30, tier: 'bad', tie: true,
    headline: 'A bad day for fortune. Tie the slip and leave it behind.' },
];

const CATEGORIES = [
  { jp: '学問', en: 'Study', lines: {
    good: ['The reviewer who doubted you writes "clear accept".', 'The experiment you almost skipped is the one that works.'],
    mid: ['Results arrive, but only after the third rerun.', 'Read the related work once more. The answer is on page 7.'],
    bad: ['Reviewer 2 has opinions. Many opinions.', 'The baseline wins today. Rest, then rerun.'],
  } },
  { jp: '仕事', en: 'Work', lines: {
    good: ['A client finds your portfolio and stays to read it.', 'The deploy goes green on the first push.'],
    mid: ['Progress is slow but real. Commit small and often.', 'The bug hides in the last place you look, as always.'],
    bad: ['The deadline moves, and not in your favour.', 'It works on your machine. Only on your machine.'],
  } },
  { jp: '願望', en: 'Wish', lines: {
    good: ['It comes true, sooner than you planned for.', 'Ask clearly and you will receive.'],
    mid: ['Half of it comes true. Choose the half wisely.', 'Be patient. The season is not yet ripe.'],
    bad: ['Not this time. Tie this slip and let it go.', 'Wait for the season to turn.'],
  } },
  { jp: '待人', en: 'Awaited person', lines: {
    good: ['They are already on their way.', 'An old friend reaches out first.'],
    mid: ['They will come, a little late.', 'A message arrives once you stop checking.'],
    bad: ['They are busy with their own Reviewer 2.', 'Not today. Look elsewhere.'],
  } },
];

// Stick number -> rank. Ranks are laid out by weight, then spread across the
// numbers with a fixed stride so neighbouring sticks don't share a rank.
const STICK_RANKS = RANKS.flatMap((rank) => Array(rank.weight).fill(rank));
const rankForStick = (stick) => STICK_RANKS[(stick * 37) % 100];

const DIGITS = '〇一二三四五六七八九';
const toKanji = (n) => {
  if (n === 100) return '百';
  if (n < 10) return DIGITS[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (tens > 1 ? DIGITS[tens] : '') + '十' + (ones ? DIGITS[ones] : '');
};

const japanDate = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

const visitorHash = (req, date) => {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = forwarded || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
  const salt = process.env.OMIKUJI_SALT || 'chou-odori';
  return createHash('sha256').update(`${salt}|${date}|${ip}|${req.headers['user-agent'] || ''}`).digest();
};

// Upstash REST, called with fetch so the function needs no dependencies.
// Vercel's Upstash integration sets the KV_* names; a direct Upstash setup sets UPSTASH_*.
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = async (commands) => {
  const res = await fetch(`${redisUrl}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${redisToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  return (await res.json()).map((r) => r.result);
};

// Returns { seenBefore, todayCount }, or nulls when Redis isn't configured or is down.
const recordDraw = async (date, visitor, rankKey) => {
  if (!redisUrl || !redisToken) return { seenBefore: null, todayCount: null };
  try {
    const twoDays = 2 * 24 * 3600;
    const [isNew] = await redis([['SET', `omikuji:seen:${date}:${visitor}`, '1', 'NX', 'EX', twoDays]]);
    const countKey = `omikuji:count:${date}`;
    if (isNew === 'OK') {
      const [count] = await redis([
        ['INCR', countKey],
        ['EXPIRE', countKey, 40 * 24 * 3600],
        ['HINCRBY', `omikuji:ranks:${date}`, rankKey, 1],
        ['EXPIRE', `omikuji:ranks:${date}`, 40 * 24 * 3600],
      ]);
      return { seenBefore: false, todayCount: Number(count) };
    }
    const [count] = await redis([['GET', countKey]]);
    return { seenBefore: true, todayCount: Number(count) || 0 };
  } catch {
    return { seenBefore: null, todayCount: null };
  }
};

export default async function handler(req, res) {
  const send = (status, body) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(body));
  };

  if (req.method !== 'GET') return send(405, { error: 'GET only' });

  const date = japanDate();
  const hash = visitorHash(req, date);
  const stick = (hash.readUInt32BE(0) % 100) + 1;
  const rank = rankForStick(stick);
  const lines = CATEGORIES.map((c, i) => {
    const pool = c.lines[rank.tier];
    return { jp: c.jp, en: c.en, text: pool[hash[4 + i] % pool.length] };
  });
  const { seenBefore, todayCount } = await recordDraw(date, hash.toString('hex').slice(0, 24), rank.key);

  const { weight: _weight, tier: _tier, ...publicRank } = rank;
  return send(200, { date, stick, stickKanji: toKanji(stick), rank: publicRank, lines, seenBefore, todayCount });
}
