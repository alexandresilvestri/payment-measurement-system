import type { Knex } from 'knex'
import { randomUUID } from 'crypto'

export async function seed(knex: Knex): Promise<void> {
  await knex('works').del()

  await knex('works').insert([
    {
      id: randomUUID(),
      name: 'Condomínio Residencial Jardim das Flores',
      code: '001',
      address: 'Rua das Acácias, 123 - Bairro Jardim - São Paulo/SP',
      contractor: 'Construtora Alpha LTDA',
      status: 'ATIVA',
    },
    {
      id: randomUUID(),
      name: 'Escola Municipal Eduardo Diaz da Cruz',
      code: '002',
      address: 'Av. Paulista, 1500 - Bela Vista - São Paulo/SP',
      contractor: 'Construtora Beta S.A.',
      status: 'ATIVA',
    },
    {
      id: randomUUID(),
      name: 'Shopping Center Norte Plaza',
      code: '003',
      address: 'Rodovia Fernão Dias, Km 42 - Atibaia/SP',
      contractor: 'Construtora Gamma LTDA',
      status: 'ATIVA',
    },
    {
      id: randomUUID(),
      name: 'Ponte sobre Rio Tietê',
      code: '004',
      address: 'Marginal Tietê - Zona Norte - São Paulo/SP',
      contractor: 'Engenharia Delta S.A.',
      status: 'ATIVA',
    },
    {
      id: randomUUID(),
      name: 'Complexo Habitacional Mais Vida',
      code: '005',
      address: 'Rua João de Barro, 500 - Guarulhos/SP',
      contractor: 'Construtora Social Omega',
      status: 'ATIVA',
    },
  ])
}
