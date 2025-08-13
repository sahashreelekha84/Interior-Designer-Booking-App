const mongoose = require('mongoose')
const Schema=mongoose.Schema
const userSchema=new Schema({

    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        required:true,
        
    },
     otp:{
         type:String,
          require:true
    },
    otpExpiry:{
        type:Date
    },
    phone:{
        type:String,
        require:true
    },
    password:{
     type:String,
     require:true
    },
    image:{
        type:String,
        default:"image"
    },
    role:{
        type:String,
        
        enum:['admin','Designer','user'],
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false
    }

},
{ timestamps: true })

const userModel=mongoose.model('user',userSchema)
module.exports=userModel