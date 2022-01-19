import bcrypt from "bcryptjs/dist/bcrypt";
import User from "../models/User";

class LoginController {
    async store(req, res) {

        const { cpf, password } = req.body;

        const checkUser = await User.findOne({ cpf: cpf });

        if (!checkUser) {
            return res.status(401).json({
                error: true,
                code: 110,
                message: "Error: Usuário não encontrado."
            });
        }

        if (!(await bcrypt.compare(password, checkUser.password))) {
            return res.status(401).json({
                error: true,
                code: 111,
                message: "Error: Senha inválida."
            });
        }

        return res.json({
            user:{
                id: checkUser._id,
                name: checkUser.name,
                cpf: checkUser.cpf,
                email: checkUser.email
            }
        })
    }
}

export default new LoginController();
