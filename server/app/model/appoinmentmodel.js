const mongoose = require('mongoose')
const Schema = mongoose.Schema
const appointmentSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true
    },
    designerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true
    },
    user:String,
    designername:String,
    status:String,
    slotDate:{
        type:String,
        required:true
    },
    slotTime: {
        type: String,
        required: true
    },
    // status: { type: String, default: 'booked' },
    // userdata: {
    //     type: Object,
    //     required: true
    // },
    // designerData: {
    //     type: Object, 
    //     required: true
    // },
    // amount:{
    //     type:Number,
    //     require:true
    // },
    // date:{
    //     type:Number,
    //     required:true
    // },
    // cancelled:{
    //     type:Boolean,
    //     default:false
    // },
    // payment:{
    //     type:Boolean,
    //     default:false
    // },
    // isCompleted:{
    //     type:Boolean,
    //     default:false
    // }
},{ timestamps: true })
const appointmentModel=mongoose.model('appointment',appointmentSchema)
module.exports=appointmentModel