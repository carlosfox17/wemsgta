import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { SmtpSettings } from '../types';
import { testSmtpConnection } from '../utils/emailService';
import { toast } from 'react-hot-toast';

interface SmtpTesterProps {
  smtpSettings: SmtpSettings;
}

export function SmtpTester({ smtpSettings }: SmtpTesterProps) {
  const [testingSmtp, setTestingSmtp] = useState(false);

  const handleTestSmtp = async () => {
    if (!smtpSettings) {
      toast.error('Configurações SMTP não encontradas');
      return;
    }

    const { host, username, password, fromEmail } = smtpSettings;
    
    if (!host || !username || !password || !fromEmail) {
      toast.error('Por favor, preencha todos os campos SMTP obrigatórios antes de testar');
      return;
    }

    setTestingSmtp(true);
    
    try {
      const result = await testSmtpConnection(smtpSettings);
      
      if (result.success) {
        toast.success('Conexão SMTP testada com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao testar conexão SMTP');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao testar SMTP:', errorMessage);
      toast.error(`Falha ao testar SMTP: ${errorMessage}`);
    } finally {
      setTestingSmtp(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleTestSmtp}
        disabled={testingSmtp}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4 mr-2" />
        {testingSmtp ? 'Testando conexão...' : 'Testar Conexão SMTP'}
      </button>
      <p className="mt-2 text-sm text-gray-500">
        Clique para validar as configurações SMTP antes de salvar.
      </p>
    </div>
  );
}