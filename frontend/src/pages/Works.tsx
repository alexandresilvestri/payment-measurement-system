import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Input,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Badge,
  Select,
} from '../components/UI'
import {
  ArrowLeft,
  Building2,
  Plus,
  X,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Work } from '../types'
import { worksApi } from './services/works'
import { FetchError } from '../lib/fetchClient'

export const Works = () => {
  const navigate = useNavigate()

  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingWork, setEditingWork] = useState<Work | null>(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [workToDelete, setWorkToDelete] = useState<Work | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [contractor, setContractor] = useState('')
  const [status, setStatus] = useState<'ATIVA' | 'CONCLUIDA'>('ATIVA')

  const [nameError, setNameError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await worksApi.getAll()
      setWorks(data)
    } catch (err) {
      console.error('Error fetching works:', err)
      setError('Erro ao carregar obras. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (work?: Work) => {
    if (work) {
      setEditingWork(work)
      setName(work.name)
      setAddress(work.address)
      setContractor(work.contractor || '')
      setStatus(work.status)
    } else {
      setEditingWork(null)
      setName('')
      setAddress('')
      setContractor('')
      setStatus('ATIVA')
    }
    setNameError('')
    setAddressError('')
    setFormError('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingWork(null)
    setName('')
    setAddress('')
    setContractor('')
    setStatus('ATIVA')
    setNameError('')
    setAddressError('')
    setFormError('')
  }

  const validateForm = (): boolean => {
    let isValid = true

    setNameError('')
    setAddressError('')

    if (!name.trim()) {
      setNameError('O nome do Local é obrigatório')
      isValid = false
    }

    if (!address.trim()) {
      setAddressError('O endereço é obrigatório')
      isValid = false
    }

    return isValid
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setFormError('')

    try {
      setSubmitting(true)

      if (editingWork) {
        const updatedWork = await worksApi.update(editingWork.id, {
          name: name.trim(),
          address: address.trim(),
          contractor: contractor.trim() || undefined,
          status,
        })
        setWorks(works.map((w) => (w.id === editingWork.id ? updatedWork : w)))
      } else {
        const newWork = await worksApi.create({
          name: name.trim(),
          address: address.trim(),
          contractor: contractor.trim(),
          status: 'ATIVA',
        })
        setWorks([...works, newWork])
      }

      handleCloseModal()
    } catch (err) {
      console.error('Error saving work:', err)

      if (err && typeof err === 'object' && 'response' in err) {
        const fetchError = err as FetchError<{ message?: string }>

        if (fetchError.response?.status === 409) {
          setNameError('Erro: Já existe uma obra com este nome')
          return
        }

        if (fetchError.response?.status === 400) {
          setFormError(
            fetchError.response?.data?.message ||
              'Erro de validação. Verifique os campos.'
          )
          return
        }
      }

      setFormError('Erro ao salvar obra. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (work: Work) => {
    setWorkToDelete(work)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!workToDelete) return

    try {
      setDeleting(true)
      await worksApi.delete(workToDelete.id)
      setWorks(works.filter((w) => w.id !== workToDelete.id))
      setShowDeleteModal(false)
      setWorkToDelete(null)
    } catch (err) {
      console.error('Error deleting work:', err)
      alert('Erro ao excluir obra. Tente novamente.')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setWorkToDelete(null)
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
              Gestão de Obras
            </h1>
            <p className="text-textSec">Obras cadastradas</p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" /> Nova Obra
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
            <Button onClick={fetchWorks}>Tentar Novamente</Button>
          </div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Cód</Th>
                <Th>Nome da Obra</Th>
                <Th>Contratante</Th>
                <Th>Endereço</Th>
                <Th className="text-center">Status</Th>
                <Th className="text-center">Ações</Th>
              </Tr>
            </Thead>
            <tbody>
              {works.map((work) => (
                <Tr key={work.id}>
                  <Td className="font-mono text-xs text-textSec">
                    {work.code || '-'}
                  </Td>
                  <Td className="font-medium text-textMain">{work.name}</Td>
                  <Td>{work.contractor || '-'}</Td>
                  <Td className="text-sm text-textSec">{work.address}</Td>
                  <Td className="text-center">
                    <Badge status={work.status} />
                  </Td>
                  <Td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(work)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar obra"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(work)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Excluir obra"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
              {works.length === 0 && (
                <Tr>
                  <Td colSpan={6} className="text-center py-8 text-textSec">
                    Nenhuma obra cadastrada.
                  </Td>
                </Tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <div className="flex items-center gap-2 text-primary">
                <Building2 className="w-6 h-6" />
                <h3 className="text-xl font-bold text-textMain">
                  {editingWork ? 'Editar Obra' : 'Nova Obra'}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-textSec hover:text-red-500"
                disabled={submitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                handleSave()
              }}
            >
              <div className="space-y-4">
                <Input
                  label="Nome do Local *"
                  placeholder="Ex: Residencial Jardins"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (nameError) setNameError('')
                  }}
                  disabled={submitting}
                  error={nameError}
                />

                <Input
                  label="Endereço Completo *"
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value)
                    if (addressError) setAddressError('')
                  }}
                  disabled={submitting}
                  error={addressError}
                />

                <Input
                  label="Contratante (Cliente)"
                  placeholder="Nome da Incorporadora ou Cliente (Opcional)"
                  value={contractor}
                  onChange={(e) => setContractor(e.target.value)}
                  disabled={submitting}
                />

                {editingWork && (
                  <Select
                    label="Status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as 'ATIVA' | 'CONCLUIDA')
                    }
                    disabled={submitting}
                    options={[
                      { value: 'ATIVA', label: 'Ativa' },
                      { value: 'CONCLUIDA', label: 'Concluída' },
                    ]}
                  />
                )}
              </div>

              {formError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : editingWork ? (
                    'Salvar Alterações'
                  ) : (
                    'Salvar Obra'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && workToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-textMain">
                  Excluir Obra
                </h3>
                <p className="text-sm text-textSec">
                  Deseja excluir esta obra?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-textMain mb-1">
                {workToDelete.name}
              </p>
              <p className="text-xs text-textSec">{workToDelete.address}</p>
            </div>

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
