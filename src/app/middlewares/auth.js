import jwt from 'jsonwebtoken';
import {promisify} from 'util';
import configAuth from '../../config/auth';
import { decode } from 'punycode';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: true,
            code: 101,
            message: "Error: Token não informado."
        })
    }

    const [bearer, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, configAuth.secret);
        req.userID = decoded.id;
        return next();

    } catch (err) {
        return res.status(401).json({
            error: true,
            code: 101,
            message: "Error: Token inválido."
        })
    }

}