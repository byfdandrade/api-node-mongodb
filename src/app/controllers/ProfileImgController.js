import fs from "fs";
import User from "../models/User.js";

class ProfileImgController {
  async update(req, res) {

    if(!req.file){
      return res.status(401).json({
        error: true,
        code: 125,
        message: "Error: Selecione uma imagem válida, JPEG ou PNG!"
      })
    }

    try {
      const dadosImagem = {
        originalName: req.file.originalname,
        fileName: req.file.filename,
      };

      const options = { returnDocument: 'before' };
      const user = await User.findByIdAndUpdate(req.userId, dadosImagem, options);

      if (!user) {
        const imgAtual = req.file.destination + "/" + req.file.filename;
        fs.unlink(imgAtual, (err) => {
          console.log('Imagem antiga excluída! => ' + imgAtual);
        });

        return res.status(401).json({
          error: true,
          code: 123,
          message: "Error: Não foi possivel atualizar a imagem do perfil!"
        });
      }

      req.dadosImgUser = user.fileName;
      const imgAntiga = req.file.destination + "/" + req.dadosImgUser;
      fs.access(imgAntiga, (err) => {
        if (!err) {
          fs.unlink(imgAntiga, (err) => {
            console.log('Imagem antiga excluída!');
          });
        }
      });

      return res.status(200).json({
        error: false,
        message: "Imagem do perfil atualizada com sucesso!"
      });

    } catch (err) {
      res.status(500).json({
        error: true,
        code: 122,
        message: "Error: Não foi possivel executar a solicitação! =>" + err.message
      });
    }
  }
}

export default new ProfileImgController();
