const mongoose = require('mongoose')
const Schema = mongoose.Schema
const contactSchema = new Schema({

    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,

    },

    phone: {
        type: String,
        require: true
    },
    subject: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    is_deleted:{
        type:Boolean,
        default:false
    }

},
    { timestamps: true })

const contactModel = mongoose.model('contact', contactSchema)
module.exports = contactModel