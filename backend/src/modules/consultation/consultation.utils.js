import crypto from "crypto";

export const generateChannelName = (appointmentId) => {
  return `consult_${appointmentId}_${crypto.randomBytes(4).toString("hex")}`;
};