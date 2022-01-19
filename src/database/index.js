/**
 * API NodeJS + MongoDB
 * @author : Fernando Andrade - www.fdandrade.com.br
 * @email : dev@fdandrade.com.br
 * @version : 1.0
 * @since : 17/01/2022
 * * */

import mongoose from 'mongoose';

class DataBase {
    constructor() {
        this.mongoDataBase();
    } 

    mongoDataBase() {
        const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;
        mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('Conexão com o MongoDB realizada com sucesso!');
        }).catch((err) => {
            console.log('Oops, não foi possivel se conectar ao MongoDB! => ' + err);
        });
    }
}

export default new DataBase();

