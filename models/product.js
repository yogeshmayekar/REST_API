import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// schema created for register user in database
const productSchema = new Schema({
    name: {type: String, required:true},
    price: {type: Number, required:true},
    size: {type: String, required:true},
    image: {type: String, required:true}, // to save the path of thw image
    role: {type: String, default:'customer'},
},{timestamps:true});

export default mongoose.model('Product', productSchema ,'products'); //model created