# Contract Listing Screen Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a contract listing screen with filtering by work and supplier, following existing app patterns.

**Architecture:** React component with table layout, filter dropdowns, and click-to-navigate behavior. API service layer for data fetching, reusing existing patterns from Suppliers.tsx.

**Tech Stack:** React, TypeScript, React Router, Lucide React icons, existing UI components (Card, Table, Button), fetchClient API layer

---

## Task 1: Add ContractListItem type to frontend

**Files:**
- Modify: `frontend/src/types.ts:97`

**Step 1: Add ContractListItem interface**

Add the following interface after the EnrichedMeasurement interface:

```typescript
export interface ContractListItem {
  id: string
  work: { id: string; name: string }
  supplier: { id: string; name: string }
  service: string
  totalValue: number
  startDate: string
  deliveryTime: string | null
  status: 'Ativo' | 'Encerrado'
  percentage: number
}
```

**Step 2: Verify the type is exported**

Run: `grep -n "export interface ContractListItem" frontend/src/types.ts`
Expected: Should show the line number where the interface is defined

**Step 3: Commit**

```bash
git add frontend/src/types.ts
git commit -m "feat: add ContractListItem type for contracts listing"
```

---

## Task 2: Create contracts API service

**Files:**
- Create: `frontend/src/pages/services/contracts.ts`

**Step 1: Create the contracts service file**

Create `frontend/src/pages/services/contracts.ts` with the following content:

```typescript
import { ContractListItem } from '../../types'
import { api } from './api'

export const contractsApi = {
  getAll: async (filters?: {
    workId?: string
    supplierId?: string
  }): Promise<ContractListItem[]> => {
    const params = new URLSearchParams()
    if (filters?.workId) params.append('workId', filters.workId)
    if (filters?.supplierId) params.append('supplierId', filters.supplierId)

    const url = `/contracts${params.toString() ? `?${params}` : ''}`
    const response = await api.get<ContractListItem[]>(url)
    return response.data
  },
}
```

**Step 2: Verify the file compiles**

Run: `cd frontend && npm run build`
Expected: Build should succeed without TypeScript errors

**Step 3: Commit**

```bash
git add frontend/src/pages/services/contracts.ts
git commit -m "feat: add contracts API service with filtering"
```

---

## Task 3: Create Contracts listing page component

**Files:**
- Create: `frontend/src/pages/Contracts.tsx`

**Step 1: Create the Contracts component file**

Create `frontend/src/pages/Contracts.tsx` with the following content:

```typescript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Table, Thead, Th, Tr, Td } from '../components/UI'
import { ArrowLeft, Loader2, FileText } from 'lucide-react'
import { ContractListItem, ConstructionSite, Supplier } from '../types'
import { contractsApi } from './services/contracts'
import { worksApi } from './services/works'
import { suppliersApi } from './services/suppliers'

export const Contracts = () => {
  const navigate = useNavigate()

  const [contracts, setContracts] = useState<ContractListItem[]>([])
  const [works, setWorks] = useState<ConstructionSite[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedWorkId, setSelectedWorkId] = useState<string>('')
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('')

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchContracts()
  }, [selectedWorkId, selectedSupplierId])

  const fetchInitialData = async () => {
    try {
      const [worksData, suppliersData] = await Promise.all([
        worksApi.getAll(),
        suppliersApi.getAll(),
      ])
      setWorks(worksData)
      setSuppliers(suppliersData)
    } catch (err) {
      console.error('Error fetching filter data:', err)
    }
  }

  const fetchContracts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await contractsApi.getAll({
        workId: selectedWorkId || undefined,
        supplierId: selectedSupplierId || undefined,
      })
      setContracts(data)
    } catch (err) {
      console.error('Error fetching contracts:', err)
      setError('Erro ao carregar contratos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const handleRowClick = (contractId: string) => {
    navigate(`/contracts/${contractId}`)
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
              Gestão de Contratos
            </h1>
            <p className="text-textSec">Contratos cadastrados</p>
          </div>
        </div>
      </header>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-textMain mb-1">
            Filtrar por Obra
          </label>
          <select
            value={selectedWorkId}
            onChange={(e) => setSelectedWorkId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todas as obras</option>
            {works.map((work) => (
              <option key={work.id} value={work.id}>
                {work.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-textMain mb-1">
            Filtrar por Fornecedor
          </label>
          <select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos os fornecedores</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchContracts}>Tentar Novamente</Button>
          </div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Obra</Th>
                <Th>Fornecedor</Th>
                <Th>Serviço</Th>
                <Th className="text-right">Valor Total</Th>
                <Th className="text-center">Progresso</Th>
              </Tr>
            </Thead>
            <tbody>
              {contracts.map((contract) => (
                <Tr
                  key={contract.id}
                  onClick={() => handleRowClick(contract.id)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Td className="font-medium text-textMain">
                    {contract.work.name}
                  </Td>
                  <Td className="text-sm">{contract.supplier.name}</Td>
                  <Td
                    className="text-sm truncate max-w-xs"
                    title={contract.service}
                  >
                    {contract.service}
                  </Td>
                  <Td className="text-right font-mono">
                    {formatCurrency(contract.totalValue)}
                  </Td>
                  <Td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(contract.percentage, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">
                        {contract.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </Td>
                </Tr>
              ))}
              {contracts.length === 0 && (
                <Tr>
                  <Td colSpan={5} className="text-center py-8 text-textSec">
                    {selectedWorkId || selectedSupplierId
                      ? 'Nenhum contrato encontrado com os filtros selecionados.'
                      : 'Nenhum contrato cadastrado.'}
                  </Td>
                </Tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}
```

