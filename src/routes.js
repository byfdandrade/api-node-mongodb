import { Router } from 'express';
import mongoose from 'mongoose';
import UserModel from './app/models/User';
import UserController from './app/controllers/UserController';
import LoginController from './app/controllers/LoginController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/login', LoginController.store); //Login

routes.get('/users', authMiddleware,UserController.index); //Listar Usuários
routes.get('/users/:id', authMiddleware,UserController.show); //Visualizar Usuário
routes.post('/users', authMiddleware,UserController.store); //Cadastrar Usuário
routes.delete('/users/:id', authMiddleware, UserController.delete); //Excluir Usuário

export default routes;