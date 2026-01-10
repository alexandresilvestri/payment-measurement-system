import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppContext } from '../context/AppContext'
import {
  Card,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Badge,
  Button,
  Input,
} from '../components/UI'
import { formatCurrency } from '../utils'
import { ArrowLeft, CheckCircle, XCircle, Download, Send } from 'lucide-react'

export const MeasurementDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const { getEnrichedMeasurements, updateMeasurementStatus } = useAppContext()
  const [directorNote, setDirectorNote] = useState('')

  const measurement = getEnrichedMeasurements().find((m) => m.id === id)

  if (!measurement) return <div className="p-8">Medição não encontrada.</div>

  const canApprove = authUser?.permissions?.approveMeasurement ?? false
  const isPending = measurement.status === 'PENDENTE'
  const isApproved = measurement.status === 'APROVADA'
  const handleApprove = () => {
    if (
      window.confirm(
        'Confirma a aprovação desta medição?\nO PDF será gerado e enviado ao financeiro.'
      )
    ) {
      updateMeasurementStatus(measurement.id, 'APROVADA', directorNote)

      navigate('/dashboard')
    }
  }

  const handleReject = () => {
    if (!directorNote) {
      alert('Para reprovar, é necessário inserir uma observação.')
      return
    }
    updateMeasurementStatus(measurement.id, 'REPROVADA', directorNote)
    navigate('/director')
  }

  const handleSendToFinance = () => {
    alert('PDF enviado novamente para o setor financeiro.')
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-textMain">
                Medição #{measurement.number}
              </h1>
              <Badge status={measurement.status} />
            </div>
            <p className="text-textSec mt-1">
              {measurement.work.name} • {measurement.contract.service}
            </p>
          </div>
        </div>
        {isApproved && (
          <div className="flex gap-2">
            <Button onClick={handleSendToFinance} variant="ghost">
              <Send className="w-4 h-4 mr-2" /> Enviar p/ Financeiro
            </Button>
            <Button onClick={() => '' /* PDF */} variant="secondary">
              <Download className="w-4 h-4 mr-2" /> Baixar PDF
            </Button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card title="Itens Medidos">
            <Table>
              <Thead>
                <Tr>
                  <Th>Descrição</Th>
                  <Th className="text-center">Und</Th>
                  <Th className="text-right">Qtd. Medida</Th>
                  <Th className="text-right">Valor Unit.</Th>
                  <Th className="text-right">Total</Th>
                </Tr>
              </Thead>
              <tbody>
                {measurement.items.map((item, idx) => {
                  const contractItem = measurement.contract.items.find(
                    (ci) => ci.id === item.contractItemId
                  )
                  return (
                    <Tr key={idx}>
                      <Td>{contractItem?.description || 'Item removido'}</Td>
                      <Td className="text-center text-textSec">
                        {contractItem?.unitMeasure}
                      </Td>
                      <Td className="text-right font-medium">
                        {item.currentQuantity}
                      </Td>
                      <Td className="text-right text-textSec">
                        {formatCurrency(item.unitPrice)}
                      </Td>
                      <Td className="text-right font-bold">
                        {formatCurrency(item.totalValue)}
                      </Td>
                    </Tr>
                  )
                })}
              </tbody>
            </Table>
            <div className="p-4 flex justify-end border-t border-border bg-surfaceHighlight">
              <span className="text-lg font-bold text-textMain">
                Total: {formatCurrency(measurement.totalValue)}
              </span>
            </div>
          </Card>

          <Card title="Observações da Obra">
            <p className="text-textSec italic">
              {measurement.siteObservation || 'Nenhuma observação registrada.'}
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Dados Gerais">
            <div className="space-y-4 text-sm">
              <div>
                <label className="text-textSec block mb-1">Fornecedor</label>
                <p className="font-medium text-textMain">
                  {measurement.supplier.name}
                </p>
                <p className="text-xs text-textSec">
                  {measurement.supplier.document}
                </p>
              </div>
              <div>
                <label className="text-textSec block mb-1">Criado por</label>
                <p className="font-medium text-textMain">
                  {measurement.creatorName}
                </p>
                <p className="text-xs text-textSec">
                  {new Date(measurement.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-md border border-green-100">
                <label className="text-primary font-bold mb-1 flex items-center gap-1">
                  <span>Chave Pix</span>
                </label>
                <p className="text-sm text-textMain font-mono break-all">
                  {measurement.supplier.pix || 'Não informado'}
                </p>
                <p className="text-[10px] text-textSec mt-1">
                  Verificado para pagamentos.
                </p>
              </div>
            </div>
          </Card>

          {canApprove && isPending && (
            <Card
              title="Aprovação Diretoria"
              className="border-t-4 border-t-primary shadow-md"
            >
              <div className="space-y-4">
                <Input
                  label="Observações / Motivo Reprovação"
                  placeholder="Adicione notas internas..."
                  value={directorNote}
                  onChange={(e) => setDirectorNote(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="danger" onClick={handleReject}>
                    <XCircle className="w-4 h-4 mr-2" /> Reprovar
                  </Button>
                  <Button variant="primary" onClick={handleApprove}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Aprovar
                  </Button>
                </div>
                <p className="text-xs text-center text-textSec">
                  Ao aprovar, o PDF será enviado ao financeiro.
                </p>
              </div>
            </Card>
          )}

          {!isPending && measurement.directorObservation && (
            <Card title="Parecer da Diretoria">
              <p
                className={`text-sm italic p-3 rounded ${
                  measurement.status === 'REPROVADA'
                    ? 'bg-red-50 text-red-800'
                    : 'bg-green-50 text-green-800'
                }`}
              >
                &quot;{measurement.directorObservation}&quot;
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
