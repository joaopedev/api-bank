import { AccountCPFModel, AccountCNPJModel } from "../model";
import { knex } from "../connectDB";

export class Conta {
  public static async cadastrarConta(
    conta: AccountCPFModel | AccountCNPJModel
  ): Promise<boolean> {
    return knex("contas").insert(conta);
  }

  public static async getContas(
    id_usuario?: string | undefined
  ): Promise<AccountCPFModel[] | AccountCNPJModel[]> {
    let sql = knex("contas").select("*").orderBy("id");
    if (id_usuario) sql.where("id_usuario", id_usuario);
    return sql;
  }
}
