import express from "express";
import { APP_PORT, DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import routes from './routes';
import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

//Database connection
mongoose.connect(DB_URL)
    .then(() => console.log('Database connected!'))
    .catch((error) => console.log(error));

const app=express(); //created express instance

app.use(express.json()) 
app.use('/api', routes);


app.use(errorHandler)
app.listen(APP_PORT, ()=>{
    console.log(`Listining on ${APP_PORT}`)
})