export const DISTRIBUTION_WALLET = process.env.DISTRIBUTION_WALLET || '';
export const DAILY_TOKEN_POOL = Number(process.env.DAILY_TOKEN_POOL || '0');
export const TOTAL_TOKEN_SUPPLY = Number(process.env.TOTAL_TOKEN_SUPPLY || '0');
export const TOKENS_PER_SECOND = DAILY_TOKEN_POOL / 86400;
