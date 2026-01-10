import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Button,
  Input,
  DateInput,
} from '../components/UI'
import { formatCurrency, formatDocument, prepareContractData } from '../utils'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Download,
} from 'lucide-react'
import { Supplier, Work } from '../types'
import { SupplierModal } from '../components/SupplierModal'
import {
  suppliersApi,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from './services/suppliers'
import {
  CreateContractRequest,
  contractsApi,
  ContractResponse,
} from './services/contracts'
import { worksApi } from './services/works'
import { FetchError } from '../lib/fetchClient'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ContractDocument } from '../components/pdf/ContractDocument'

type NewItemDraft = {
  id: string
  description: string
  unit: string
  quantity: string
  unitPriceLabor: string
}

export const NewContract = () => {
  const navigate = useNavigate()

  const [works, setWorks] = useState<Work[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [workId, setWorkId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [service, setService] = useState('')
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState('')

  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdContractId, setCreatedContractId] = useState<string | null>(
    null
  )
  const [createdContract, setCreatedContract] =
    useState<ContractResponse | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deliveryDateError, setDeliveryDateError] = useState<string>('')

  const [items, setItems] = useState<NewItemDraft[]>([
    {
      id: '1',
      description: '',
      unit: '',
      quantity: '',
      unitPriceLabor: '',
    },
  ])

  useEffect(() => {
    fetchWorks()
    fetchSuppliers()
  }, [])

  const fetchWorks = async () => {
    try {
      const data = await worksApi.getAll()
      setWorks(data)
    } catch (err) {
      console.error('Error fetching works:', err)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const data = await suppliersApi.getAll()
      setSuppliers(data)
    } catch (err) {
      console.error('Error fetching suppliers:', err)
    }
  }

  const selectedSupplier = suppliers.find((s) => s.id === supplierId)

  const addItemRow = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: '',
        unit: '',
        quantity: '',
        unitPriceLabor: '',
      },
    ])
  }

  const removeItemRow = (id: string) => {
    if (items.length === 1) return
    setItems(items.filter((i) => i.id !== id))
  }

  const updateItem = (id: string, field: keyof NewItemDraft, value: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const calculateTotal = (item: NewItemDraft) => {
    const qty = parseFloat(item.quantity) || 0
    const lab = parseFloat(item.unitPriceLabor) || 0
    return qty * lab
  }

  const totalContractValue = items.reduce(
    (acc, item) => acc + calculateTotal(item),
    0
  )

  const validateDeliveryDate = (
    deliveryDate: string,
    startDateValue: string
  ): string => {
    if (!deliveryDate) return ''

    if (!startDateValue) return ''

    const start = new Date(startDateValue)
    const delivery = new Date(deliveryDate)

    if (delivery < start) {
      return 'O prazo de entrega não pode ser anterior à data de início'
    }

    return ''
  }

  const handleDeliveryDateChange = (value: string) => {
    setEndDate(value)
    const error = validateDeliveryDate(value, startDate)
    setDeliveryDateError(error)
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    if (endDate) {
      const error = validateDeliveryDate(endDate, value)
      setDeliveryDateError(error)
    }
  }

  const handleSaveContract = async () => {
    setSaveError(null)
    setDeliveryDateError('')

    if (!workId || !supplierId || !service || !items) {
      setSaveError(
        'Preencha os campos obrigatórios: Obra, Fornecedor, Serviço e Item.'
      )
      return
    }

    if (items.some((i) => !i.description || !i.quantity || !i.unitPriceLabor)) {
      setSaveError('Preencha corretamente todos os itens do contrato.')
      return
    }

    if (endDate) {
      const dateError = validateDeliveryDate(endDate, startDate)
      if (dateError) {
        setDeliveryDateError(dateError)
        setSaveError('Corrija os erros nos campos antes de salvar.')
        return
      }
    }

    try {
      setSaving(true)
      const contractData: CreateContractRequest = {
        workId,
        supplierId,
        service: service,
        startDate,
        deliveryTime: endDate,
        items: items.map((item) => ({
          description: item.description,
          unitMeasure: item.unit,
          quantity: parseFloat(item.quantity),
          unitLaborValue: parseFloat(item.unitPriceLabor),
        })),
      }

      const createdContract = await contractsApi.create(contractData)
      setCreatedContractId(createdContract.id)
      setCreatedContract(createdContract)
      setShowSuccessModal(true)
    } catch (err) {
      console.error('Error creating contract:', err)

      if (err && typeof err === 'object' && 'response' in err) {
        const fetchError = err as FetchError<{ message?: string }>

        if (fetchError.response?.status === 400) {
          setSaveError(
            fetchError.response?.data?.message ||
              'Dados inválidos. Verifique os campos e tente novamente.'
          )
          return
        }

        if (fetchError.response?.status === 404) {
          setSaveError('Obra ou fornecedor não encontrado. Verifique os dados.')
          return
        }

        if (fetchError.response?.status === 409) {
          setSaveError('Já existe um contrato com estes dados.')
          return
        }
      }

      setSaveError(
        'Erro ao criar contrato. Verifique sua conexão e tente novamente.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSupplier = async (
    data: CreateSupplierRequest | UpdateSupplierRequest
  ) => {
    const newSupplier = await suppliersApi.create(data as CreateSupplierRequest)
    setSuppliers([...suppliers, newSupplier])
    setSupplierId(newSupplier.id)
    setShowSupplierModal(false)
  }

  return (
    <div className="space-y-6 pb-20 relative">
      <header className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-textMain">Novo Contrato</h1>
          <p className="text-textSec">
            Cadastre um novo contrato e seus itens para medição.
          </p>
        </div>
      </header>

      <Card title="Dados do Contrato">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-textSec">Obra *</label>
              <select
                className="h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:ring-2 focus:ring-secondary outline-none"
                value={workId}
                onChange={(e) => setWorkId(e.target.value)}
              >
                <option value="">Selecione a obra...</option>
                {works.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-textSec">
                Fornecedor *
              </label>
              <div className="flex gap-2">
                <select
                  className="flex-1 h-[38px] px-3 rounded-[4px] border border-border bg-white text-textMain text-sm focus:ring-2 focus:ring-secondary outline-none"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                >
                  <option value="">Selecione o fornecedor...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowSupplierModal(true)}
                  className="w-[38px] px-0 flex items-center justify-center"
                >
                  +
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {selectedSupplier && (
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <span className="text-xs text-textSec block">
                  Documento Selecionado
                </span>
                <span className="font-mono text-sm font-medium text-textMain">
                  {formatDocument(selectedSupplier.document)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Input
              label="Serviço / Objetivo do Contrato *"
              placeholder="Ex: Instalações Elétricas Torre B"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <DateInput
                label="Data Início *"
                value={startDate}
                onChange={handleStartDateChange}
              />
              <DateInput
                label="Prazo de entrega"
                value={endDate}
                onChange={handleDeliveryDateChange}
                error={deliveryDateError}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Itens da Planilha Contratual">
        <Table>
          <Thead>
            <Tr>
              <Th>Descrição do Item</Th>
              <Th className="w-20 text-center">Und</Th>
              <Th className="w-24 text-right">Qtd.</Th>
              <Th className="w-32 text-right">Unit. M.O.</Th>
              <Th className="w-32 text-right">Total</Th>
              <Th className="w-16 text-center">Ação</Th>
            </Tr>
          </Thead>
          <tbody>
            {items.map((item) => (
              <Tr key={item.id}>
                <Td className="p-2">
                  <input
                    className="w-full bg-transparent border-b border-gray-200 focus:border-primary outline-none py-1"
                    placeholder="Descrição..."
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, 'description', e.target.value)
                    }
                  />
                </Td>
                <Td className="p-2">
                  <input
                    className="w-full text-center bg-transparent border-b border-gray-200 focus:border-primary outline-none py-1"
                    placeholder="un"
                    value={item.unit}
                    onChange={(e) =>
                      updateItem(item.id, 'unit', e.target.value)
                    }
                    maxLength={8}
                  />
                </Td>
                <Td className="p-2">
                  <input
                    type="number"
                    className="w-full text-right bg-transparent border-b border-gray-200 focus:border-primary outline-none py-1 
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '' || parseFloat(val) >= 0) {
                        updateItem(item.id, 'quantity', val)
                      }
                    }}
                  />
                </Td>
                <Td className="p-2">
                  <input
                    type="number"
                    className="w-full text-right bg-transparent border-b border-gray-200 focus:border-primary outline-none py-1
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0.00"
                    value={item.unitPriceLabor}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '' || parseFloat(val) >= 0) {
                        updateItem(item.id, 'unitPriceLabor', val)
                      }
                    }}
                  />
                </Td>
                <Td className="text-right font-semibold">
                  {formatCurrency(calculateTotal(item))}
                </Td>
                <Td className="text-center">
                  <button
                    onClick={() => removeItemRow(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>

        <div className="p-4 bg-gray-50 border-t border-border flex justify-between items-center">
          <Button variant="secondary" size="sm" onClick={addItemRow}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar Item
          </Button>
          <div className="text-right">
            <span className="text-sm text-textSec mr-2">
              Valor Total do Contrato:
            </span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(totalContractValue)}
            </span>
          </div>
        </div>
      </Card>

      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-border p-4 shadow-lg z-20">
        <div className="flex justify-between items-center gap-4">
          {saveError && (
            <div className="flex-1 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{saveError}</p>
            </div>
          )}
          <div className="flex gap-4 ml-auto">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveContract}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Contrato'}
            </Button>
          </div>
        </div>
      </div>

      <SupplierModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onSave={handleSaveSupplier}
      />

      {showSuccessModal && createdContractId && createdContract && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-textMain mb-2">
                Contrato Criado com Sucesso!
              </h3>
              <p className="text-sm text-textSec">
                O contrato foi cadastrado no sistema e está disponível para
                consulta.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                onClick={() => navigate(`/contracts/${createdContractId}`)}
                className="w-full"
              >
                Ver Detalhes do Contrato
              </Button>
              <PDFDownloadLink
                document={
                  <ContractDocument
                    data={prepareContractData(createdContract)}
                  />
                }
                fileName={`contrato-${createdContract.service}-${createdContract.id}.pdf`}
              >
                {({ loading }: { loading: boolean }) => (
                  <Button
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <Download className="w-5 h-5" />
                    {loading ? 'Gerando PDF...' : 'Gerar PDF do Contrato'}
                  </Button>
                )}
              </PDFDownloadLink>
              <Button
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Ir para Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
