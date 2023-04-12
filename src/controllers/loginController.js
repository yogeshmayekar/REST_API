import Joi from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler';
import JwtService from '../services/JwtService';
import bcrypt from 'bcrypt';
import { User, RefreshToken} from '../models';
import { REFRESH_SECRET } from '../src/config';

const loginController={
    async login(req, res, next){
        //validation
        const loginSchema = Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });

        const { error } = loginSchema.validate(req.body)

        if (error) {
            return next(error);
        }

        //check email is in database or not
        try{
            const user = await User.findOne({email:req.body.email})
            if(!user){
                return next(CustomErrorHandler.incorerctCredentials())
            }

            //compare the password
            const match = await bcrypt.compare(req.body.password, user.password)
            if(!match){
                return next(CustomErrorHandler.incorerctPassword())
            }

            //token 
            const accessToken = JwtService.sign({_id:user._id, role: user.role});
            const refreshToken = JwtService.sign({_id: user._id, role: user.role}, '1y',REFRESH_SECRET);
             // whitelist inside the database
             await RefreshToken.create({token:refreshToken})

            res.json({access_token:accessToken, refresh_token:refreshToken})
        }catch(err){
            return next(err);
        }
    },

    //another method for logout
    async logout(req, res, next){
        //validation
        const refreshSchema = Joi.object({
            refresh_token:Joi.string().required(),
        });

        const { error } = refreshSchema.validate(req.body)

        if (error) {
            return next(error);
        }

        try{
            await RefreshToken.deleteOne({token:req.body.refresh_token})
        }catch(err){
            return next(new Error('Something went wrong in database'))
        }
        res.json({status:"Log out"})
    }
}

export default loginController;