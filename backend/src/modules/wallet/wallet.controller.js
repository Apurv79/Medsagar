import * as walletService from "./wallet.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const getWalletController = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWallet(req.user.userId);
  return ApiResponse.success(res, "Wallet retrieved successfully", wallet);
});

export const getBalanceController = asyncHandler(async (req, res) => {
  const balance = await walletService.getBalance(req.user.userId);
  return ApiResponse.success(res, "Balance retrieved successfully", { balance });
});

export const getTransactionsController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const data = await walletService.getTransactions(
    req.user.userId,
    Number(page),
    Number(limit)
  );
  return ApiResponse.success(res, "Transactions retrieved successfully", data);
});

export const getTransactionByIdController = asyncHandler(async (req, res) => {
  const tx = await walletService.getTransactionById(
    req.params.id,
    req.user.userId
  );
  return ApiResponse.success(res, "Transaction retrieved successfully", tx);
});

export const creditWalletController = asyncHandler(async (req, res) => {
  const wallet = await walletService.creditWallet(req.body);
  return ApiResponse.success(res, "Wallet credited successfully", wallet);
});

export const debitWalletController = asyncHandler(async (req, res) => {
  const wallet = await walletService.debitWallet(req.body);
  return ApiResponse.success(res, "Wallet debited successfully", wallet);
});

export const adminAdjustWalletController = asyncHandler(async (req, res) => {
  const wallet = await walletService.adminAdjustWallet(req.body);
  return ApiResponse.success(res, "Wallet adjusted successfully", wallet);
});