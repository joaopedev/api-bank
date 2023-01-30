import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("tipo_transacoes").del();

    // Inserts seed entries
    await knex("tipo_transacoes").insert([
        { descricao: "DEPOSITO" },
        { descricao: "SAQUE" },
        { descricao: "TRANSFERENCIA" },
    ]);
};
