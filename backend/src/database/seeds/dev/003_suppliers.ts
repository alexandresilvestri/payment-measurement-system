import type { Knex } from 'knex'

// Fixed UUIDs for consistent references in other seeds
export const SUPPLIER_IDS = {
  CONSTRUTORA_ALPHA: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  MATERIAIS_BETA: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  EQUIPAMENTOS_GAMMA: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  TRANSPORTADORA_DELTA: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
  FERRAGENS_OMEGA: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  PEDRO_ALMEIDA: 'a1111111-1111-1111-1111-111111111111',
  LUCIA_FERNANDES: 'a2222222-2222-2222-2222-222222222222',
  ROBERTO_CARDOSO: 'a3333333-3333-3333-3333-333333333333',
  FERNANDA_LIMA: 'a4444444-4444-4444-4444-444444444444',
  RICARDO_MENDES: 'a5555555-5555-5555-5555-555555555555',
}

export async function seed(knex: Knex): Promise<void> {
  // Delete dependent tables first to avoid FK constraint violations
  await knex('contract_items').del()
  await knex('contracts').del()

  await knex('suppliers').del()

  await knex('suppliers').insert([
    {
      id: SUPPLIER_IDS.CONSTRUTORA_ALPHA,
      type_person: 'JURIDICA',
      name: 'Construtora Alpha LTDA',
      document: '12.345.678/0001-90',
      pix: '12345678000190',
    },
    {
      id: SUPPLIER_IDS.MATERIAIS_BETA,
      type_person: 'JURIDICA',
      name: 'Materiais Beta S.A.',
      document: '98.765.432/0001-10',
      pix: 'contato@materiaisbeta.com.br',
    },
    {
      id: SUPPLIER_IDS.EQUIPAMENTOS_GAMMA,
      type_person: 'JURIDICA',
      name: 'Equipamentos Gamma ME',
      document: '11.222.333/0001-44',
      pix: '11222333000144',
    },
    {
      id: SUPPLIER_IDS.TRANSPORTADORA_DELTA,
      type_person: 'JURIDICA',
      name: 'Transportadora Delta EIRELI',
      document: '55.666.777/0001-88',
      pix: '+5511999887766',
    },
    {
      id: SUPPLIER_IDS.FERRAGENS_OMEGA,
      type_person: 'JURIDICA',
      name: 'Ferragens Omega LTDA',
      document: '33.444.555/0001-22',
      pix: 'financeiro@ferragensomega.com.br',
    },
    {
      id: SUPPLIER_IDS.PEDRO_ALMEIDA,
      type_person: 'FISICA',
      name: 'Pedro Almeida',
      document: '123.456.789-00',
      pix: '12345678900',
    },
    {
      id: SUPPLIER_IDS.LUCIA_FERNANDES,
      type_person: 'FISICA',
      name: 'Lucia Fernandes',
      document: '987.654.321-11',
      pix: 'lucia.fernandes@email.com',
    },
    {
      id: SUPPLIER_IDS.ROBERTO_CARDOSO,
      type_person: 'FISICA',
      name: 'Roberto Cardoso',
      document: '456.789.123-22',
      pix: '+5511988776655',
    },
    {
      id: SUPPLIER_IDS.FERNANDA_LIMA,
      type_person: 'FISICA',
      name: 'Fernanda Lima',
      document: '321.654.987-33',
      pix: '32165498733',
    },
    {
      id: SUPPLIER_IDS.RICARDO_MENDES,
      type_person: 'FISICA',
      name: 'Ricardo Mendes',
      document: '147.258.369-44',
      pix: 'ricardo.mendes@email.com',
    },
  ])
}
