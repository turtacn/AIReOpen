import { http, HttpResponse } from 'msw';
import dashboardData from '../data/dashboard.json';

export const dashboardHandlers = [
  http.get('/api/v1/dashboard/stats', () => {
    return HttpResponse.json(dashboardData);
  }),
];
