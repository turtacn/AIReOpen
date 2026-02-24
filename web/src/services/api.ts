import { apiClient } from './adapter';

export interface DashboardStats {
  totalTokensConsumed: number;
  totalTokensSaved: number;
  cacheHitRate: number;
  activeChannels: number;
  costSavedUSD: number;
}

export interface Channel {
  id: string;
  name: string;
  provider: string;
  status: 'active' | 'dead' | 'testing';
  weight: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  originalPrompt: string;
  maskedPrompt: string;
  riskLevel: 'low' | 'medium' | 'high';
  actionTaken: 'masked' | 'blocked' | 'allowed';
}

export interface KnowledgeDoc {
  id: string;
  filename: string;
  status: 'embedding' | 'ready' | 'failed';
  vectors: number;
}

export const fetchDashboardStats = async () => {
  const response = await apiClient.get<DashboardStats>('/dashboard/stats');
  return response.data;
};

export const fetchChannels = async () => {
  const response = await apiClient.get<Channel[]>('/channels');
  return response.data;
};

export const fetchAuditLogs = async () => {
  const response = await apiClient.get<AuditLog[]>('/audit/logs');
  return response.data;
};

export const fetchKnowledgeDocs = async () => {
  const response = await apiClient.get<KnowledgeDoc[]>('/knowledge/docs');
  return response.data;
};

export const sendChatCompletion = async (message: string) => {
  const response = await apiClient.post('/chat/completions', {
    messages: [{ role: 'user', content: message }]
  });
  return response.data;
};
