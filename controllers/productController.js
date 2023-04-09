import { Product } from "../models"
import Joi from "joi";
import fs from "fs";
const path = require('path');
import multer from 'multer';
import CustomErrorHandler from "../services/CustomErrorHandler";


const storage= multer.diskStorage({
    destination:(req, file, cb)=> cb(null, 'uploads/'),
    filename: (req, file, cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName);
    }
});

const handleMultipart= multer({storage, limits:{fileSize: 1000000*5}}).single('image')// 5 mb

const productControlle ={
    async store(req, res, next){
        //to store image of the product
        handleMultipart(req, res, async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }

            const filePath = req.file.path;
           
            // validate product details
            const ProductSchema = Joi.object({
                name:Joi.string().required(),
                price:Joi.number().required(),
                size:Joi.string().required(),            
                
            });
    
            const { error } = ProductSchema.validate(req.body)
    
            if (error) {
                //delete image if validation fails
                fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message))
                    }
                
                }) //rootfolder/uploads/filename.png
                return next(error);
            }

            const { name, price, size }=req.body;
            let document;
            try{
                document = await Product.create({
                    name,
                    price,
                    size,
                    image:filePath
                });

            }catch(err){
                return next(err)
            }

            res.status(201).json(document);
        });
    }

}

export default productControlle;