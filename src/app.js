import express from 'express';
import routes from './routes';
import './config/connection';
import './helpers/funcoes';
class App {

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    //Executado antes das Rotas
    middlewares(){ 
        this.app.use(express.json());
    }

    routes() {
        this.app.use(routes);
    }
}

export default new App().app;