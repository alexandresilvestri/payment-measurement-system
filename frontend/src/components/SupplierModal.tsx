import { useState, useEffect } from 'react'
import { Button, Input, Select } from './UI'
import { X, Users as UsersIcon, Loader2 } from 'lucide-react'
import {
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '../pages/services/suppliers'
import { Supplier } from '../types'

interface SupplierModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreateSupplierRequest | UpdateSupplierRequest) => Promise<void>
  editingSupplier?: Supplier | null
}

export const SupplierModal = ({
  isOpen,
  onClose,
  onSave,
  editingSupplier,
}: SupplierModalProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [typePerson, setTypePerson] = useState<'FISICA' | 'JURIDICA'>(
    'JURIDICA'
  )
  const [document, setDocument] = useState('')
  const [pix, setPix] = useState('')
  const [nameError, setNameError] = useState('')
  const [docError, setDocError] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (editingSupplier) {
      setName(editingSupplier.name)
      setTypePerson(editingSupplier.typePerson)
      setDocument(editingSupplier.document)
      setPix(editingSupplier.pix || '')
    } else {
      setName('')
      setTypePerson('JURIDICA')
      setDocument('')
      setPix('')
    }
    setNameError('')
    setDocError('')
    setFormError('')
  }, [editingSupplier, isOpen])

  const validateForm = (): boolean => {
    let isValid = true

    setNameError('')
    setDocError('')
    setFormError('')

    if (!name.trim()) {
      setNameError('O nome/razão social é obrigatório')
      isValid = false
    }

    if (!document.trim()) {
      setDocError('O CNPJ/CPF é obrigatório')
      isValid = false
    }

    return isValid
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      if (editingSupplier) {
        const data: UpdateSupplierRequest = {
          name: name.trim(),
          typePerson,
          document: document.trim(),
          pix: pix.trim() || undefined,
        }
        await onSave(data)
      } else {
        const data: CreateSupplierRequest = {
          name: name.trim(),
          typePerson,
          document: document.trim(),
          pix: pix.trim() || undefined,
        }
        await onSave(data)
      }

      // Reset form
      setName('')
      setTypePerson('JURIDICA')
      setDocument('')
      setPix('')
      setNameError('')
      setDocError('')
    } catch (err) {
      console.error('Error saving supplier:', err)
      setFormError('Erro ao salvar fornecedor. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setName('')
    setTypePerson('JURIDICA')
    setDocument('')
    setPix('')
    setNameError('')
    setDocError('')
    setFormError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <div className="flex items-center gap-2 text-primary">
            <UsersIcon className="w-6 h-6" />
            <h3 className="text-xl font-bold text-textMain">
              {editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </h3>
          </div>
          <button
            onClick={handleClose}
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
              label="Nome / Razão Social *"
              placeholder="Ex: Empreiteira Silva Ltda"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (nameError) setNameError('')
              }}
              disabled={submitting}
              error={nameError}
            />

            <Select
              label="Tipo de Pessoa *"
              value={typePerson}
              onChange={(e) =>
                setTypePerson(e.target.value as 'FISICA' | 'JURIDICA')
              }
              disabled={submitting}
              options={[
                { value: 'JURIDICA', label: 'Pessoa Jurídica (CNPJ)' },
                { value: 'FISICA', label: 'Pessoa Física (CPF)' },
              ]}
            />

            <Input
              label={typePerson === 'JURIDICA' ? 'CNPJ *' : 'CPF *'}
              placeholder={
                typePerson === 'JURIDICA'
                  ? '00.000.000/0000-00'
                  : '000.000.000-00'
              }
              value={document}
              onChange={(e) => {
                setDocument(e.target.value)
                if (docError) setDocError('')
              }}
              disabled={submitting}
              error={docError}
            />

            <Input
              label="Chave Pix"
              placeholder="E-mail, CPF, CNPJ ou Aleatória"
              value={pix}
              onChange={(e) => setPix(e.target.value)}
              disabled={submitting}
            />
          </div>

          {formError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleClose}
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
              ) : editingSupplier ? (
                'Salvar Alterações'
              ) : (
                'Cadastrar'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
