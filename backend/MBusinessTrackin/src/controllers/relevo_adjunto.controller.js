import { RelevoAdjunto } from '../models/RelevoAdjunto.js'

import { v4 as uuidv4 } from 'uuid'

//const usuario_activo = "45631343"

import { s3 } from '../operations/S3.js'

export const upFile = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    try {
        const {
            IdRelevoAlmacen
        } = req.params

        let now = new Date()
        let year = now.getFullYear()
        let month = now.getMonth() + 1
        let attached = req.files.attached
        let uploadParams = { Bucket: process.env.BUCKET_S3, Key: '', Body: '' }

        let ext = String(attached.name).split('.').pop()

        uploadParams.Body = attached.data
        uploadParams.Key = `relevos/${year}/${month}/${uuidv4()}.${ext}`

        // call S3 to retrieve upload file to specified bucket
        s3.upload(uploadParams, async (err, data) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            } if (data) {

                let newRelevoAdjunto = await RelevoAdjunto.create(
                    {
                        Key: data.Key,
                        Nombre: attached.name,
                        Ext: ext,
                        Mime: attached.mimetype,
                        UsuarioCreacion: usuario_activo,
                        UsuarioModifica: usuario_activo,
                        IdRelevoAlmacen: IdRelevoAlmacen
                    }
                )
                res.json(newRelevoAdjunto)
            }
        })
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const delFile = async (req, res) => {
    try {
        const {
            IdAdjunto
        } = req.params

        await RelevoAdjunto.destroy({
            where: {
                IdAdjunto
            }
        })

        res.json(true)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getFile = async (req, res) => {
    try {
        const {
            IdAdjunto
        } = req.params

        const attached = await RelevoAdjunto.findOne({
            where: {
                IdAdjunto
            }
        })

        const params = {
            Bucket: process.env.BUCKET_S3,
            Key: attached.Key
        }

        // call S3 to retrieve upload file to specified bucket
        s3.headObject(params, function (err, data) {
            if (err) {
                // an error occurred
                console.error(err)
                return next()
            }
            var stream = s3.getObject(params).createReadStream();

            // forward errors
            stream.on('error', function error(err) {
                //continue to the next middlewares
                return next()
            });

            //Add the content type to the response (it's not propagated from the S3 SDK)
            res.set('Content-Type', attached.Mime)
            res.set('Content-Length', data.ContentLength)
            res.set('Last-Modified', data.LastModified)
            res.set('ETag', data.ETag)

            stream.on('end', () => {
                console.log('Termine la carga de archivo')
            });
            //Pipe the s3 object to the response
            stream.pipe(res)
        })
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getAttacheds = async (req, res) => {
    try {
        const {
            IdRelevoAlmacen
        } = req.params

        const adjuntos = await RelevoAdjunto.findAll({
            attributes: [
                "IdAdjunto",
                "Key",
                "Nombre",
                "Ext",
                "Mime",
            ],
            where: {
                IdRelevoAlmacen
            }
        })
        res.json(adjuntos)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}