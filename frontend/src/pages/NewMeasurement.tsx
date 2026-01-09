import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppContext } from '../context/AppContext'
import { Card, Table, Thead, Th, Tr, Td, Button } from '../components/UI'
import { formatCurrency } from '../utils'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { Measurement, MeasurementItem } from '../types'

export const NewMeasurement = () => {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const { contracts, suppliers, works, measurements, addMeasurement } =
    useAppContext()

  const [selectedWorkId, setSelectedWorkId] = useState<string>('')
  const [selectedContractId, setSelectedContractId] = useState<string>('')
  const [observation, setObservation] = useState('')

  const [inputQuantities, setInputQuantities] = useState<
    Record<string, number>
  >({})

  const canApprove = authUser?.permissions?.approveMeasurement ?? false
  const availableWorks = works

  const availableContracts = useMemo(() => {
    if (!selectedWorkId) return []
    return contracts.filter(
      (c) => c.workId === selectedWorkId && c.status === 'Ativo'
    )
  }, [selectedWorkId, contracts])

  const selectedContract = contracts.find((c) => c.id === selectedContractId)

  const contractMath = useMemo(() => {
    if (!selectedContract) return []

    const approvedMeasurements = measurements.filter(
      (m) => m.contractId === selectedContract.id && m.status === 'APROVADA'
    )

    return selectedContract.items.map((item) => {
      const accumulatedQty = approvedMeasurements.reduce((acc, m) => {
        const mItem = m.items.find((mi) => mi.contractItemId === item.id)
        return acc + (mItem?.currentQuantity || 0)
      }, 0)

      const balanceQty = item.quantity - accumulatedQty
      const currentQty = inputQuantities[item.id] || 0
      const currentTotal = currentQty * item.unitLaborValue

      return {
        ...item,
        accumulatedQty,
        balanceQty,
        currentQty,
        currentTotal,
        isValid: currentQty <= balanceQty,
      }
    })
  }, [selectedContract, measurements, inputQuantities])

  const totalMeasurementValue = contractMath.reduce(
    (acc, item) => acc + item.currentTotal,
    0
  )
  const totalContractedValue = selectedContract?.totalValue || 0

  const previousAccumulatedValue = useMemo(() => {
    if (!selectedContract) return 0
    return measurements
      .filter(
        (m) => m.contractId === selectedContract.id && m.status === 'APROVADA'
      )
      .reduce((acc, m) => acc + m.totalValue, 0)
  }, [selectedContract, measurements])

  const handleQuantityChange = (itemId: string, val: string) => {
    const num = parseFloat(val) || 0
    setInputQuantities((prev) => ({ ...prev, [itemId]: num }))
  }

  const goBack = () => {
    navigate(canApprove ? '/dashboard' : '/dashboard')
  }

  const handleSave = (status: Measurement['status']) => {
    if (!selectedContract || !authUser) return

    const hasInvalid = contractMath.some((i) => !i.isValid)
    if (hasInvalid) {
      alert('Existem itens com quantidade superior ao saldo!')
      return
    }

    if (totalMeasurementValue <= 0) {
      alert('O valor da medição deve ser maior que zero.')
      return
    }

    const itemsPayload: MeasurementItem[] = contractMath
      .filter((i) => i.currentQty > 0)
      .map((i) => ({
        id: `mi-${Date.now()}-${i.id}`,
        measurementId: '',
        contractItemId: i.id,
        currentQuantity: i.currentQty,
        unitPrice: i.unitLaborValue,
        totalValue: i.currentTotal,
      }))

    const newMeasurement: Measurement = {
      id: `m-${Date.now()}`,
      contractId: selectedContract.id,
      number:
        measurements.filter((m) => m.contractId === selectedContract.id)
          .length + 1,
      createdAt: new Date().toISOString(),
      createdByUserId: authUser.id,
      status: status,
      siteObservation: observation,
      totalValue: totalMeasurementValue,
      items: itemsPayload,
    }

    addMeasurement(newMeasurement)

    if (status === 'PENDENTE' && canApprove) {
      alert(
        'Medição criada com sucesso! Ela estará disponível na sua lista de aprovações.'
      )
    }

    goBack()
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center gap-4">
        <Button variant="ghost" onClick={goBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-textMain">Nova Medição</h1>
          <p className="text-textSec">
            Selecione a obra, o contrato e informe as quantidades.
          </p>
        </div>
      </header>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-textSec">Obra</label>
              <select
                className="h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:ring-2 focus:ring-secondary outline-none"
                value={selectedWorkId}
                onChange={(e) => {
                  setSelectedWorkId(e.target.value)
                  setSelectedContractId('')
                  setInputQuantities({})
                }}
              >
                <option value="">Selecione a obra...</option>
                {availableWorks.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-textSec">
                Contrato
              </label>
              <select
                className="h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:ring-2 focus:ring-secondary outline-none disabled:bg-gray-100 disabled:text-gray-400"
                value={selectedContractId}
                onChange={(e) => {
                  setSelectedContractId(e.target.value)
                  setInputQuantities({})
                }}
                disabled={!selectedWorkId}
              >
                <option value="">
                  {!selectedWorkId
                    ? 'Selecione uma obra primeiro...'
                    : 'Selecione o contrato...'}
                </option>
                {availableContracts.map((c) => {
                  const sup = suppliers.find((sup) => sup.id === c.supplierId)
                  return (
                    <option key={c.id} value={c.id}>
                      {sup?.name} - {c.service}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {selectedContract && (
            <div className="bg-gray-50 p-4 rounded-lg border border-border flex flex-col justify-center">
              <h3 className="font-semibold text-textMain mb-3 border-b border-gray-200 pb-2">
                Resumo Financeiro do Contrato
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-xs text-textSec">
                    Valor Contrato
                  </span>
                  <span className="font-semibold text-textMain">
                    {formatCurrency(totalContractedValue)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-textSec">
                    Acumulado Anterior
                  </span>
                  <span className="font-semibold text-textMain">
                    {formatCurrency(previousAccumulatedValue)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-textSec">
                    Saldo Contratual
                  </span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(
                      totalContractedValue - previousAccumulatedValue
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {selectedContract && (
        <>
          <Card title="Itens do Contrato">
            <Table>
              <Thead>
                <Tr>
                  <Th>Item / Descrição</Th>
                  <Th className="text-center">Und</Th>
                  <Th className="text-right">Qtd. Contratada</Th>
                  <Th className="text-right">Acumulado</Th>
                  <Th className="text-right">Saldo a Medir</Th>
                  <Th className="text-right w-32 bg-green-50">Qtd. Atual</Th>
                  <Th className="text-right">Vlr. Unit.</Th>
                  <Th className="text-right font-bold">Total Item</Th>
                </Tr>
              </Thead>
              <tbody>
                {contractMath.map((item) => (
                  <Tr
                    key={item.id}
                    className={!item.isValid ? 'bg-red-50' : ''}
                  >
                    <Td className="font-medium text-textMain">
                      {item.description}
                    </Td>
                    <Td className="text-center text-textSec">
                      {item.unitMeasure}
                    </Td>
                    <Td className="text-right">{item.quantity}</Td>
                    <Td className="text-right text-textSec">
                      {item.accumulatedQty}
                    </Td>
                    <Td className="text-right font-medium text-primary">
                      {item.balanceQty}
                    </Td>
                    <Td className="bg-green-50 p-2">
                      <input
                        type="number"
                        min="0"
                        max={item.balanceQty}
                        className={`w-full text-right p-1 border rounded focus:ring-2 focus:ring-primary outline-none ${
                          !item.isValid
                            ? 'border-red-500 text-red-600'
                            : 'border-gray-300'
                        }`}
                        value={item.currentQty || ''}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        placeholder="0"
                      />
                      {!item.isValid && (
                        <div className="text-[10px] text-red-500 text-right">
                          Excede saldo
                        </div>
                      )}
                    </Td>
                    <Td className="text-right text-textSec">
                      {formatCurrency(item.totalValue)}
                    </Td>
                    <Td className="text-right font-bold text-textMain">
                      {formatCurrency(item.currentTotal)}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>

            <div className="p-4 bg-surfaceHighlight border-t border-border mt-4 flex justify-end items-center gap-6">
              <div className="text-right">
                <span className="block text-sm text-textSec">
                  Total desta Medição
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(totalMeasurementValue)}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Observações">
            <textarea
              className="w-full h-24 p-3 border border-border rounded focus:ring-2 focus:ring-secondary outline-none text-sm resize-none"
              placeholder="Digite aqui observações relevantes sobre o andamento dos serviços..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </Card>

          <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-border p-4 shadow-lg flex justify-end gap-4 z-20">
            <Button variant="ghost" onClick={() => handleSave('RASCUNHO')}>
              <Save className="w-4 h-4 mr-2" /> Salvar Rascunho
            </Button>
            <Button variant="primary" onClick={() => handleSave('PENDENTE')}>
              <Send className="w-4 h-4 mr-2" /> Enviar para Aprovação
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
