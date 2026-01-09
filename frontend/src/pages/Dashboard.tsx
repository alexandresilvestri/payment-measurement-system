import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppContext } from '../context/AppContext'
import { Card, Table, Thead, Th, Tr, Td, Badge, Button } from '../components/UI'
import { formatCurrency } from '../utils'
import { Plus } from 'lucide-react'

export const Dashboard = () => {
  const { user: authUser } = useAuth()
  const { works, contracts, suppliers, getEnrichedMeasurements } =
    useAppContext()
  const navigate = useNavigate()

  const canApprove = authUser?.permissions?.approveMeasurement ?? false

  const [selectedWorkId, setSelectedWorkId] = useState<string>(
    works[0]?.id || ''
  )

  const filteredContracts = contracts.filter(
    (c) => c.workId === selectedWorkId && c.status === 'Ativo'
  )
  const allMeasurements = getEnrichedMeasurements()
  const workMeasurements = allMeasurements.filter(
    (m) => m.contract.workId === selectedWorkId
  )

  const contractsWithData = filteredContracts.map((c) => {
    const sup = suppliers.find((s) => s.id === c.supplierId)
    const ms = allMeasurements.filter(
      (m) => m.contractId === c.id && m.status === 'APROVADA'
    )
    const measured = ms.reduce((acc, curr) => acc + curr.totalValue, 0)
    const pct = (measured / c.totalValue) * 100
    return { ...c, supplierName: sup?.name, measured, pct }
  })

  const pendingMeasurements = allMeasurements.filter(
    (m) => m.status === 'PENDENTE'
  )

  const activeContracts = contracts
    .filter((c) => c.status === 'Ativo')
    .map((c) => {
      const work = works.find((s) => s.id === c.workId)
      const supplier = suppliers.find((s) => s.id === c.supplierId)

      const measurementsForContract = allMeasurements.filter(
        (m) => m.contractId === c.id && m.status === 'APROVADA'
      )
      const totalMeasured = measurementsForContract.reduce(
        (acc, m) => acc + m.totalValue,
        0
      )
      const percentage = (totalMeasured / c.totalValue) * 100

      return {
        ...c,
        workName: work?.name || 'N/A',
        supplierName: supplier?.name || 'N/A',
        totalMeasured,
        percentage,
      }
    })

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain">
            {canApprove ? 'Painel Geral' : 'Painel de Obras'}
          </h1>
          <p className="text-textSec">
            {canApprove
              ? 'Visão geral de aprovações e contratos ativos.'
              : 'Gerencie medições e contratos da sua obra.'}
          </p>
        </div>

        {!canApprove && works.length > 0 && (
          <div className="flex items-center gap-2 bg-white p-2 rounded-[6px] border border-border shadow-sm">
            <span className="text-sm text-textSec font-medium pl-2">Obra:</span>
            <select
              value={selectedWorkId}
              onChange={(e) => setSelectedWorkId(e.target.value)}
              className="bg-transparent font-semibold text-primary outline-none cursor-pointer"
            >
              {works.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {canApprove && (
        <>
          <Card
            title="Medições Pendentes de Aprovação"
            className="border-l-4 border-l-statusPending"
          >
            {pendingMeasurements.length === 0 ? (
              <div className="text-center py-8 text-textSec">
                Nenhuma medição pendente no momento.
              </div>
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Obra</Th>
                    <Th>Fornecedor</Th>
                    <Th>Objeto</Th>
                    <Th>Nº</Th>
                    <Th>Data</Th>
                    <Th className="text-right">Valor</Th>
                    <Th className="text-center">Ações</Th>
                  </Tr>
                </Thead>
                <tbody>
                  {pendingMeasurements.map((m) => (
                    <Tr
                      key={m.id}
                      onClick={() => navigate(`/measurement/${m.id}`)}
                    >
                      <Td className="font-medium text-textMain">
                        {m.work.name}
                      </Td>
                      <Td>{m.supplier.name}</Td>
                      <Td>{m.contract.service}</Td>
                      <Td>#{m.number}</Td>
                      <Td>{new Date(m.createdAt).toLocaleDateString()}</Td>
                      <Td className="text-right font-semibold">
                        {formatCurrency(m.totalValue)}
                      </Td>
                      <Td className="text-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/measurement/${m.id}`)
                          }}
                        >
                          Avaliar
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>

          <Card title="Contratos Ativos e Avanço Físico-Financeiro">
            <Table>
              <Thead>
                <Tr>
                  <Th>Obra</Th>
                  <Th>Fornecedor</Th>
                  <Th>Objeto do Contrato</Th>
                  <Th className="text-right">Valor Contrato</Th>
                  <Th className="text-right">Medido (Acum.)</Th>
                  <Th className="text-center">%</Th>
                </Tr>
              </Thead>
              <tbody>
                {activeContracts.map((c) => (
                  <Tr key={c.id}>
                    <Td className="font-medium">{c.workName}</Td>
                    <Td>{c.supplierName}</Td>
                    <Td>{c.service}</Td>
                    <Td className="text-right">
                      {formatCurrency(c.totalValue)}
                    </Td>
                    <Td className="text-right text-textSec">
                      {formatCurrency(c.totalMeasured)}
                    </Td>
                    <Td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${Math.min(c.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {c.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}

      {!canApprove && works.length > 0 && (
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
                  <Td>{c.service}</Td>
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
      )}

      {!canApprove && works.length > 0 && (
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
              {workMeasurements.length === 0 && (
                <Tr>
                  <Td className="text-center py-4 text-textSec" colSpan={6}>
                    Nenhuma medição encontrada.
                  </Td>
                </Tr>
              )}
              {workMeasurements.map((m) => (
                <Tr key={m.id} onClick={() => navigate(`/measurement/${m.id}`)}>
                  <Td className="font-bold">#{m.number}</Td>
                  <Td>{new Date(m.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-medium">{m.supplier.name}</span>
                      <span className="text-xs text-textSec">
                        {m.contract.service}
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
      )}
    </div>
  )
}
