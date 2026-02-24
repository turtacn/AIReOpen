import { useState, useCallback } from 'react';

export function useChatStream() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamChat = useCallback(async (
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: (fullContent: string, isCacheHit: boolean) => void
  ) => {
    setLoading(true);
    setError(null);

    let fullContent = '';
    let isCacheHit = false;

    try {
      const response = await fetch('/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // Handle instant JSON response (Cache Hit)
        const data = await response.json();
        const content = data.choices[0].message.content;
        onChunk(content);
        isCacheHit = response.headers.get('x-aireopen-cache-hit') === 'true';
        onComplete(content, isCacheHit);
        setLoading(false);
        return;
      }

      // Handle stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader available');

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              done = true;
              break;
            }
            try {
              const data = JSON.parse(dataStr);
              const delta = data.choices[0].delta?.content || '';
              fullContent += delta;
              onChunk(delta);
            } catch (e) {
              console.warn('Error parsing JSON chunk', e);
            }
          }
        }
      }
      onComplete(fullContent, isCacheHit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { streamChat, loading, error };
}
