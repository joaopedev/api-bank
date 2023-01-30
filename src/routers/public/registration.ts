import { body, validationResult } from "express-validator";
import { HTTP_ERRORS, UserCPFModel, UserCNPJModel} from "./../../model";
import createError from "http-errors";
import { Usuario } from "../../database/users";
import { Application, NextFunction, Request, Response } from "express";
import { validaCPF } from "../../utils/cpf";
import { validaCNPJ } from "../../utils/cnpj";
import { tratarErro } from "../../utils/error";

export = (app: Application) => {
  app.post(
    "/cadastrarUsuarioCPF",
    body("cpf").isLength({ min: 14, max: 14 }), //Recebe no formato padrão 000.000.000-00
    body("password").exists(),
    body("email").isEmail(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        let usuario: UserCPFModel = req.body;
        usuario.cpf = validaCPF(usuario.cpf);
        

        if (usuario.cpf) {
          Usuario.cadastraUsuario(usuario)
            .then(() => {
              res.json({ message: "Usuario cadastrado com sucesso" });
            })
            .catch((erro) => {
              console.error(erro)
              next(createError(HTTP_ERRORS.ERRO_BANCO, tratarErro(erro)));
            });
        } else {
          next(createError(HTTP_ERRORS.SOLICITACAO, "CPF inválido"));
        }
      } else {
        next(
          createError(HTTP_ERRORS.SOLICITACAO, JSON.stringify(errors.array()))
        );
      }
    }
  );
  app.post(
    "/cadastrarUsuarioCNPJ",
    body("cnpj").isLength({ min: 18, max: 18 }), //Recebe no formato padrão 00.000.000/0000-00
    body("password").exists(),
    body("email").isEmail(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        let usuario: UserCNPJModel = req.body;
        usuario.cnpj = validaCNPJ(usuario.cnpj);
        
        if (usuario.cnpj) {
          Usuario.cadastraUsuario(usuario)
            .then(() => {
              res.json({ message: "Usuario cadastrado com sucesso" });
            })
            .catch((erro) => {
              next(createError(HTTP_ERRORS.ERRO_BANCO, tratarErro(erro)));
            });
        } else {
          next(createError(HTTP_ERRORS.SOLICITACAO, "CNPJ inválido"));
        }
      } else {
        next(
          createError(HTTP_ERRORS.SOLICITACAO, JSON.stringify(errors.array()))
        );
      }
    }
  );
};