**Step 2: Verify the file compiles**

Run: `cd frontend && npm run build`
Expected: Build should succeed without TypeScript errors

**Step 3: Commit**

```bash
git add frontend/src/pages/Contracts.tsx
git commit -m "feat: add Contracts listing page with filters"
```

---

## Task 4: Add Contratos link to sidebar navigation

**Files:**
- Modify: `frontend/src/components/Layout.tsx:88`

**Step 1: Add FileText import at top of file**

The FileText icon is already imported at line 7, so no change needed here.

**Step 2: Add Contratos link after Fornecedores**

After line 88 (the closing Link tag for Fornecedores), add:

```typescript
          <Link
            to="/contracts"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname.includes('/contracts')
                ? 'bg-surfaceHighlight text-primary'
                : 'text-textSec hover:bg-gray-50 hover:text-textMain'
            }`}
          >
            <FileText className="w-5 h-5" />
            Contratos
          </Link>
```

**Step 3: Verify the UI compiles**

Run: `cd frontend && npm run build`
Expected: Build should succeed without errors

**Step 4: Commit**

```bash
git add frontend/src/components/Layout.tsx
git commit -m "feat: add Contratos link to sidebar navigation"
```

---

## Task 5: Add /contracts route to App.tsx

**Files:**
- Modify: `frontend/src/App.tsx:14-76`

**Step 1: Import Contracts component**

After line 14 (Suppliers import), add:

```typescript
import { Contracts } from './pages/Contracts'
```

**Step 2: Add /contracts route**

After line 76 (the closing Route tag for /suppliers), add:

```typescript
      <Route
        path="/contracts"
        element={
          <ProtectedRoute>
            <Contracts />
          </ProtectedRoute>
        }
      />
```

**Step 3: Verify the routing compiles**

Run: `cd frontend && npm run build`
Expected: Build should succeed without errors

**Step 4: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat: add /contracts route with ProtectedRoute wrapper"
```

---

## Task 6: Manual testing

**Files:**
- N/A (manual testing)

**Step 1: Start the development servers**

Run: `cd backend && npm run dev` in one terminal
Run: `cd frontend && npm run dev` in another terminal

**Step 2: Navigate to contracts page**

1. Open the application in browser
2. Log in if needed
3. Click "Contratos" in sidebar
4. Verify page loads with table

**Step 3: Test filtering**

1. Select a work from the "Filtrar por Obra" dropdown
2. Verify contracts are filtered correctly
3. Select a supplier from the "Filtrar por Fornecedor" dropdown
4. Verify contracts are filtered correctly
5. Clear filters and verify all contracts show again

**Step 4: Test row click navigation**

1. Click on any contract row
2. Verify it navigates to `/contracts/:id` (may show 404 if details page doesn't exist yet - that's expected)

**Step 5: Test loading and error states**

1. Stop the backend server
2. Refresh the contracts page
3. Verify error message appears with retry button
4. Start backend server again
5. Click "Tentar Novamente"
6. Verify contracts load

**Step 6: Test empty states**

1. Filter by a work/supplier combination that has no contracts
2. Verify "Nenhum contrato encontrado com os filtros selecionados." message appears

**Step 7: Document findings**

Create notes of any issues found or improvements needed

---

## Implementation Complete

All tasks from the design document have been implemented:
- ✅ ContractListItem type added
- ✅ Contracts API service created
- ✅ Contracts listing page built
- ✅ Sidebar navigation updated
- ✅ Route configured
- ✅ Manual testing checklist provided

The implementation follows existing patterns from Suppliers.tsx and integrates seamlessly with the current application architecture.
