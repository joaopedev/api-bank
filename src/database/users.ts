import { knex } from "../connectDB";
import { UserCPFModel, UserCNPJModel } from "../model";

export class Usuario {
  public static loginCPF(cpf: string, senha: string): Promise<UserCPFModel> {
    return new Promise((resolve, reject) => {
      knex("usuarios")
        .select("*")
        .where("cpf", cpf)
        .andWhere("password", senha)
        .then((usuario) => {
          if (usuario.length > 0) {
            resolve(usuario[0]);
          } else {
            reject("Nenhum usuario encontrado");
          }
        })
        .catch((erro) => {
          reject(erro);
        });
    });
  }
  public static loginCNPJ(cnpj: string, senha: string): Promise<UserCNPJModel> {
    return new Promise((resolve, reject) => {
      knex("usuarios")
        .select("*")
        .where("cnpj", cnpj)
        .andWhere("password", senha)
        .then((usuario) => {
          if (usuario.length > 0) {
            resolve(usuario[0]);
          } else {
            reject("Nenhum usuario encontrado");
          }
        })
        .catch((erro) => {
          reject(erro);
        });
    });
  }

  public static cadastraUsuario(usuario: UserCPFModel | UserCNPJModel): Promise<boolean> {
    return knex("usuarios").insert(usuario)  
  }
}
