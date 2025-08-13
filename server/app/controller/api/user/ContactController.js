const contactModel = require("../../../model/contactmodel");



class ContactController {
    async sendmessage(req, res) {
        console.log(req.body);



        try {
            const { fullname, email, phone, subject, message, is_deleted } = req.body
            const existinguser = await contactModel.findOne({ email })
            if (existinguser) {
                return res.status(409).json({
                    status: false,
                    message: "Email is already registered",
                });
            }

            const user = await new contactModel({
                fullname, email, phone, subject, message, is_deleted
            })
            const data = await user.save()
            return res.status(201).json({
                status: true,
                message: 'User message send successfully',
                data: data
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                status: false,
                message: error.message

            })
        }
    }
    
}
module.exports = new ContactController()