import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, Table, Thead, Th, Tr, Td, Badge, Button } from '../components/UI';
import { Eye, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils';

export const DirectorDashboard = () => {
  const { getEnrichedMeasurements, contracts, sites, suppliers } = useAppContext();
  const navigate = useNavigate();

  const allMeasurements = getEnrichedMeasurements();
  const pendingMeasurements = allMeasurements.filter(m => m.status === 'PENDENTE');

  // Helper for contract overview
  const activeContracts = contracts.filter(c => c.status === 'ATIVO').map(c => {
    const site = sites.find(s => s.id === c.constructionSiteId);
    const supplier = suppliers.find(s => s.id === c.supplierId);
    
    // Calculate progress
    const measurementsForContract = allMeasurements.filter(m => m.contractId === c.id && m.status === 'APROVADA');
    const totalMeasured = measurementsForContract.reduce((acc, m) => acc + m.totalValue, 0);
    const percentage = (totalMeasured / c.totalValue) * 100;

    return {
      ...c,
      siteName: site?.name || 'N/A',
      supplierName: supplier?.corporateName || 'N/A',
      totalMeasured,
      percentage
    };
  });

  return (
    <div className="space-y-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-textMain">Painel do Diretor</h1>
        <p className="text-textSec">Visão geral de aprovações e contratos ativos.</p>
      </header>

      {/* Pending Measurements */}
      <Card title="Medições Pendentes de Aprovação" className="border-l-4 border-l-statusPending">
        {pendingMeasurements.length === 0 ? (
          <div className="text-center py-8 text-textSec">Nenhuma medição pendente no momento.</div>
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
              {pendingMeasurements.map(m => (
                <Tr key={m.id} onClick={() => navigate(`/measurement/${m.id}`)}>
                  <Td className="font-medium text-textMain">{m.site.name}</Td>
                  <Td>{m.supplier.corporateName}</Td>
                  <Td>{m.contract.object}</Td>
                  <Td>#{m.number}</Td>
                  <Td>{new Date(m.createdAt).toLocaleDateString()}</Td>
                  <Td className="text-right font-semibold">{formatCurrency(m.totalValue)}</Td>
                  <Td className="text-center">
                    <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/measurement/${m.id}`); }}>
                      Avaliar
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Active Contracts Overview */}
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
            {activeContracts.map(c => (
              <Tr key={c.id}>
                <Td className="font-medium">{c.siteName}</Td>
                <Td>{c.supplierName}</Td>
                <Td>{c.object}</Td>
                <Td className="text-right">{formatCurrency(c.totalValue)}</Td>
                <Td className="text-right text-textSec">{formatCurrency(c.totalMeasured)}</Td>
                <Td className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(c.percentage, 100)}%` }}></div>
                    </div>
                    <span className="text-xs font-medium">{c.percentage.toFixed(1)}%</span>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
