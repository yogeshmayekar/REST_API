import mongoose from 'mongoose';
import { APP_URL } from '../config';
const Schema = mongoose.Schema;

// schema created for register user in database
const productSchema = new Schema({
    name: {type: String, required:true},
    price: {type: Number, required:true},
    size: {type: String, required:true},
    image: {type: String, required:true, get:((image)=>{
        // need to add comple url including domain 
        return `${ APP_URL }/${image}`;
    })}, // to save the path of thw image
},{timestamps:true, id:false});

mongoose.set('toJSON', { getters: true });

export default mongoose.model('Product', productSchema ,'products'); //model created