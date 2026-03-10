import * as walletService from "../../modules/wallet/wallet.service.js";

export default async (job) => {
  const { userId, amount, paymentId } = job.data;

  await walletService.creditWallet({
    userId,
    amount,
    referenceId: paymentId,
    type: "wallet_topup",
  });
};