import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import {
  User,
  Measurement,
  Contract,
  ConstructionSite,
  Supplier,
  EnrichedMeasurement,
} from '../types'
import {
  USERS,
  MOCK_MEASUREMENTS,
  CONTRACTS,
  WORKS,
  SUPPLIERS,
} from '../constants'
import { useAuth } from './AuthContext'
import { convertAuthUserToUser } from '../utils/authAdapter'

interface AppContextType {
  currentUser: User | null
  measurements: Measurement[]
  addMeasurement: (measurement: Measurement) => void
  updateMeasurementStatus: (
    id: string,
    status: Measurement['status'],
    observation?: string
  ) => void
  contracts: Contract[]
  addContract: (contract: Contract) => void
  works: ConstructionSite[]
  addWork: (work: ConstructionSite) => void
  suppliers: Supplier[]
  addSupplier: (supplier: Supplier) => void
  getEnrichedMeasurements: () => EnrichedMeasurement[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const { user: authUser } = useAuth()

  const currentUser = useMemo(() => {
    return authUser ? convertAuthUserToUser(authUser) : null
  }, [authUser])

  const [measurements, setMeasurements] =
    useState<Measurement[]>(MOCK_MEASUREMENTS)
  const [contracts, setContracts] = useState<Contract[]>(CONTRACTS)

  const [works, setWorks] = useState<ConstructionSite[]>(WORKS)
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS)

  const addMeasurement = (measurement: Measurement) => {
    setMeasurements((prev) => [measurement, ...prev])
  }

  const addContract = (contract: Contract) => {
    setContracts((prev) => [...prev, contract])
  }

  const addWork = (work: ConstructionSite) => {
    setWorks((prev) => [...prev, work])
  }

  const addSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => [...prev, supplier])
  }

  const updateMeasurementStatus = (
    id: string,
    status: Measurement['status'],
    observation?: string
  ) => {
    setMeasurements((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status,
            directorObservation:
              observation !== undefined ? observation : m.directorObservation,
          }
        }
        return m
      })
    )
  }

  const getEnrichedMeasurements = (): EnrichedMeasurement[] => {
    return measurements
      .map((m) => {
        const contract = contracts.find((c) => c.id === m.contractId)!
        const work = works.find((s) => s.id === contract.constructionSiteId)!
        const supplier = suppliers.find(
          (sup) => sup.id === contract.supplierId
        )!
        const creator = USERS.find((u) => u.id === m.createdByUserId)
        return {
          ...m,
          contract,
          site: work,
          supplier,
          creatorName: creator ? creator.name : 'Desconhecido',
        }
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        measurements,
        addMeasurement,
        updateMeasurementStatus,
        contracts,
        addContract,
        works,
        addWork,
        suppliers,
        addSupplier,
        getEnrichedMeasurements,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
