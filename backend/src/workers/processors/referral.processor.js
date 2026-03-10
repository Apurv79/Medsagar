import * as walletService from "../../modules/wallet/wallet.service.js";

export default async (job) => {
  const { userId, reward } = job.data;

  await walletService.creditWallet({
    userId,
    amount: reward,
    type: "referral_reward",
  });
};