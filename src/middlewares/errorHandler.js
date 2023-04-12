import { DEBUG_MODE } from '../src/config'
import { ValidationError }  from 'joi'
import CustomErrorHandler from '../services/CustomErrorHandler';

const errorHandler =(err, req, res, next)=>{
    let statusCode =500;
    let data = {
        message:'Internal server error',
        ...(DEBUG_MODE === 'true' && {originalError:err.message})  
    }

    if (err instanceof ValidationError) {
        statusCode = 402;
        data = {
            message: err.message
        }
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data = {
            message : err.message
        }
    }

    return res.status(statusCode).json(data)
}

export default errorHandler;