import { http, HttpResponse } from 'msw';
import channelsData from '../data/channels.json';

export const channelsHandlers = [
  http.get('/api/v1/channels', () => {
    return HttpResponse.json(channelsData);
  }),
];
