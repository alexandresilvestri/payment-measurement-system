import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
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
} from '../components/UI'
import { ArrowLeft, Building2, Plus, X } from 'lucide-react'
import { ConstructionSite } from '../types'

export const NewSite = () => {
  const navigate = useNavigate()
  const { sites, addSite /*currentUser*/ } = useAppContext()

  // Modal State
  const [showModal, setShowModal] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [contractor, setContractor] = useState('')

  // const isDirector = currentUser?.role === 'DIRETOR'

  const handleSave = () => {
    if (!name || !address || !contractor) {
      alert('Por favor, preencha todos os campos da obra.')
      return
    }

    const newSite: ConstructionSite = {
      id: `s-${Date.now()}`,
      name,
      address,
      contractor,
      code: `OB-${Math.floor(Math.random() * 1000)}`,
      status: 'ATIVO',
    }

    addSite(newSite)
    setShowModal(false)

    // Clear inputs
    setName('')
    setAddress('')
    setContractor('')
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
            <p className="text-textSec">
              Visualize as obras cadastradas ou adicione novos empreendimentos.
            </p>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-5 h-5 mr-2" /> Nova Obra
        </Button>
      </header>

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>Cód</Th>
              <Th>Nome da Obra</Th>
              <Th>Contratante</Th>
              <Th>Endereço</Th>
              <Th className="text-center">Status</Th>
            </Tr>
          </Thead>
          <tbody>
            {sites.map((site) => (
              <Tr key={site.id}>
                <Td className="font-mono text-xs text-textSec">
                  {site.code || '-'}
                </Td>
                <Td className="font-medium text-textMain">{site.name}</Td>
                <Td>{site.contractor}</Td>
                <Td className="text-sm text-textSec">{site.address}</Td>
                <Td className="text-center">
                  <Badge status={site.status} />
                </Td>
              </Tr>
            ))}
            {sites.length === 0 && (
              <Tr>
                <Td colSpan={5} className="text-center py-8 text-textSec">
                  Nenhuma obra cadastrada.
                </Td>
              </Tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* New Site Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <div className="flex items-center gap-2 text-primary">
                <Building2 className="w-6 h-6" />
                <h3 className="text-xl font-bold text-textMain">Nova Obra</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-textSec hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Nome do Empreendimento *"
                placeholder="Ex: Residencial Jardins"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Contratante (Cliente) *"
                placeholder="Nome da Incorporadora ou Cliente"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
              />

              <Input
                label="Endereço Completo *"
                placeholder="Rua, Número, Bairro, Cidade - UF"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Salvar Obra
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
