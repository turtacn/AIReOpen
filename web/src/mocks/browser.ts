import { setupWorker } from 'msw/browser';
import { dashboardHandlers } from './handlers/dashboard';
import { channelsHandlers } from './handlers/channels';
import { auditHandlers } from './handlers/audit';
import { knowledgeHandlers } from './handlers/knowledge';
import { chatHandlers } from './handlers/chat';

export const worker = setupWorker(
  ...dashboardHandlers,
  ...channelsHandlers,
  ...auditHandlers,
  ...knowledgeHandlers,
  ...chatHandlers
);
