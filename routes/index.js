import express from 'express';
import {registerController, loginController, userController, refreshController, productController} from '../controllers'; //imported logic of routes
import authentication from '../middlewares/authentication';

const router = express.Router();

// created the register route 
router.post('/register', registerController.register);
router.post('/login', loginController.login)
router.get('/user',authentication, userController.userProfile)
router.post('/refresh', refreshController.refresh)
router.post('/refresh', refreshController.refresh)
router.post('/logout', loginController.logout)


router.post('/products', productController.store)





export default router;