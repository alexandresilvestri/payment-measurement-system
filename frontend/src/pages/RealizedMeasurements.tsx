import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Card, Table, Thead, Th, Tr, Td, Button } from '../components/UI'
import { formatCurrency } from '../utils'
import { Search, Eye } from 'lucide-react'

export const RealizedMeasurements = () => {
  const navigate = useNavigate()
  const { currentUser, sites, suppliers, getEnrichedMeasurements } =
    useAppContext()

  const [selectedSiteId, setSelectedSiteId] = useState('')
  const [selectedSupplierId, setSelectedSupplierId] = useState('')

  const isDirector = currentUser?.role === 'DIRETOR'

  // Filter sites based on permissions
  const availableSites = isDirector
    ? sites
    : sites.filter((s) =>
        currentUser?.linkedConstructionSiteIds?.includes(s.id)
      )

  // Get all measurements that are APPROVED
  const realizedMeasurements = useMemo(() => {
    let list = getEnrichedMeasurements().filter((m) => m.status === 'APROVADA')

    if (selectedSiteId) {
      list = list.filter(
        (m) => m.contract.constructionSiteId === selectedSiteId
      )
    } else {
      // If no site is selected, and user is not director, still restrict list?
      // Let's restrict by default if not site selected to empty to force selection (UI requirement)
      // Or show all if Director.
      // Prompt says "selecionando primeiro a obra". Let's wait for selection.
      return []
    }

    if (selectedSupplierId) {
      list = list.filter((m) => m.contract.supplierId === selectedSupplierId)
    }

    return list
  }, [getEnrichedMeasurements, selectedSiteId, selectedSupplierId])

  // Derived list of suppliers present in the current site (for the filter)
  const availableSuppliersForSite = useMemo(() => {
    if (!selectedSiteId) return []
    // Find suppliers that have measurements in this site
    const relevantSupplierIds = new Set(
      getEnrichedMeasurements()
        .filter(
          (m) =>
            m.status === 'APROVADA' &&
            m.contract.constructionSiteId === selectedSiteId
        )
        .map((m) => m.contract.supplierId)
    )
    return suppliers.filter((s) => relevantSupplierIds.has(s.id))
  }, [selectedSiteId, suppliers, getEnrichedMeasurements])

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-2xl font-bold text-textMain">
          Medições Realizadas
        </h1>
        <p className="text-textSec">
          Histórico de medições aprovadas e encerradas.
        </p>
      </header>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-textSec">
              Selecione a Obra
            </label>
            <select
              className="h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:ring-2 focus:ring-secondary outline-none"
              value={selectedSiteId}
              onChange={(e) => {
                setSelectedSiteId(e.target.value)
                setSelectedSupplierId('') // Reset supplier filter
              }}
            >
              <option value="">Selecione...</option>
              {availableSites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-textSec">
              Filtrar por Fornecedor (Opcional)
            </label>
            <select
              className="h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:ring-2 focus:ring-secondary outline-none disabled:bg-gray-50 disabled:text-gray-400"
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              disabled={!selectedSiteId}
            >
              <option value="">Todos os Fornecedores</option>
              {availableSuppliersForSite.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.corporateName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      {selectedSiteId && (
        <Card
          title={`Medições Aprovadas - ${
            availableSites.find((s) => s.id === selectedSiteId)?.name
          }`}
        >
          <Table>
            <Thead>
              <Tr>
                <Th>Nº</Th>
                <Th>Data Aprovação</Th>
                <Th>Fornecedor</Th>
                <Th>Objeto do Contrato</Th>
                <Th className="text-right">Valor Total</Th>
                <Th className="text-center">Ações</Th>
              </Tr>
            </Thead>
            <tbody>
              {realizedMeasurements.length === 0 ? (
                <Tr>
                  <Td colSpan={6} className="text-center py-8 text-textSec">
                    Nenhuma medição aprovada encontrada para os filtros
                    selecionados.
                  </Td>
                </Tr>
              ) : (
                realizedMeasurements.map((m) => (
                  <Tr
                    key={m.id}
                    onClick={() => navigate(`/measurement/${m.id}`)}
                  >
                    <Td className="font-bold">#{m.number}</Td>
                    {/* Using createdAt as proxy for approval date in mock, ideally use a specific approvalDate field */}
                    <Td>{new Date(m.createdAt).toLocaleDateString()}</Td>
                    <Td>{m.supplier.corporateName}</Td>
                    <Td className="text-sm text-textSec">
                      {m.contract.object}
                    </Td>
                    <Td className="text-right font-medium text-primary">
                      {formatCurrency(m.totalValue)}
                    </Td>
                    <Td className="text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/measurement/${m.id}`)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" /> Detalhes
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      )}

      {!selectedSiteId && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
          <Search className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-textSec font-medium">
            Selecione uma obra acima para visualizar o histórico de medições.
          </p>
        </div>
      )}
    </div>
  )
}
