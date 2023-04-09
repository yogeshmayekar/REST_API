import Joi from 'joi'
import CustomErrorHandler from '../services/CustomErrorHandler';
import { RefreshToken, User } from '../models';
import bcrypt from 'bcrypt';
import JwtService from '../services/JwtService';
import { REFRESH_SECRET } from '../config'

// created a object to write a logic of the routes
const registerController = {
    // logic of register route 
    async register(req, res, next) {
        //1.1 validation
    
        const registerSchema = Joi.object({
          name:Joi.string().min(3).max(30).required(),
          email:Joi.string().email().required(),
          password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
          repeat_password:Joi.ref('password')
        })

        const {error} = registerSchema.validate(req.body);

        if (error){
            return next(error)
        }

        //1.2 check user is in the database already
        try{
            const Exist = await User.exists({email:req.body.email});//it will returen true or false
            if(Exist===true) {
                return next(CustomErrorHandler.alreadyExist("Email Id is already Exist"));
            }
        }catch(err){
            return next(err)
        }

        //1.3 Hashing password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        //1.4 prepare the model
        const { name, email }= req.body;
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
    
        let accessToken;
        let refreshToken;
        try{
            const result = await user.save();// new user saved in the database

            // token
            accessToken = JwtService.sign({_id: result._id, role: result.role});
            refreshToken = JwtService.sign({_id: result._id, role: result.role}, '1y',REFRESH_SECRET);
            // whitelist inside the database
            await RefreshToken.create({token:refreshToken})
        }catch(err){
            return next(err)
        }



        res.json({access_token :accessToken, refresh_token:refreshToken})
    }

}

export default registerController;