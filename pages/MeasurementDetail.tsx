import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, Table, Thead, Th, Tr, Td, Badge, Button, Input } from '../components/UI';
import { formatCurrency } from '../utils';
import { ArrowLeft, CheckCircle, XCircle, Download, Send, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const MeasurementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEnrichedMeasurements, updateMeasurementStatus, currentUser } = useAppContext();
  const [directorNote, setDirectorNote] = useState('');

  const measurement = getEnrichedMeasurements().find(m => m.id === id);

  if (!measurement) return <div className="p-8">Medição não encontrada.</div>;

  const isDirector = currentUser?.role === 'DIRETOR';
  const isPending = measurement.status === 'PENDENTE';
  const isApproved = measurement.status === 'APROVADA';

  const generatePDF = (autoDownload = true) => {
    const doc = new jsPDF();
    const primaryColor = '#2D7E4A';
    
    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("MEDCHECK - RELATÓRIO DE MEDIÇÃO", 105, 13, { align: 'center' });

    // Status
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${measurement.status}`, 14, 30);
    doc.text(`Emissão: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`, 140, 30);

    // Info Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(14, 35, 182, 35, 3, 3, 'FD');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text("DADOS DA OBRA E CONTRATO", 18, 42);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Obra: ${measurement.site.name}`, 18, 50);
    doc.text(`Endereço: ${measurement.site.address}`, 18, 55);
    doc.text(`Contrato: ${measurement.contract.object}`, 18, 60);
    doc.text(`Medição Nº: ${measurement.number}`, 120, 50);
    doc.text(`Período: ${new Date(measurement.createdAt).toLocaleDateString()}`, 120, 55);

    // Supplier & Bank Details Box (Highlight for Finance)
    doc.setFillColor(236, 247, 241); // Light green bg
    doc.setDrawColor(45, 126, 74); // Green border
    doc.roundedRect(14, 75, 182, 35, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 126, 74);
    doc.text("DADOS PARA PAGAMENTO (FINANCEIRO)", 18, 82);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fornecedor: ${measurement.supplier.corporateName}`, 18, 90);
    doc.text(`CNPJ: ${measurement.supplier.cnpj}`, 18, 95);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Dados Bancários: ${measurement.supplier.bankInfo}`, 18, 103);

    // Items Table
    const tableBody = measurement.items.map(item => {
        const cItem = measurement.contract.items.find(ci => ci.id === item.contractItemId);
        return [
            cItem?.description || '-',
            cItem?.unit || '-',
            item.currentQuantity.toString(),
            formatCurrency(item.unitPrice),
            formatCurrency(item.totalValue)
        ];
    });

    autoTable(doc, {
        startY: 115,
        head: [['Descrição', 'Und', 'Qtd', 'Vlr Unit', 'Total']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [45, 126, 74], textColor: 255 },
        foot: [['', '', '', 'TOTAL A PAGAR:', formatCurrency(measurement.totalValue)]],
        footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' }
    });

    // Signature Area
    const finalY = (doc as any).lastAutoTable.finalY + 30;
    
    doc.setDrawColor(0, 0, 0);
    doc.line(20, finalY, 90, finalY); // Signature Line 1
    doc.line(120, finalY, 190, finalY); // Signature Line 2

    doc.setFontSize(8);
    doc.text("Eng. Responsável (Obra)", 55, finalY + 5, { align: 'center' });
    doc.text(measurement.creatorName, 55, finalY + 10, { align: 'center' });

    doc.text("Diretoria (Aprovação)", 155, finalY + 5, { align: 'center' });
    doc.text(`Autorizado em ${new Date().toLocaleDateString()}`, 155, finalY + 10, { align: 'center' });
    
    if (measurement.directorObservation) {
        doc.text(`Obs: ${measurement.directorObservation}`, 14, finalY + 25);
    }

    if (autoDownload) {
        doc.save(`Medicao_${measurement.number}_${measurement.supplier.corporateName.replace(/\s/g, '_')}.pdf`);
    }
    
    return doc; // Return doc for potential email attachment simulation
  };

  const handleApprove = () => {
    if(window.confirm('Confirma a aprovação desta medição?\nO PDF será gerado e enviado ao financeiro.')) {
      // 1. Atualiza Status
      updateMeasurementStatus(measurement.id, 'APROVADA', directorNote);
      
      // 2. Gera o PDF (Download automático)
      generatePDF(true);

      // 3. Redireciona imediatamente para o Dashboard
      // O Contexto atualiza o estado global, então ao carregar o Dashboard, 
      // a medição já não estará mais na lista de pendentes.
      navigate('/director');
    }
  };

  const handleReject = () => {
    if(!directorNote) {
      alert("Para reprovar, é necessário inserir uma observação.");
      return;
    }
    updateMeasurementStatus(measurement.id, 'REPROVADA', directorNote);
    navigate('/director');
  };

  const handleSendToFinance = () => {
      alert("📧 PDF enviado novamente para o setor financeiro.");
  };

  return (
    <div className="space-y-6 pb-20">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-textMain">Medição #{measurement.number}</h1>
              <Badge status={measurement.status} />
            </div>
            <p className="text-textSec mt-1">{measurement.site.name} • {measurement.contract.object}</p>
          </div>
        </div>

        {isApproved && (
            <div className="flex gap-2">
                <Button onClick={handleSendToFinance} variant="ghost">
                    <Send className="w-4 h-4 mr-2" /> Enviar p/ Financeiro
                </Button>
                <Button onClick={() => generatePDF(true)} variant="secondary">
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
                    const contractItem = measurement.contract.items.find(ci => ci.id === item.contractItemId);
                    return (
                      <Tr key={idx}>
                        <Td>{contractItem?.description || 'Item removido'}</Td>
                        <Td className="text-center text-textSec">{contractItem?.unit}</Td>
                        <Td className="text-right font-medium">{item.currentQuantity}</Td>
                        <Td className="text-right text-textSec">{formatCurrency(item.unitPrice)}</Td>
                        <Td className="text-right font-bold">{formatCurrency(item.totalValue)}</Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
              <div className="p-4 flex justify-end border-t border-border bg-surfaceHighlight">
                <span className="text-lg font-bold text-textMain">Total: {formatCurrency(measurement.totalValue)}</span>
              </div>
            </Card>

            <Card title="Observações da Obra">
               <p className="text-textSec italic">{measurement.siteObservation || 'Nenhuma observação registrada.'}</p>
            </Card>
         </div>

         <div className="space-y-6">
            <Card title="Dados Gerais">
               <div className="space-y-4 text-sm">
                  <div>
                    <label className="text-textSec block mb-1">Fornecedor</label>
                    <p className="font-medium text-textMain">{measurement.supplier.corporateName}</p>
                    <p className="text-xs text-textSec">{measurement.supplier.cnpj}</p>
                  </div>
                  <div>
                    <label className="text-textSec block mb-1">Criado por</label>
                    <p className="font-medium text-textMain">{measurement.creatorName}</p>
                    <p className="text-xs text-textSec">{new Date(measurement.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md border border-green-100">
                     <label className="text-primary font-bold block mb-1 flex items-center gap-1">
                        <span>Dados Bancários</span>
                     </label>
                     <p className="text-sm text-textMain font-mono break-all">{measurement.supplier.bankInfo}</p>
                     <p className="text-[10px] text-textSec mt-1">Verificado para pagamentos.</p>
                  </div>
               </div>
            </Card>

            {/* Director Actions Panel */}
            {isDirector && isPending && (
              <Card title="Aprovação Diretoria" className="border-t-4 border-t-primary shadow-md">
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
                    <p className="text-xs text-center text-textSec">Ao aprovar, o PDF será enviado ao financeiro.</p>
                 </div>
              </Card>
            )}

            {/* Read-only Director Note */}
            {!isPending && measurement.directorObservation && (
               <Card title="Parecer da Diretoria">
                 <p className={`text-sm italic p-3 rounded ${measurement.status === 'REPROVADA' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                   "{measurement.directorObservation}"
                 </p>
               </Card>
            )}
         </div>
      </div>
    </div>
  );
};
