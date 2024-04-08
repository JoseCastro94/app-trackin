import AWS from 'aws-sdk'

const SESConfig = {
    apiVersion: "2010-12-01",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1"
}

AWS.config.update(SESConfig)

export const s3 = new AWS.S3({ apiVersion: '2006-03-01' })