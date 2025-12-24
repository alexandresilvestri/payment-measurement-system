import {
  ConstructionSite,
  Contract,
  Measurement,
  User,
  Supplier,
} from './types'

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Carlos Diretor',
    email: 'carlos@medcheck.com',
    role: 'DIRETOR',
  },
  {
    id: 'u2',
    name: 'João Engenheiro',
    email: 'joao@medcheck.com',
    role: 'OBRA',
    linkedConstructionSiteIds: ['s1', 's2'],
  },
]

export const WORKS: ConstructionSite[] = [
  {
    id: 's1',
    name: 'Residencial Horizonte',
    code: 'OB-001',
    address: 'Av. Paulista, 1000',
    contractor: 'Incorporadora A',
    status: 'ATIVA',
  },
  {
    id: 's2',
    name: 'Centro Comercial Alpha',
    code: 'OB-002',
    address: 'Rua Funchal, 500',
    contractor: 'Investimentos B',
    status: 'ATIVA',
  },
]

export const SUPPLIERS: Supplier[] = [
  {
    id: 'f1',
    name: 'Construtora Silva Ltda',
    typePerson: 'JURIDICA',
    document: '12345678000190',
    pix: 'construtora@silva.com.br',
  },
  {
    id: 'f2',
    name: 'Elétrica Santos',
    typePerson: 'JURIDICA',
    document: '98765432000110',
    pix: '11987654321',
  },
]

export const CONTRACTS: Contract[] = [
  {
    id: 'c1',
    constructionSiteId: 's1',
    supplierId: 'f1',
    object: 'Alvenaria Estrutural Torre A',
    totalValue: 150000,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    status: 'ATIVO',
    items: [
      {
        id: 'ci1',
        contractId: 'c1',
        description: 'Levantamento de paredes',
        unit: 'm2',
        quantityContracted: 1000,
        unitPriceMaterial: 50,
        unitPriceLabor: 50,
        unitPriceTotal: 100,
        totalValue: 100000,
      },
      {
        id: 'ci2',
        contractId: 'c1',
        description: 'Encunhamento',
        unit: 'm',
        quantityContracted: 500,
        unitPriceMaterial: 20,
        unitPriceLabor: 80,
        unitPriceTotal: 100,
        totalValue: 50000,
      },
    ],
  },
  {
    id: 'c2',
    constructionSiteId: 's1',
    supplierId: 'f2',
    object: 'Instalações Elétricas 1º Pav',
    totalValue: 50000,
    startDate: '2023-02-01',
    endDate: '2023-06-30',
    status: 'ATIVO',
    items: [
      {
        id: 'ci3',
        contractId: 'c2',
        description: 'Pontos de tomada',
        unit: 'un',
        quantityContracted: 200,
        unitPriceMaterial: 50,
        unitPriceLabor: 50,
        unitPriceTotal: 100,
        totalValue: 20000,
      },
      {
        id: 'ci4',
        contractId: 'c2',
        description: 'Quadro de distribuição',
        unit: 'un',
        quantityContracted: 10,
        unitPriceMaterial: 1000,
        unitPriceLabor: 2000,
        unitPriceTotal: 3000,
        totalValue: 30000,
      },
    ],
  },
]

export const MOCK_MEASUREMENTS: Measurement[] = [
  {
    id: 'm1',
    contractId: 'c1',
    number: 1,
    createdAt: '2023-02-15T10:00:00Z',
    createdByUserId: 'u2',
    status: 'APROVADA',
    totalValue: 25000,
    siteObservation: 'Primeira medição conforme cronograma.',
    directorObservation: 'Aprovado sem ressalvas.',
    items: [
      {
        id: 'mi1',
        measurementId: 'm1',
        contractItemId: 'ci1',
        currentQuantity: 200,
        unitPrice: 100,
        totalValue: 20000,
      },
      {
        id: 'mi2',
        measurementId: 'm1',
        contractItemId: 'ci2',
        currentQuantity: 50,
        unitPrice: 100,
        totalValue: 5000,
      },
    ],
  },
  {
    id: 'm2',
    contractId: 'c1',
    number: 2,
    createdAt: '2023-03-15T14:30:00Z',
    createdByUserId: 'u2',
    status: 'PENDENTE',
    totalValue: 25000,
    siteObservation: 'Avanço regular.',
    items: [
      {
        id: 'mi3',
        measurementId: 'm2',
        contractItemId: 'ci1',
        currentQuantity: 200,
        unitPrice: 100,
        totalValue: 20000,
      },
      {
        id: 'mi4',
        measurementId: 'm2',
        contractItemId: 'ci2',
        currentQuantity: 50,
        unitPrice: 100,
        totalValue: 5000,
      },
    ],
  },
]
