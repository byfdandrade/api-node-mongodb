import { Router } from 'express';
import multer from "multer";
import multerUpImgUser from "./app/middlewares/uploadImgUser.js";
import mongoose from 'mongoose';
import UserModel from './app/models/User.js';
import UserController from './app/controllers/UserController.js';
import LoginController from './app/controllers/LoginController.js';
import ProfileController from './app/controllers/ProfileController.js';
import authMiddleware from './app/middlewares/auth.js';
import ProfileImgController from './app/controllers/ProfileImgController.js';


const routes = new Router();
const uploadImgUser = multer(multerUpImgUser);

routes.post('/login', LoginController.store); //Login

routes.get('/users', authMiddleware,UserController.index); //Listar Usuários
routes.get('/users/:id', authMiddleware,UserController.show); //Visualizar Usuário
routes.post('/users', authMiddleware,UserController.store); //Cadastrar Usuário
routes.put('/users', authMiddleware, UserController.update); //Atualizar Usuário
routes.delete('/users/:id', authMiddleware, UserController.delete); //Excluir Usuário

routes.get('/profile', authMiddleware, ProfileController.show);//Perfil Usuário
routes.put('/profile', authMiddleware, ProfileController.update);//Atualiza Usuário
routes.put('/profile-img', authMiddleware, uploadImgUser.single('file'), ProfileImgController.update);//Atualiza Imagem do Usuário

export default routes;