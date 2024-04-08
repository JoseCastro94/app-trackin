import Nodemailer from "nodemailer"
import GenerateTemplateCorreo from "./GenerateTemplateCorreo.js";
import path from "path";

class CustomMail {
    static send = async (to, subject, template, data, adjuntos = []) => {
        const contenidoHtml = GenerateTemplateCorreo.build(template, data)
        let attachments = [{
            filename: 'logo.jpeg',
            path: path.join(process.cwd(), 'src', 'public', 'logo.jpeg'),
            cid: 'logo'
        }]

        if (adjuntos.length > 0) {
            attachments = attachments.concat(adjuntos)
        }

        const transport = Nodemailer.createTransport( {
            host: "smtp.office365.com",
            port: 587,
            tls: {
                ciphers:'SSLv3',
                rejectUnauthorized: false
            },
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const options = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: contenidoHtml,
            attachments
        }

        return transport.sendMail(options, (error, info) => {
            if (error) {
                console.log('ERROR SEND MAIL', JSON.stringify(error))
                return {
                    success: false,
                    error
                }
            }
            console.log('EMAIL ENVIADO')
            return {
                success: true,
                info
            }
        })
    }
}

export default CustomMail
