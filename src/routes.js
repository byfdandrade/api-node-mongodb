import { Router } from 'express';
import multer from "multer";
import multerUpImgUser from "./app/middlewares/uploadImgUser";
import mongoose from 'mongoose';
import UserModel from './app/models/User';
import UserController from './app/controllers/UserController';
import LoginController from './app/controllers/LoginController';
import ProfileController from './app/controllers/ProfileController';
import authMiddleware from './app/middlewares/auth';
import ProfileImgController from './app/controllers/ProfileImgController';


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