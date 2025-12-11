import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Card, Table, Thead, Th, Tr, Td, Badge, Button } from '../components/UI'
import { formatCurrency } from '../utils'
import { Plus } from 'lucide-react'

export const SiteDashboard = () => {
  const { currentUser, sites, contracts, suppliers, getEnrichedMeasurements } =
    useAppContext()
  const navigate = useNavigate()

  // Filter sites this user is linked to
  const linkedSites = sites.filter((s) =>
    currentUser?.linkedConstructionSiteIds?.includes(s.id)
  )
  const [selectedSiteId, setSelectedSiteId] = useState<string>(
    linkedSites[0]?.id || ''
  )

  // Derived data
  const filteredContracts = contracts.filter(
    (c) => c.constructionSiteId === selectedSiteId && c.status === 'ATIVO'
  )
  const allMeasurements = getEnrichedMeasurements()
  const siteMeasurements = allMeasurements.filter(
    (m) => m.contract.constructionSiteId === selectedSiteId
  )

  // Contracts logic with progress
  const contractsWithData = filteredContracts.map((c) => {
    const sup = suppliers.find((s) => s.id === c.supplierId)
    const ms = allMeasurements.filter(
      (m) => m.contractId === c.id && m.status === 'APROVADA'
    )
    const measured = ms.reduce((acc, curr) => acc + curr.totalValue, 0)
    const pct = (measured / c.totalValue) * 100
    return { ...c, supplierName: sup?.corporateName, measured, pct }
  })

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Painel de Obras</h1>
          <p className="text-textSec">
            Gerencie medições e contratos da sua obra.
          </p>
        </div>

        {/* Site Selector */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-[6px] border border-border shadow-sm">
          <span className="text-sm text-textSec font-medium pl-2">Obra:</span>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-transparent font-semibold text-primary outline-none cursor-pointer"
          >
            {linkedSites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Contracts Card */}
      <Card
        title="Contratos Disponíveis"
        action={
          <Button onClick={() => navigate('/new-measurement')} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Medição
          </Button>
        }
      >
        <Table>
          <Thead>
            <Tr>
              <Th>Fornecedor</Th>
              <Th>Objeto</Th>
              <Th className="text-right">Valor Contrato</Th>
              <Th className="text-right">Executado</Th>
              <Th className="text-center">%</Th>
              <Th className="text-center">Ações</Th>
            </Tr>
          </Thead>
          <tbody>
            {contractsWithData.map((c) => (
              <Tr key={c.id}>
                <Td className="font-medium">{c.supplierName}</Td>
                <Td>{c.object}</Td>
                <Td className="text-right">{formatCurrency(c.totalValue)}</Td>
                <Td className="text-right text-textSec">
                  {formatCurrency(c.measured)}
                </Td>
                <Td className="text-center">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      c.pct >= 100
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100'
                    }`}
                  >
                    {c.pct.toFixed(1)}%
                  </span>
                </Td>
                <Td className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/new-measurement')}
                  >
                    Medir
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Recent Measurements */}
      <Card title="Histórico de Medições Recentes">
        <Table>
          <Thead>
            <Tr>
              <Th>Nº</Th>
              <Th>Data</Th>
              <Th>Fornecedor / Objeto</Th>
              <Th className="text-right">Valor Medido</Th>
              <Th className="text-center">Status</Th>
              <Th className="text-center">Ações</Th>
            </Tr>
          </Thead>
          <tbody>
            {siteMeasurements.length === 0 && (
              <Tr>
                <Td className="text-center py-4 text-textSec" colSpan={6}>
                  Nenhuma medição encontrada.
                </Td>
              </Tr>
            )}
            {siteMeasurements.map((m) => (
              <Tr key={m.id} onClick={() => navigate(`/measurement/${m.id}`)}>
                <Td className="font-bold">#{m.number}</Td>
                <Td>{new Date(m.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {m.supplier.corporateName}
                    </span>
                    <span className="text-xs text-textSec">
                      {m.contract.object}
                    </span>
                  </div>
                </Td>
                <Td className="text-right font-medium">
                  {formatCurrency(m.totalValue)}
                </Td>
                <Td className="text-center">
                  <Badge status={m.status} />
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
                    Detalhes
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}
