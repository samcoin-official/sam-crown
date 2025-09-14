import { TOKENS_PER_SECOND, DAILY_TOKEN_POOL, DISTRIBUTION_WALLET } from '@/config';

interface UserRecord {
  lastTimestamp: number;
  balance: number;
  holding: boolean;
}

const users = new Map<string, UserRecord>();
let poolRemaining = DAILY_TOKEN_POOL;

export const grabCrown = (userId: string) => {
  const now = Date.now();
  const record = users.get(userId) || { lastTimestamp: now, balance: 0, holding: false };
  if (!record.holding) {
    record.lastTimestamp = now;
    record.holding = true;
  }
  users.set(userId, record);
};

export const releaseCrown = (userId: string) => {
  const record = users.get(userId);
  if (!record || !record.holding) return 0;
  const now = Date.now();
  const elapsed = Math.floor((now - record.lastTimestamp) / 1000);
  const earned = Math.min(elapsed * TOKENS_PER_SECOND, poolRemaining);
  record.balance += earned;
  record.holding = false;
  record.lastTimestamp = now;
  poolRemaining -= earned;
  users.set(userId, record);
  return earned;
};

export const claimTokens = (userId: string) => {
  const record = users.get(userId);
  if (!record) throw new Error('User not found');
  if (record.holding) {
    releaseCrown(userId);
  }
  const amount = record.balance;
  if (amount <= 0) throw new Error('No tokens to claim');
  record.balance = 0;
  users.set(userId, record);
  console.log(`Transferring ${amount} SAM from ${DISTRIBUTION_WALLET} to user ${userId}`);
  return amount;
};

export const getStats = (userId?: string) => {
  const record = userId ? users.get(userId) : undefined;
  const balance = record?.balance ?? 0;
  return {
    tokensPerSecond: TOKENS_PER_SECOND,
    poolRemaining,
    distributionWallet: DISTRIBUTION_WALLET,
    balance,
  };
};

export const resetDailyPool = () => {
  poolRemaining = DAILY_TOKEN_POOL;
  users.forEach((u) => {
    u.balance = 0;
    u.holding = false;
    u.lastTimestamp = Date.now();
  });
};
