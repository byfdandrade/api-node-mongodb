import { Router } from 'express';
import mongoose from 'mongoose';
import UserModel from './app/models/User';
import UserController from './app/controllers/UserController';
import LoginController from './app/controllers/LoginController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();


routes.get('/users', authMiddleware,UserController.index);
routes.post('/login', LoginController.store);
routes.post('/users', authMiddleware,UserController.store);
routes.delete('/users/:id', authMiddleware, UserController.delete);

export default routes;