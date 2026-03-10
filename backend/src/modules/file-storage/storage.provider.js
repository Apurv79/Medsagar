import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "../../configs/env.config.js";

const s3Client = new S3Client({
    region: env.AWS.REGION,
    credentials: {
        accessKeyId: env.AWS.ACCESS_KEY_ID,
        secretAccessKey: env.AWS.SECRET_ACCESS_KEY
    }
});

/**
 * Upload buffer to S3
 */
export const uploadToS3 = async ({ buffer, key, contentType }) => {
    const fullKey = `${env.AWS.S3_PREFIX}${key}`;

    const command = new PutObjectCommand({
        Bucket: env.AWS.BUCKET_NAME,
        Key: fullKey,
        Body: buffer,
        ContentType: contentType
    });

    await s3Client.send(command);

    // Construct standard file URL
    return `https://${env.AWS.BUCKET_NAME}.s3.${env.AWS.REGION}.amazonaws.com/${fullKey}`;
};

/**
 * Delete object from S3
 */
export const deleteFromS3 = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: env.AWS.BUCKET_NAME,
        Key: key
    });

    await s3Client.send(command);
};

/**
 * Generate a signed URL for temporary access
 */
export const generateSignedDownloadUrl = async (key, expiresId = 300) => {
    const command = new GetObjectCommand({
        Bucket: env.AWS.BUCKET_NAME,
        Key: key
    });

    return await getSignedUrl(s3Client, command, { expiresIn: expiresId });
};