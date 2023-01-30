import { TypeTransaction } from "./../../model";
import { Transaction } from "../../database/transactions";
import { Application, NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { HTTP_ERRORS } from "../../model";
import { query, body, validationResult } from "express-validator";

export = (app: Application) => {
  app.get(
    "/private/transaction",
    query("id_conta").isUUID(),
    (req: Request, res: Response, next: NextFunction) => {
      let id_conta = <string>req.query.id_conta;
      Transaction.getTransacao(id_conta)
        .then((transacoes) => {
          res.json({ transacoes: transacoes });
        })
        .catch((erro) => {
          console.error(erro)
          next(createError(HTTP_ERRORS.ERRO_BANCO, erro));
        });
    }
  );

  app.post(
    "/private/transaction",
    body("id_conta").isUUID(),
    body("id_tipo").isIn([
      TypeTransaction.DEPOSITO,
      TypeTransaction.SAQUE,
      TypeTransaction.TRANSFERENCIA,
    ]),
    body("valor").isNumeric(),
    body("id_conta_destino").isUUID(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        let transacao = req.body;

        Transaction.realizarTransacao(transacao)
          .then(() => {
            res.json({ mensagem: "Transação realizada com sucesso" });
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
};
