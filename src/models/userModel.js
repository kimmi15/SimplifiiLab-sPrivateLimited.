const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    otp:{
        type:Number,
        trim:true,
        unique:true,
    },
    wrongAttempt:{
        type:Number,
        default:0
    },
    //5 MIN
    updatedAt: { type: Date, expires: 18000 }
})
userSchema.index({updatedAt: 1},{expireAfterSeconds: 18000});
module.exports = mongoose.model('User', userSchema)