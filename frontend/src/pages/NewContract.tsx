import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Card, Table, Thead, Th, Tr, Td, Button, Input } from '../components/UI'
import { formatCurrency } from '../utils'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { Contract, ContractItem, Supplier } from '../types'
import { SupplierModal } from '../components/SupplierModal'
import {
  suppliersApi,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from './services/suppliers'

interface NewItemDraft {
  id: string
  description: string
  unit: string
  quantityContracted: string
  unitPriceMaterial: string
  unitPriceLabor: string
}

export const NewContract = () => {
  const navigate = useNavigate()
  const { currentUser, sites, addContract } = useAppContext()

  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  const isDirector = currentUser?.role === 'DIRETOR'
  const userSiteIds = currentUser?.linkedConstructionSiteIds || []

  const [siteId, setSiteId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [object, setObject] = useState('')
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState('')

  const [showSupplierModal, setShowSupplierModal] = useState(false)

  const [items, setItems] = useState<NewItemDraft[]>([
    {
      id: '1',
      description: '',
      unit: '',
      quantityContracted: '',
      unitPriceMaterial: '',
      unitPriceLabor: '',
    },
  ])

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const data = await suppliersApi.getAll()
      setSuppliers(data)
    } catch (err) {
      console.error('Error fetching suppliers:', err)
    }
  }

  const availableSites = isDirector
    ? sites
    : sites.filter((s) => userSiteIds.includes(s.id))

  const selectedSupplier = suppliers.find((s) => s.id === supplierId)

  const addItemRow = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: '',
        unit: '',
        quantityContracted: '',
        unitPriceMaterial: '',
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
    const qty = parseFloat(item.quantityContracted) || 0
    const mat = parseFloat(item.unitPriceMaterial) || 0
    const lab = parseFloat(item.unitPriceLabor) || 0
    return qty * (mat + lab)
  }

  const totalContractValue = items.reduce(
    (acc, item) => acc + calculateTotal(item),
    0
  )

  const handleSaveContract = () => {
    if (!siteId || !supplierId || !object) {
      alert('Preencha os campos obrigatórios: Obra, Fornecedor e Objeto.')
      return
    }

    if (
      items.some(
        (i) =>
          !i.description ||
          !i.quantityContracted ||
          (!i.unitPriceMaterial && !i.unitPriceLabor)
      )
    ) {
      alert('Preencha corretamente todos os itens do contrato.')
      return
    }

    const newContractItems: ContractItem[] = items.map((item, index) => {
      const mat = parseFloat(item.unitPriceMaterial) || 0
      const lab = parseFloat(item.unitPriceLabor) || 0
      return {
        id: `ci-${Date.now()}-${index}`,
        contractId: '',
        description: item.description,
        unit: item.unit,
        quantityContracted: parseFloat(item.quantityContracted) || 0,
        unitPriceMaterial: mat,
        unitPriceLabor: lab,
        unitPriceTotal: mat + lab,
        totalValue: (parseFloat(item.quantityContracted) || 0) * (mat + lab),
      }
    })

    const newContract: Contract = {
      id: `c-${Date.now()}`,
      constructionSiteId: siteId,
      supplierId: supplierId,
      object: object,
      totalValue: totalContractValue,
      startDate: startDate,
      endDate: endDate || startDate,
      status: 'ATIVO',
      items: newContractItems,
    }

    addContract(newContract)
    alert('Contrato criado com sucesso!')
    navigate(isDirector ? '/director' : '/site')
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
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
              >
                <option value="">Selecione a obra...</option>
                {availableSites.map((s) => (
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
                  {selectedSupplier.document}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Input
              label="Serviço / Objeto do Contrato *"
              placeholder="Ex: Instalações Elétricas Torre B"
              value={object}
              onChange={(e) => setObject(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data Início"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="Data Fim"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
              <Th className="w-32 text-right">Unit. Mat.</Th>
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
                  />
                </Td>
                <Td className="p-2">
                  <input
                    type="number"
                    className="w-full text-right bg-transparent border-b border-gray-200 focus:border-primary outline-none py-1"
                    placeholder="0"
                    value={item.quantityContracted}
                    onChange={(e) =>
                      updateItem(item.id, 'quantityContracted', e.target.value)
                    }
                  />
                </Td>
                <Td className="p-2">
                  <input
                    type="number"
                    className="w-full text-right bg-transparent border-b border-gray-200 focus:border-primary outline-none py-1"
                    placeholder="0.00"
                    value={item.unitPriceMaterial}
                    onChange={(e) =>
                      updateItem(item.id, 'unitPriceMaterial', e.target.value)
                    }
                  />
                </Td>
                <Td className="p-2">
                  <input
                    type="number"
                    className="w-full text-right bg-transparent border-b border-gray-200 focus:border-primary outline-none py-1"
                    placeholder="0.00"
                    value={item.unitPriceLabor}
                    onChange={(e) =>
                      updateItem(item.id, 'unitPriceLabor', e.target.value)
                    }
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

      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-border p-4 shadow-lg flex justify-end gap-4 z-20">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSaveContract}>
          <Save className="w-4 h-4 mr-2" /> Salvar Contrato
        </Button>
      </div>

      <SupplierModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onSave={handleSaveSupplier}
      />
    </div>
  )
}
