import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Table, Thead, Th, Tr, Td } from '../components/UI'
import { ArrowLeft, Plus, Loader2, Pencil, Trash2 } from 'lucide-react'
import { Supplier } from '../types'
import { SupplierModal } from '../components/SupplierModal'
import {
  suppliersApi,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from './services/suppliers'
import { AxiosError } from 'axios'

export const Suppliers = () => {
  const navigate = useNavigate()

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  )
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await suppliersApi.getAll()
      setSuppliers(data)
    } catch (err) {
      console.error('Error fetching suppliers:', err)
      setError('Erro ao carregar fornecedores. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier)
    } else {
      setEditingSupplier(null)
    }
    setShowSupplierModal(true)
  }

  const handleCloseModal = () => {
    setShowSupplierModal(false)
    setEditingSupplier(null)
  }

  const handleSaveSupplier = async (
    data: CreateSupplierRequest | UpdateSupplierRequest
  ) => {
    try {
      if (editingSupplier) {
        const updatedSupplier = await suppliersApi.update(
          editingSupplier.id,
          data as UpdateSupplierRequest
        )
        setSuppliers(
          suppliers.map((s) =>
            s.id === editingSupplier.id ? updatedSupplier : s
          )
        )
      } else {
        const newSupplier = await suppliersApi.create(
          data as CreateSupplierRequest
        )
        setSuppliers([...suppliers, newSupplier])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Error saving supplier:', err)
      setError('Erro ao salvar fornecedor. Tente novamente.')
      throw err
    }
  }

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier)
    setDeleteError(null)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!supplierToDelete) return

    try {
      setDeleting(true)
      setDeleteError(null)
      await suppliersApi.delete(supplierToDelete.id)
      setSuppliers(suppliers.filter((s) => s.id !== supplierToDelete.id))
      setShowDeleteModal(false)
      setSupplierToDelete(null)
    } catch (err) {
      console.error('Error deleting supplier:', err)

      // Handle specific error cases
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as AxiosError<{ message?: string }>

        // Handle 409 Conflict (supplier is being used)
        if (axiosError.response?.status === 409) {
          setDeleteError(
            'Não é possível excluir este fornecedor pois ele está vinculado a contratos existentes.'
          )
          return
        }

        // Handle 404 Not Found
        if (axiosError.response?.status === 404) {
          setDeleteError('Fornecedor não encontrado.')
          return
        }

        // Handle 400 Bad Request
        if (axiosError.response?.status === 400) {
          setDeleteError(
            axiosError.response.data?.message ||
              'Dados inválidos. Verifique e tente novamente.'
          )
          return
        }
      }

      // Generic error
      setDeleteError(
        'Erro ao excluir fornecedor. Verifique sua conexão e tente novamente.'
      )
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setSupplierToDelete(null)
    setDeleteError(null)
  }

  return (
    <div className="space-y-6 pb-20 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-textMain">
              Gestão de Fornecedores
            </h1>
            <p className="text-textSec">Fornecedores cadastrados</p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" /> Novo Fornecedor
        </Button>
      </header>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchSuppliers}>Tentar Novamente</Button>
          </div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Nome / Razão Social</Th>
                <Th>Tipo</Th>
                <Th>Documento</Th>
                <Th>Chave Pix</Th>
                <Th className="text-center">Ações</Th>
              </Tr>
            </Thead>
            <tbody>
              {suppliers.map((supplier) => (
                <Tr key={supplier.id}>
                  <Td className="font-medium text-textMain">{supplier.name}</Td>
                  <Td className="text-sm">
                    {supplier.typePerson === 'JURIDICA' ? 'PJ' : 'PF'}
                  </Td>
                  <Td className="font-mono text-sm">{supplier.document}</Td>
                  <Td className="text-sm text-textSec">
                    {supplier.pix || '-'}
                  </Td>
                  <Td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(supplier)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar fornecedor"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(supplier)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Excluir fornecedor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
              {suppliers.length === 0 && (
                <Tr>
                  <Td colSpan={5} className="text-center py-8 text-textSec">
                    Nenhum fornecedor cadastrado.
                  </Td>
                </Tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>

      <SupplierModal
        isOpen={showSupplierModal}
        onClose={handleCloseModal}
        onSave={handleSaveSupplier}
        editingSupplier={editingSupplier}
      />

      {showDeleteModal && supplierToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-textMain">
                  Excluir Fornecedor
                </h3>
                <p className="text-sm text-textSec">
                  Deseja excluir este fornecedor?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-textMain mb-1">
                {supplierToDelete.name}
              </p>
              <p className="text-xs text-textSec">
                {supplierToDelete.typePerson === 'JURIDICA' ? 'CNPJ' : 'CPF'}:{' '}
                {supplierToDelete.document}
              </p>
            </div>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Confirmar'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
