import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import configAuth from "../../config/auth.js";

class LoginController {
    async store(req, res) {

        const { cpf, password } = req.body;

        try {
            const checkUser = await User.findOne({ cpf: cpf });

            if (!checkUser) {
                return res.status(401).json({
                    error: true,
                    code: 100,
                    message: "Error: Usuário não encontrado!"
                });
            }

            if (!(await bcrypt.compare(password, checkUser.password))) {
                return res.status(401).json({
                    error: true,
                    code: 101,
                    message: "Error: Senha inválida!"
                });
            }

            return res.status(200).json({
                user: {
                    id: checkUser._id,
                    name: checkUser.name,
                    cpf: checkUser.cpf,
                    email: checkUser.email
                },
                token: jwt.sign({ id: checkUser._id }, configAuth.secret, { expiresIn: configAuth.expiresIn })
            });

        } catch (err) {
            return res.status(500).json({
                error: true,
                code: 102,
                message: "Error: Não foi possivel processar a requisição!"
            });
        }

    }
}

export default new LoginController();
