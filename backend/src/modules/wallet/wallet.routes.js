import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validator.middleware.js";

import {
  getWalletController,
  getBalanceController,
  getTransactionsController,
  getTransactionByIdController,
  creditWalletController,
  debitWalletController,
  adminAdjustWalletController
} from "./wallet.controller.js";

import {
  creditValidator,
  debitValidator,
  adminAdjustValidator
} from "./wallet.validator.js";

const router = express.Router();

router.get("/me", authMiddleware, getWalletController);

router.get("/balance", authMiddleware, getBalanceController);

router.get("/transactions", authMiddleware, getTransactionsController);

router.get("/transactions/:id", authMiddleware, getTransactionByIdController);

router.post(
  "/credit",
  authMiddleware,
  validate(creditValidator),
  creditWalletController
);

router.post(
  "/debit",
  authMiddleware,
  validate(debitValidator),
  debitWalletController
);

router.post(
  "/admin-adjust",
  authMiddleware,
  validate(adminAdjustValidator),
  adminAdjustWalletController
);

export default router;