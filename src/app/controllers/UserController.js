import * as Yup from 'yup';
import User from '../models/User.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';

class UserController {

    //Adicionar Usuário
    async store(req, res) {
        try {
            const validator = Yup.object().shape({
                password: Yup.string().required('O campo Nome não pode ser vazio.').min(6, 'Password deve ter no minímo 6 caracteres.'),
                cpf: Yup.string().required('O campo CPF não pode ser vazio.'),
                email: Yup.string().required('O campo Email não pode ser vazio.').email('Informe um Email válido.'),
                name: Yup.string().required('O campo Nome não pode ser vazio.'),
            });

            await validator.validate(req.body);

            var data = req.body;

            const checkCpf = await User.findOne({ cpf: data.cpf });

            if (checkCpf) {
                return res.status(401).json({
                    error: true,
                    code: 104,
                    message: "Error: Já existe um usuário cadastrado com este CPF!"
                });
            }

            const checkEmail = await User.findOne({ email: data.email });

            if (checkEmail) {
                return res.status(401).json({
                    error: true,
                    code: 120,
                    message: "Error: Já existe um usuário cadastrado com este Email!"
                });
            }

            data.password = await bcrypt.hash(data.password, 8);

            const user = await User.create(data, (err) => {
                if (err) return res.status(500).json({
                    error: true,
                    code: 105,
                    message: "Error: Não foi possivel cadastrar o usuário!"
                });

                return res.status(200).json({
                    error: false,
                    message: "Usuário cadastrado com sucesso!",
                    data: user
                });
            });
        } catch (err) {
            return res.status(406).json({
                error: true,
                code: 106,
                message: 'Error: ' + err.errors[0]
            });
        }

    }

    //Listar Usuários
    async index(req, res) {
        try {
            const { page = 1 } = req.query;
            const { limit = 40 } = req.query;
            const query = {};
            const options = { select: "_id name cpf email", page, limit };

            const users = await User.paginate(query, options);
            return res.json({
                error: false,
                users: users
            });

        } catch (err) {
            return res.status(500).json({
                error: true,
                code: 103,
                message: "Error: Não foi possivel executar a solicitação!"
            });
        }
    }


    //Visualizar Usuário
    async show(req, res) {

        try {
            const checkUser = await User.findOne({ _id: req.params.id });

            if (!checkUser) {
                return res.status(401).json({
                    error: true,
                    code: 111,
                    message: "Error: Usuário não encontrado!"
                });
            }

            return res.status(200).json({
                error: false,
                user: {
                    id: checkUser._id,
                    name: checkUser.name,
                    email: checkUser.email
                }
            });

        } catch (err) {
            return res.status(500).json({
                error: true,
                code: 112,
                message: "Error: Não foi possivel processar a requisição."
            });
        }
    }

    //Atualizar Usuário
    async update(req, res) {
        try {
            const data = req.body;

            const validator = Yup.object().shape({
                _id: Yup.string().required('O campo ID do usuário não pode ser vazio.'),
                password: Yup.string().min(6, 'Password deve ter no minímo 6 caracteres.'),
                email: Yup.string().required('O campo Email não pode ser vazio.').email('Informe um Email válido.'),
                cpf: Yup.string().required('O campo CPF não pode ser vazio.'),
                name: Yup.string().required('O campo Nome não pode ser vazio.')
            });
    
            await validator.validate(req.body);

            const checkUser = await User.findOne({ _id: data._id });

            if (!checkUser) {
                return res.status(401).json({
                    error: true,
                    code: 115,
                    message: "Error: Usuário não encontrado!"
                });
            }
    
            if (data.cpf != checkUser.cpf) {
                return res.status(401).json({
                    error: true,
                    code: 118,
                    message: "Error: Não foi possivel atualizar!"
                });
            } 
    
            if (data.email != checkUser.email) {
                const emailExists = await User.findOne({ email: data.email });
    
                if (emailExists) {
                    return res.status(401).json({
                        error: true,
                        code: 119,
                        message: "Error: Este email já está cadastrado!"
                    });
                }
            }

            if (data.password) {
                data.password = await bcrypt.hash(data.password, 8);
            }

            await User.updateOne({ _id: data._id }, data, (err) => {
                if (err) return res.status(500).json({
                    error: true,
                    code: 117,
                    message: "Error: Não foi possivel atualizar o usuário!"
                });

                return res.status(200).json({
                    error: false,
                    message: "Usuário atualizado com sucesso!",
                    data
                });
            }).clone();

        } catch (err) {
            return res.status(406).json({
                error: true,
                code: 116,
                message: 'Error: ' + err.errors[0]
            });
        }
    }

    //Excluir Usuário
    async delete(req, res) {
        try {
            const checkUser = await User.findOne({ _id: req.params.id });

            if (!checkUser) {
                return res.status(401).json({
                    error: true,
                    code: 109,
                    message: "Error: Usuário não encontrado!"
                });
            }

            await User.deleteOne({ _id: req.params.id });
            return res.status(200).json({
                error: false,
                message: "Usuário excluído com sucesso!"
            });

        } catch (err) {
            return res.status(500).json({
                error: true,
                code: 110,
                message: "Error: Não foi possivel executar a solicitação!"
            });
        }
    }

}

export default new UserController();
