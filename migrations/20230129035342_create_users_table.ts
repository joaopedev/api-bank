import { Knex } from "knex";
import { onUpdateTrigger } from "../src/utils/onUpdateTrigger";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("usuarios", function (table) {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.string("email", 320).notNullable().index().unique();
    table.string("password", 255).notNullable();
    table.string("cpf", 11).nullable().index().unique();
    table.string("cnpj", 14).nullable().index().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  }).then(()=>{
    knex.raw(onUpdateTrigger("contas"))
  });;
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("usuarios");
}
