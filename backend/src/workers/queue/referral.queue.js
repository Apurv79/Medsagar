import { Queue } from "bullmq";
import { connection } from "../../configs/redis.bullmq.js";

const referralQueue = new Queue("referralQueue", {
  connection,
});

export default referralQueue;