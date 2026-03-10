import Wallet from "./wallet.model.js";
import WalletTransaction from "./walletTransaction.model.js";
import { TRANSACTION_TYPES } from "./wallet.constants.js";
import cacheRedis from "../../configs/redis.cache.js";

export const getWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId }).lean();

  if (!wallet) {
    wallet = await Wallet.create({ userId });
  }

  return wallet;
};

export const getBalance = async (userId) => {
  const cacheKey = `wallet_balance:${userId}`;
  const cachedBalance = await cacheRedis.get(cacheKey);

  if (cachedBalance !== null) {
    return Number(cachedBalance);
  }

  const wallet = await Wallet.findOne({ userId })
    .select("balance")
    .lean();

  const balance = wallet?.balance || 0;
  await cacheRedis.set(cacheKey, balance, "EX", 60);

  return balance;
};

export const creditWallet = async ({ userId, amount, type, referenceId, metadata }) => {
  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount } },
    { new: true, upsert: true }
  );

  await WalletTransaction.create({
    walletId: wallet._id,
    userId,
    type,
    amount,
    referenceId,
    metadata
  });

  await cacheRedis.del(`wallet_balance:${userId}`);
  return wallet;
};

export const debitWallet = async ({ userId, amount, type, referenceId }) => {
  const wallet = await Wallet.findOne({ userId });

  if (!wallet || wallet.balance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  wallet.balance -= amount;
  await wallet.save();

  await WalletTransaction.create({
    walletId: wallet._id,
    userId,
    type,
    amount,
    referenceId
  });

  await cacheRedis.del(`wallet_balance:${userId}`);
  return wallet;
};

export const getTransactions = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const transactions = await WalletTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await WalletTransaction.countDocuments({ userId });

  return {
    transactions,
    total,
    page,
    limit
  };
};

export const getTransactionById = async (transactionId, userId) => {
  const tx = await WalletTransaction.findOne({
    _id: transactionId,
    userId
  }).lean();

  return tx;
};

export const adminAdjustWallet = async ({ userId, amount, reason }) => {
  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount } },
    { new: true, upsert: true }
  );

  await WalletTransaction.create({
    walletId: wallet._id,
    userId,
    type: TRANSACTION_TYPES.ADMIN_ADJUSTMENT,
    amount,
    metadata: { reason }
  });

  await cacheRedis.del(`wallet_balance:${userId}`);
  return wallet;
};