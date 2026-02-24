import { http, HttpResponse } from 'msw';
import auditData from '../data/audit.json';

export const auditHandlers = [
  http.get('/api/v1/audit/logs', () => {
    return HttpResponse.json(auditData);
  }),
];
