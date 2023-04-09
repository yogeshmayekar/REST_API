import Joi from "joi";
import { RefreshToken, User} from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";
import { REFRESH_SECRET } from "../config";

const refreshController = {
    async refresh(req, res, next){
        //validation
        const refreshSchema = Joi.object({
            refresh_token:Joi.string().required(),
        });

        const { error } = refreshSchema.validate(req.body)

        if (error) {
            return next(error);
        }

        //check in the database
        let refreshToken;
        try{
            refreshToken = await RefreshToken.findOne({token:req.body.refresh_token})
            if(!refreshToken){
                return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
            }

            //verify refresh token
            let userId;
            try{
                const {_id}= JwtService.verify(refreshToken.token, REFRESH_SECRET);
                userId = _id
            } catch(err){
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token2'))
            }

            //check user in datadbase
            const user = await User.findOne({_id:userId});
            if(!user){
                return next(CustomErrorHandler.unAuthorized('no user found'))
            }

            //generate token
            const accessToken = JwtService.sign({_id:user._id, role: user.role});
            refreshToken = JwtService.sign({_id: user._id, role: user.role}, '1y',REFRESH_SECRET);
             // whitelist inside the database
            await RefreshToken.create({token:refreshToken})

            res.json({access_token:accessToken, refresh_token:refreshToken})

 
        }catch(err){
            return next(new Error('Something went wrong' + err.message))
        }
}
}
export default refreshController;