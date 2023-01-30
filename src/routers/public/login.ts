import { HTTP_ERRORS } from "./../../model";
import createError from "http-errors";
import { Usuario } from "../../database/users";
import { Application, NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { validaCPF } from "../../utils/cpf";
import { validaCNPJ } from "../../utils/cnpj";
require("dotenv").config();

export = (app: Application) => {
  app.post(
    "/login",
    body("cpf").exists() || body("cnpj").exists(),
    body("password").exists(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        let cpf = validaCPF(req.body.cpf);
        let password = req.body.password;
        
        Usuario.loginCPF(cpf, password)
          .then((usuario) => {
            res.json({
              message: "usuario logado",
              usuario: usuario,
            });
          })
          .catch((erro) => {
            console.error(erro)
            next(createError(HTTP_ERRORS.ERRO_BANCO, erro));
          });
      } else {
        next(
          createError(HTTP_ERRORS.SOLICITACAO, JSON.stringify(errors.array()))
        );
      }
    }
  );
  app.post(
    "/loginCNPJ",
    body("cnpj").exists(),
    body("password").exists(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        let cnpj = validaCNPJ(req.body.cnpj);
        let password = req.body.password;

        Usuario.loginCNPJ(cnpj, password)
          .then((usuario) => {
            res.json({
              message: "usuario logado",
              usuario: usuario,
            });
          })
          .catch((erro) => {
            next(createError(HTTP_ERRORS.ERRO_BANCO, erro));
          });
      } else {
        next(
          createError(HTTP_ERRORS.SOLICITACAO, JSON.stringify(errors.array()))
        );
      }
    }
  );
};
