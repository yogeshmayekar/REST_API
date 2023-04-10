import { Product } from "../models"
import fs from "fs";
const path = require('path');
import multer from 'multer';
import CustomErrorHandler from "../services/CustomErrorHandler";
import ProductSchema from "../validators/productValidator";


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
    },

    // update method 
    update(req, res ,next){
        handleMultipart(req, res, async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }

            let filePath;
            if(req.file){
            filePath = req.file.path;  
        }
       
        // validate product details
       
        const { error } = ProductSchema.validate(req.body)

        if (error) {
            //delete image if validation fails
            if(req.file) {
                fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message))
                    }
                
                })
            }
            return next(error);
        }

        const { name, price, size }=req.body;
        let document;
        try{
            document = await Product.findOneAndUpdate({_id: req.params.id},{
                name,
                price,
                size,
                ...(req.file && { image :filePath})
            });

        }catch(err){
            return next(err)
        }

        res.status(201).json(document);
        });
    },

    // delete product method 
    async destroy(req, res, next){
        const document= await Product.findOneAndRemove({_id:req.params.id});
        if(!document) {
            return next(new Error('nothing to delete'))
        }

        //image delete
        const imagePath = document.image;
        fs.unlimk(`${appRoot}/${imagePath}`, (err)=>{
            if(err){
                return next(CustomErrorHandler.serverError())
            }
        })
        res.json(document);
    },

    // method of list of all product
    async index(req, res, next){
        let documents;
        try{
            documents = await Product.find().select('-updatedAt -__v').sort({_id:-1})
        }catch(err){
            return next(CustomErrorHandler.serverError())
        }
        return res.json(documents)
    }


}

export default productControlle;