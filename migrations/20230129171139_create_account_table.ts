import { Knex } from "knex";
import { onUpdateTrigger } from "../src/utils/onUpdateTrigger";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("contas", function (table) {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.uuid("id_usuario").notNullable();
    table.foreign("id_usuario").references('id').inTable('usuarios');
    table.bigInteger("saldo").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  }).then(()=>{
    knex.raw(onUpdateTrigger("contas"))
  });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("contas");
}
