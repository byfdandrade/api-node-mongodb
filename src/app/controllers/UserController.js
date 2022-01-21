import * as Yup from 'yup';
import User from '../models/User';
import bcrypt from 'bcryptjs'

class UserController {

    //Listar Usuários
    async index(req, res) {
        try {
            const {page = 1} = req.query;
            const {limit = 40} = req.query;
            const query = {};
            const options = {select: "_id name cpf email", page, limit};
             
            const users = await User.paginate(query, options);
            return res.json({
                error: false,
                users: users
            });

        } catch (err) {
            return res.status(400).json({
                error: true,
                code: 102,
                message: "Error: Não foi possivel executar a solicitação."
            });
        }
    }


    //Adiciona Usuário
    async store(req, res) {
        try {
            const checkCpf = await User.findOne({ cpf: req.body.cpf });

            if (checkCpf) {
                return res.status(400).json({
                    error: true,
                    code: 102,
                    message: "Error: Já existe um usuário cadastrado com este CPF."
                });
            }

            const validator = Yup.object().shape({
                password: Yup.string().required('O campo Nome não pode ser vazio.').min(6, 'Password deve ter no minímo 6 caracteres.'),
                cpf: Yup.string().required('O campo CPF não pode ser vazio.'),
                email: Yup.string().required('O campo Email não pode ser vazio.').email('Informe um Email válido.'),
                name: Yup.string().required('O campo Nome não pode ser vazio.'),
            });

            await validator.validate(req.body);
            var dados = req.body;
            dados.password = await bcrypt.hash(dados.password, 8);

            const user = await User.create(req.body, (err) => {
                if (err) return res.status(400).json({
                    error: true,
                    code: err.code,
                    message: "Error: Não foi possivel cadastrar o usuário."
                });

                return res.status(200).json({
                    error: false,
                    message: "Usuário cadastrado com sucesso!",
                    data: user
                });
            });
        } catch (err) {
            return res.status(400).json({
                error: true,
                code: 101,
                message: 'Error: ' + err.errors[0]
            });
        }

    }

    //Excluir Usuário
    async delete(req, res) {
        try {
            const checkUser = await User.findOne({ _id: req.params.id });

            if (!checkUser) {
                return res.status(400).json({
                    error: true,
                    code: 101,
                    message: "Error: Usuário não encontrado."
                });
            }

            await User.deleteOne({ _id: req.params.id });
            return res.json({
                error: false,
                message: "Usuário excluído com sucesso!"
            });
        } catch (err) {
            return res.status(400).json({
                error: true,
                code: 101,
                message: "Error: Não foi possivel apagar o usuário." + err
            });
        }
    }
}

export default new UserController();
