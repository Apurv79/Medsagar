import pkg from "agora-access-token";
import { TOKEN_EXPIRY } from "./consultation.constants.js";
import env from "../../configs/env.config.js";

const { RtcTokenBuilder, RtcRole } = pkg;

const APP_ID = env.AGORA_APP_ID;
const APP_CERT = env.AGORA_APP_CERTIFICATE;

export const generateAgoraToken = (channelName, uid, role) => {
  const expireTime = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY;

  const agoraRole =
    role === "doctor" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  // Use 0 as the UID to allow the Agora SDK to assign one automatically on the frontend
  // This avoids mismatches between numeric UIDs and String ObjectIds
  return RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERT,
    channelName,
    0,
    agoraRole,
    expireTime
  );
};