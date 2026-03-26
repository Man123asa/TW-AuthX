const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema
({
    username:String,
    publicKey:Object,
    jkt:String
});
module.exports=mongoose.model('User',UserSchema);
