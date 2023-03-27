import { DEBUG_MODE } from '../config'
import { validationError } from 'joi'

const errorHandler =(err, req, res, next)=>{
    let statusCode =500;
    let data = {
        message:'Internal server error',
        ...(DEBUG_MODE === 'true' && {originalError:err.message})  
    }

    if (err instanceof validationError) {
        statusCode = 402;
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json(data)
}

export default errorHandler;