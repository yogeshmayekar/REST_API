import express from 'express';
import {registerController, loginController, userController, refreshController, productController} from '../controllers'; //imported logic of routes
import authentication from '../middlewares/authentication';
import admin from '../middlewares/admin';

const router = express.Router();

// created the register route 
router.post('/register', registerController.register);
router.post('/login', loginController.login)
router.get('/user',authentication, userController.userProfile)
router.post('/refresh', refreshController.refresh)
router.post('/logout', loginController.logout)


router.post('/products', [authentication, admin], productController.store)
router.put('/products/:id', [authentication, admin], productController.update)
router.delete('/products/:id', [authentication, admin], productController.destroy )





export default router;