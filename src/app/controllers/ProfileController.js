import * as Yup from 'yup';
import User from '../models/User.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js'
import config from '../../config/config.js';

class ProfileController {

    async show(req, res) {
        User.findOne({ _id: req.userId }, '_id name cpf email fileName').then((user) => {

            var urlImg = config.url+"/files/users/"+ user.fileName;

            return res.json({
                erro: false,
                user: user,
                urlImg: urlImg
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                code: 121,
                message: "Error: Perfil não encontrado!"
            });
        });
    }

    //Atualizar Usuário
    async update(req, res) {
        try {
            const data = req.body;

            const validator = Yup.object().shape({
                password: Yup.string().min(6, 'Password deve ter no minímo 6 caracteres.'),
                email: Yup.string().required('O campo Email não pode ser vazio.').email('Informe um Email válido.'),
                name: Yup.string().required('O campo Nome não pode ser vazio.')
            });

            await validator.validate(req.body);

            const checkUser = await User.findOne({ _id: req.userId });

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

            await User.updateOne({ _id: req.userId }, data, (err) => {
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
}

export default new ProfileController();