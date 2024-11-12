import React, { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { Settings as SettingsIcon, Save, Upload, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AppSettings } from '../types';
import { SmtpTester } from '../components/SmtpTester';

export function Settings() {
  const { settings, updateSettings } = useSettingsStore();
  const [formData, setFormData] = useState<AppSettings>({
    ...settings,
    smtp: {
      host: settings.smtp?.host || '',
      port: settings.smtp?.port || 587,
      secure: settings.smtp?.secure || false,
      username: settings.smtp?.username || '',
      password: settings.smtp?.password || '',
      fromEmail: settings.smtp?.fromEmail || '',
      fromName: settings.smtp?.fromName || '',
    },
  });
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('Configurações atualizadas com sucesso!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('smtp.')) {
      const smtpField = name.split('.')[1];
      setFormData({
        ...formData,
        smtp: {
          ...formData.smtp,
          [smtpField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'smtp.secure') {
      setFormData({
        ...formData,
        smtp: {
          ...formData.smtp,
          secure: checked,
        },
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logoUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-8 w-8 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Configurações do Sistema
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Configurações Gerais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Aplicativo
              </label>
              <input
                type="text"
                name="appName"
                value={formData.appName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Logo
              </label>
              <div className="mt-1 flex items-center space-x-4">
                {formData.logoUrl && (
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="h-12 w-12 object-contain"
                  />
                )}
                <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="h-5 w-5 mr-2" />
                  Carregar Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cor Primária
              </label>
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome da Empresa
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email de Contato
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Formato de Data
              </label>
              <select
                name="dateFormat"
                value={formData.dateFormat}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fuso Horário
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="Africa/Luanda">Angola (GMT+1)</option>
                <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                <option value="Europe/London">Londres (GMT+1)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SMTP Settings Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">
              Configurações de Email (SMTP)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Servidor SMTP
              </label>
              <input
                type="text"
                name="smtp.host"
                value={formData.smtp.host}
                onChange={handleChange}
                placeholder="smtp.exemplo.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Porta SMTP
              </label>
              <input
                type="number"
                name="smtp.port"
                value={formData.smtp.port}
                onChange={handleChange}
                placeholder="587"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Usuário SMTP
              </label>
              <input
                type="text"
                name="smtp.username"
                value={formData.smtp.username}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha SMTP
              </label>
              <div className="relative">
                <input
                  type={showSmtpPassword ? "text" : "password"}
                  name="smtp.password"
                  value={formData.smtp.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showSmtpPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email do Remetente
              </label>
              <input
                type="email"
                name="smtp.fromEmail"
                value={formData.smtp.fromEmail}
                onChange={handleChange}
                placeholder="noreply@empresa.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Remetente
              </label>
              <input
                type="text"
                name="smtp.fromName"
                value={formData.smtp.fromName}
                onChange={handleChange}
                placeholder="Sistema de Gestão de Projetos"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="smtp.secure"
                  checked={formData.smtp.secure}
                  onChange={handleCheckboxChange}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Usar conexão segura (SSL/TLS)
                </span>
              </label>
            </div>

            <div className="col-span-2">
              <SmtpTester smtpSettings={formData.smtp} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
}