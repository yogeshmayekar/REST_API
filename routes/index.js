import express from 'express';
import {registerController} from '../controllers'; //imported logic of the register routes

const router = express.Router();

// created the register route 
router.post('/register', registerController.register);






export default router;