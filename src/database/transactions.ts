import { AccountModel, TransactionPayload } from "./../model";
import { knex } from "../connectDB";
import { TypeTransaction, TransactionModel } from "../model";
import Dinero from "dinero.js";

export class Transaction {
  public static async getTransacao(
    id_conta: string
  ): Promise<TransactionModel[]> {
    return knex("transacoes")
      .select("*")
      .where("id_conta", id_conta)
      .orWhere("id_conta_destino", id_conta);
  }

  public static async realizarTransacao(
    transacao: TransactionModel
  ): Promise<boolean> {
    switch (Number(transacao.id_tipo)) {
      case TypeTransaction.DEPOSITO:
        return this.deposito(transacao);
      case TypeTransaction.TRANSFERENCIA:
        return this.transferencia(transacao);
      default:
        throw new Error("Tipo de transação não cadastrada");
    }
  }

  private static async deposito(transacao: TransactionModel): Promise<boolean> {
    const trx = await knex.transaction();
    try {
      const contas = await trx("contas")
        .select("*")
        .where("id", transacao.id_conta);
      const conta = contas[0];
      const contaSaldo = Dinero({
        amount: Number(conta.saldo),
        currency: "BRL",
      });
      const transacaoValor = Dinero({
        amount: transacao.valor * 100,
        currency: "BRL",
      });
      conta.saldo = contaSaldo.add(transacaoValor).getAmount();
      await trx("contas").update(conta).where("id", conta.id);
      await trx("transacoes").insert(transacao);
      await trx.commit();
      return true;
    } catch (error) {
      trx.rollback();
      throw error;
    }
  }
  private static async transferencia(
    transacao: TransactionModel
  ): Promise<boolean> {
    let trx = await knex.transaction();
    try {
      const contas = await trx("contas").whereIn("id", [
        transacao.id_conta,
        transacao.id_conta_destino,
      ]);
      let contaOrigem: AccountModel = contas.find((conta) => {
        return transacao.id_conta == conta.id;
      });

      let contaDestino: AccountModel = contas.find((conta) => {
        return transacao.id_conta_destino == conta.id;
      });

      if (!contaDestino) {
        throw new Error("Conta destino nao existe");
      }

      if (!contaOrigem) {
        throw new Error("Conta origem nao existe");
      }

      const contaOrigemSaldo = Dinero({
        amount: Number(contaOrigem.saldo),
        currency: "BRL",
      });
      const contaDestinoSaldo = Dinero({
        amount: Number(contaDestino.saldo),
        currency: "BRL",
      });
      const transacaoValor = Dinero({
        amount: transacao.valor * 100,
        currency: "BRL",
      });

      if (!contaOrigemSaldo.greaterThan(transacaoValor)) {
        throw new Error(
          "Você não possui saldo o suficiente para realizar esta operação"
        );
      }
      let transacaoPayload: TransactionPayload = {
        id_conta: contaOrigem.id,
        id_tipo: TypeTransaction.TRANSFERENCIA,
        valor: transacao.valor,
        id_conta_destino: contaDestino.id,
      };

      contaOrigem.saldo = contaOrigemSaldo.subtract(transacaoValor).getAmount();
      contaDestino.saldo = contaDestinoSaldo.add(transacaoValor).getAmount();
      const promises = [
        trx("contas").update(contaOrigem).where("id", contaOrigem.id),
        trx("contas").update(contaDestino).where("id", contaDestino.id),
        trx("transacoes").insert(transacaoPayload),
      ];
      await Promise.all(promises)
      await trx.commit()
      return true
    } catch (error) {
      trx.rollback();
      throw error;
    }
  }
}
