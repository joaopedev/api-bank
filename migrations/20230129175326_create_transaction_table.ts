import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transacoes", function (table) {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.uuid("id_conta").notNullable();
    table.uuid("id_conta_destino").notNullable();
    table.integer("id_tipo").notNullable();
    table.bigInteger("valor").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.foreign("id_tipo").references('id').inTable('tipo_transacoes');
    table.foreign("id_conta").references('id').inTable('contas');
    table.foreign("id_conta_destino").references('id').inTable('contas');
  });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("transacoes");
}
