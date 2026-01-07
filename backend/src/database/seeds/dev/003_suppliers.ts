import type { Knex } from 'knex'
import { randomUUID } from 'crypto'

export async function seed(knex: Knex): Promise<void> {
  await knex('suppliers').del()

  await knex('suppliers').insert([
    {
      id: randomUUID(),
      type_person: 'JURIDICA',
      name: 'Construtora Alpha LTDA',
      document: '12.345.678/0001-90',
      pix: '12345678000190',
    },
    {
      id: randomUUID(),
      type_person: 'JURIDICA',
      name: 'Materiais Beta S.A.',
      document: '98.765.432/0001-10',
      pix: 'contato@materiaisbeta.com.br',
    },
    {
      id: randomUUID(),
      type_person: 'JURIDICA',
      name: 'Equipamentos Gamma ME',
      document: '11.222.333/0001-44',
      pix: '11222333000144',
    },
    {
      id: randomUUID(),
      type_person: 'JURIDICA',
      name: 'Transportadora Delta EIRELI',
      document: '55.666.777/0001-88',
      pix: '+5511999887766',
    },
    {
      id: randomUUID(),
      type_person: 'JURIDICA',
      name: 'Ferragens Omega LTDA',
      document: '33.444.555/0001-22',
      pix: 'financeiro@ferragensomega.com.br',
    },
    {
      id: randomUUID(),
      type_person: 'FISICA',
      name: 'Pedro Almeida',
      document: '123.456.789-00',
      pix: '12345678900',
    },
    {
      id: randomUUID(),
      type_person: 'FISICA',
      name: 'Lucia Fernandes',
      document: '987.654.321-11',
      pix: 'lucia.fernandes@email.com',
    },
    {
      id: randomUUID(),
      type_person: 'FISICA',
      name: 'Roberto Cardoso',
      document: '456.789.123-22',
      pix: '+5511988776655',
    },
    {
      id: randomUUID(),
      type_person: 'FISICA',
      name: 'Fernanda Lima',
      document: '321.654.987-33',
      pix: '32165498733',
    },
    {
      id: randomUUID(),
      type_person: 'FISICA',
      name: 'Ricardo Mendes',
      document: '147.258.369-44',
      pix: 'ricardo.mendes@email.com',
    },
  ])
}
