import express from 'express';
import {registerController, loginController} from '../controllers'; //imported logic of routes

const router = express.Router();

// created the register route 
router.post('/register', registerController.register);
router.post('/login', loginController.login)





export default router;