import { User } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";

const userContrioller = {
    async userProfile(req, res, next){
        try{
            const user = await User.findOne({_id:req.user._id}).select('-password -updatedAt -__V')
            if(!user){
                return next(CustomErrorHandler.notFound())
            }
            res.json(user)
        }catch(err){
            return next(err)
        }
    }
};
export default userContrioller;