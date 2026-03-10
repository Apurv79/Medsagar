import * as paymentService from "./payment.service.js"
import crypto from "crypto";

export const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);

    await paymentService.processWebhook(req.body, rawBody, signature);

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    res.status(400).json({ received: false, error: error.message });
  }
}