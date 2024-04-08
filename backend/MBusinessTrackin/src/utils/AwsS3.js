import {s3} from "../operations/S3.js";
class S3 {
    static async uploadFile(Key, Body, Bucket = process.env.BUCKET_S3) {
        try {
            return await s3.putObject(
                {
                    Bucket,
                    Key,
                    Body
                },
            ).promise();
        } catch (error) {
            throw new Error(error);
        }
    }

    static downloadFile(res, Key, Mime, Bucket = process.env.BUCKET_S3) {
        const params = { Bucket, Key }
        s3.headObject(params, function (err, data) {
            if (err) {
                console.error(err)
                return next()
            }
            var stream = s3.getObject(params).createReadStream();

            stream.on('error', function error(err) {
                return next()
            });

            //Add the content type to the response (it's not propagated from the S3 SDK)
            res.set('Content-Type', Mime)
            res.set('Content-Length', data.ContentLength)
            res.set('Last-Modified', data.LastModified)
            res.set('ETag', data.ETag)

            stream.on('end', () => {
                console.log('Termine la carga de archivo')
            });
            //Pipe the s3 object to the response
            stream.pipe(res)
        })
    }

    static async getUrlFile(key, bucket = process.env.BUCKET_S3) {
        try {
            return await s3.getSignedUrlPromise('putObject',
                {
                    Bucket: bucket,
                    Key: key,
                });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async getSignedUrl(key, bucket = process.env.BUCKET_S3) {
        try {
            return await s3.getSignedUrlPromise('putObject',
                {
                    Bucket: bucket,
                    Key: key,
                    Expires: 60 * 5,
                    ContentType: "image/png",
                },
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default S3
