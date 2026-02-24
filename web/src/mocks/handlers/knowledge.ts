import { http, HttpResponse } from 'msw';
import knowledgeData from '../data/knowledge.json';

export const knowledgeHandlers = [
  http.get('/api/v1/knowledge/docs', () => {
    return HttpResponse.json(knowledgeData);
  }),
];
