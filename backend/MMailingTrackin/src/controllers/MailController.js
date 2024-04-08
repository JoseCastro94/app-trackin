import CustomMail from "../utils/CustomMail.js";

class MailController {
    static send = async (req, res) => {
        try {
            const {email, subject, template, data, attachments = []} = req.body
            await CustomMail.send(email, subject, template, data, attachments)
            return res.status(200).json({
                success: true
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }
}

export default MailController
