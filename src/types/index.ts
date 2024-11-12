export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  active: boolean;
  createdAt: string;
}

export type ProjectStatus = 'pending' | 'proposal_sent' | 'proposal_accepted' | 'approved' | 'completed' | 'on_hold';

export interface ProjectImage {
  id: string;
  url: string;
  createdAt: Date;
}

export type DocumentType = 'proposta_comercial' | 'po' | 'guia_entrega' | 'fatura' | 'recibo' | 'certificacao';

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  type: DocumentType;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  client_id: string;
  description: string;
  status: ProjectStatus;
  responsavel: string;
  departamento: string;
  notes: string;
  photos_before: ProjectImage[];
  photos_after: ProjectImage[];
  documents: ProjectDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface AppSettings {
  appName: string;
  logoUrl: string;
  primaryColor: string;
  companyName: string;
  contactEmail: string;
  dateFormat: string;
  timezone: string;
  smtp: SmtpSettings;
}