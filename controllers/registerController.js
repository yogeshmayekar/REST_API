import Joi from 'joi'
// created a object to write a logic of the routes
const registerController = {
    // logic of register route 
    register(req, res, next) {
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
        res.json({msg: "hello from yogasana"})
    }

}

export default registerController;