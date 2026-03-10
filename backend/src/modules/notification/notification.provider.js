import admin from "firebase-admin";
import axios from "axios";

export const sendFCM = async (token, payload) => {

    if (!token) return;

    await admin.messaging().send({
        token,
        notification: {
            title: payload.title,
            body: payload.message
        },
        data: payload.data || {}
    });

};

export const sendSMS = async (phone, variables) => {

    if (!phone) return;

    await axios.post(
        "https://api.msg91.com/api/v5/flow/",
        {
            template_id: process.env.MSG91_TEMPLATE_ID,
            sender: process.env.MSG91_SENDER_ID,
            short_url: "0",
            recipients: [
                {
                    mobiles: `91${phone}`,
                    ...variables
                }
            ]
        },
        {
            headers: {
                authkey: process.env.MSG91_AUTH_KEY
            }
        }
    );

};