import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Measurement, Contract, ConstructionSite, Supplier, EnrichedMeasurement } from '../types';
import { USERS, MOCK_MEASUREMENTS, CONTRACTS, SITES, SUPPLIERS } from '../constants';

interface AppContextType {
  currentUser: User | null;
  login: (role: 'DIRETOR' | 'OBRA') => void;
  logout: () => void;
  measurements: Measurement[];
  addMeasurement: (measurement: Measurement) => void;
  updateMeasurementStatus: (id: string, status: Measurement['status'], observation?: string) => void;
  contracts: Contract[];
  addContract: (contract: Contract) => void;
  sites: ConstructionSite[];
  addSite: (site: ConstructionSite) => void;
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  getEnrichedMeasurements: () => EnrichedMeasurement[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>(MOCK_MEASUREMENTS);
  const [contracts, setContracts] = useState<Contract[]>(CONTRACTS);
  
  // Now using state for Sites and Suppliers to allow adding new ones
  const [sites, setSites] = useState<ConstructionSite[]>(SITES);
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);

  const login = (role: 'DIRETOR' | 'OBRA') => {
    // Simulate login by finding the first user with that role
    const user = USERS.find(u => u.role === role);
    if (user) setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const addMeasurement = (measurement: Measurement) => {
    setMeasurements(prev => [measurement, ...prev]);
  };

  const addContract = (contract: Contract) => {
    setContracts(prev => [...prev, contract]);
  };

  const addSite = (site: ConstructionSite) => {
    setSites(prev => [...prev, site]);
    // Optionally auto-link current user to this site if they are OBRA profile
    // But for this prototype we assume Director creates sites.
  };

  const addSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [...prev, supplier]);
  };

  const updateMeasurementStatus = (id: string, status: Measurement['status'], observation?: string) => {
    setMeasurements(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status,
          directorObservation: observation !== undefined ? observation : m.directorObservation
        };
      }
      return m;
    }));
  };

  const getEnrichedMeasurements = (): EnrichedMeasurement[] => {
    return measurements.map(m => {
      const contract = contracts.find(c => c.id === m.contractId)!;
      const site = sites.find(s => s.id === contract.constructionSiteId)!;
      const supplier = suppliers.find(sup => sup.id === contract.supplierId)!;
      const creator = USERS.find(u => u.id === m.createdByUserId);
      return {
        ...m,
        contract,
        site,
        supplier,
        creatorName: creator ? creator.name : 'Desconhecido'
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      measurements,
      addMeasurement,
      updateMeasurementStatus,
      contracts,
      addContract,
      sites,
      addSite,
      suppliers,
      addSupplier,
      getEnrichedMeasurements
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};