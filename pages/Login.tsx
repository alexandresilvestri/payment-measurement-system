import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button, Input, Card } from '../components/UI';
import { Building, Briefcase } from 'lucide-react';

export const Login = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: 'DIRETOR' | 'OBRA') => {
    login(role);
    if (role === 'DIRETOR') navigate('/director');
    else navigate('/site');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgMain px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
            M
          </div>
          <h1 className="text-3xl font-bold text-textMain tracking-tight">MEDCHECK</h1>
          <p className="text-textSec mt-2">Sistema de Gestão de Medições</p>
        </div>

        <Card className="shadow-lg border-0">
          <div className="space-y-6">
            <div className="space-y-4">
              <Input 
                label="E-mail Corporativo" 
                placeholder="nome@empresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
                label="Senha" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-xs text-center text-textSec uppercase font-semibold tracking-wider">Simular Acesso como:</p>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleLogin('DIRETOR')} 
                  variant="primary"
                  className="w-full flex flex-col h-auto py-4 gap-2"
                >
                  <Briefcase className="w-6 h-6" />
                  <span>Diretoria</span>
                </Button>
                <Button 
                  onClick={() => handleLogin('OBRA')} 
                  variant="secondary"
                  className="w-full flex flex-col h-auto py-4 gap-2"
                >
                  <Building className="w-6 h-6" />
                  <span>Eng. Obra</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <p className="text-center text-xs text-textSec mt-8">
          &copy; 2024 MedCheck Systems. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
