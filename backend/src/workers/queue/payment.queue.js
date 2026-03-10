import { Queue } from "bullmq";
import { connection } from "../../configs/redis.bullmq.js";

const paymentQueue = new Queue("paymentQueue", {
  connection,
});

export default paymentQueue;