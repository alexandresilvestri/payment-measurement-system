import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Select,
} from '../components/UI'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { ContractListItem, Work, Supplier } from '../types'
import { contractsApi } from './services/contracts'
import { worksApi } from './services/works'
import { suppliersApi } from './services/suppliers'

export const Contracts = () => {
  const navigate = useNavigate()

  const [contracts, setContracts] = useState<ContractListItem[]>([])
  const [works, setWorks] = useState<Work[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedWorkId, setSelectedWorkId] = useState<string>('')
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('')

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const filters: { workId?: string; supplierId?: string } = {}
      if (selectedWorkId) filters.workId = selectedWorkId
      if (selectedSupplierId) filters.supplierId = selectedSupplierId

      const data = await contractsApi.getAll(filters)
      setContracts(data)
    } catch (err) {
      console.error('Error fetching contracts:', err)
      setError('Erro ao carregar contratos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [selectedWorkId, selectedSupplierId])

  const fetchInitialData = async () => {
    try {
      setError(null)
      const [worksData, suppliersData] = await Promise.all([
        worksApi.getAll(),
        suppliersApi.getAll(),
      ])
      setWorks(worksData)
      setSuppliers(suppliersData)
    } catch (err) {
      console.error('Error fetching initial data:', err)
      setError('Erro ao carregar dados iniciais. Tente novamente.')
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const handleRowClick = (contractId: string) => {
    navigate(`/contracts/${contractId}`)
  }

  const workOptions = [
    { value: '', label: 'Todas as obras' },
    ...works.map((work) => ({ value: work.id, label: work.name })),
  ]

  const supplierOptions = [
    { value: '', label: 'Todos os fornecedores' },
    ...suppliers.map((supplier) => ({
      value: supplier.id,
      label: supplier.name,
    })),
  ]

  return (
    <div className="space-y-6 pb-20 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-textMain">
              Gestão de Contratos
            </h1>
            <p className="text-textSec">Contratos cadastrados</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select
            value={selectedWorkId}
            onChange={(e) => setSelectedWorkId(e.target.value)}
            options={workOptions}
            placeholder="Filtrar por obra"
          />
        </div>
        <div className="flex-1">
          <Select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            options={supplierOptions}
            placeholder="Filtrar por fornecedor"
          />
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchContracts}>Tentar Novamente</Button>
          </div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Obra</Th>
                <Th>Fornecedor</Th>
                <Th>Serviço</Th>
                <Th>Valor Total</Th>
                <Th>Progresso</Th>
              </Tr>
            </Thead>
            <tbody>
              {contracts.map((contract) => (
                <Tr
                  key={contract.id}
                  onClick={() => handleRowClick(contract.id)}
                >
                  <Td className="font-medium text-textMain">
                    {contract.work.name}
                  </Td>
                  <Td className="text-sm">{contract.supplier.name}</Td>
                  <Td className="text-sm">{contract.service}</Td>
                  <Td className="font-medium">
                    {formatCurrency(contract.totalValue)}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[80px]">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(contract.percentage, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-textSec font-medium min-w-[40px] text-right">
                        {contract.percentage}%
                      </span>
                    </div>
                  </Td>
                </Tr>
              ))}
              {contracts.length === 0 && (
                <Tr>
                  <Td colSpan={5} className="text-center py-8 text-textSec">
                    {selectedWorkId || selectedSupplierId
                      ? 'Nenhum contrato encontrado com os filtros selecionados.'
                      : 'Nenhum contrato cadastrado.'}
                  </Td>
                </Tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}
