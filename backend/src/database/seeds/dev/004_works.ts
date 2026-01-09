import type { Knex } from 'knex'

// Fixed UUIDs for consistent references in other seeds
export const WORK_IDS = {
  COND_JARDIM_FLORES: '11111111-1111-1111-1111-111111111111',
  ESCOLA_EDUARDO_DIAZ: '22222222-2222-2222-2222-222222222222',
  SHOPPING_NORTE_PLAZA: '33333333-3333-3333-3333-333333333333',
  PONTE_RIO_TIETE: '44444444-4444-4444-4444-444444444444',
  COMPLEXO_MAIS_VIDA: '55555555-5555-5555-5555-555555555555',
}

export async function seed(knex: Knex): Promise<void> {
  await knex('works').del()

  await knex('works').insert([
    {
      id: WORK_IDS.COND_JARDIM_FLORES,
      name: 'Condomínio Residencial Jardim das Flores',
      code: '001',
      address: 'Rua das Acácias, 123 - Bairro Jardim - São Paulo/SP',
      contractor: 'Construtora Alpha LTDA',
      status: 'ATIVA',
    },
    {
      id: WORK_IDS.ESCOLA_EDUARDO_DIAZ,
      name: 'Escola Municipal Eduardo Diaz da Cruz',
      code: '002',
      address: 'Av. Paulista, 1500 - Bela Vista - São Paulo/SP',
      contractor: 'Construtora Beta S.A.',
      status: 'ATIVA',
    },
    {
      id: WORK_IDS.SHOPPING_NORTE_PLAZA,
      name: 'Shopping Center Norte Plaza',
      code: '003',
      address: 'Rodovia Fernão Dias, Km 42 - Atibaia/SP',
      contractor: 'Construtora Gamma LTDA',
      status: 'ATIVA',
    },
    {
      id: WORK_IDS.PONTE_RIO_TIETE,
      name: 'Ponte sobre Rio Tietê',
      code: '004',
      address: 'Marginal Tietê - Zona Norte - São Paulo/SP',
      contractor: 'Engenharia Delta S.A.',
      status: 'ATIVA',
    },
    {
      id: WORK_IDS.COMPLEXO_MAIS_VIDA,
      name: 'Complexo Habitacional Mais Vida',
      code: '005',
      address: 'Rua João de Barro, 500 - Guarulhos/SP',
      contractor: 'Construtora Social Omega',
      status: 'ATIVA',
    },
  ])
}
