import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// schema created for register user in database
const refreshTokenSchema = new Schema({
    token: {type: String, unique:true},
},{timestamps:false});

export default mongoose.model('RefreshToken', refreshTokenSchema ,'refreshTokens'); //model created