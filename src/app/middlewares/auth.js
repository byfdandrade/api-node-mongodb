import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import configAuth from '../../config/auth';

export default async (req, res, next) => {

    const authHeader = req.headers.authorization;

    try {
        if (!authHeader) {
            return res.status(401).json({
                error: true,
                code: 113,
                message: "Error: Token não informado!"
            })
        }
        
        const [bearer, token] = authHeader.split(' ');

        const decoded = await promisify(jwt.verify)(token, configAuth.secret);
        req.userId = decoded.id;
        
        return next();

    } catch (err) {
        return res.status(401).json({
            error: true,
            code: 114,
            message: "Error: Token inválido!"
        })
    }

}