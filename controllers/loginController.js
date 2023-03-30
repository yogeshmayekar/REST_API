import Joi from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler';
import Jwtservice from '../services/JwtService';
import bcrypt from 'bcrypt';
import { User } from '../models';

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
            const accessToken = Jwtservice.sign({_id:user._id, role: user.role});
            res.json({access_token:accessToken})
        }catch(err){
            return next(err);
        }
    }
}

export default loginController;