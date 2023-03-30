import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";

//meddleware to check token provided by the client is valied or not
const authentication = (req, res, next)=>{
    let authHeader=req.headers.authorization;
    console.log(authHeader)
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized())
    } 
    
    const token = authHeader.split(' ')[1];
    console.log(token)

    try{
        const {_id, role }= JwtService.verify(token);
        req.user={};
        req.user._id= _id;
        req.user.role= role;
        next();

    }catch(err){
      return next(CustomErrorHandler.unAuthorized()) 
    }
}

export default authentication;