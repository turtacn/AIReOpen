import { http, HttpResponse, delay } from 'msw';

export const chatHandlers = [
  http.post('/api/v1/chat/completions', async () => {
    // Randomly simulate cache hit (30% chance)
    const isCacheHit = Math.random() < 0.3;

    if (isCacheHit) {
      // Return instant response with special header
      return HttpResponse.json({
        choices: [
          {
            message: {
              content: "This response was retrieved from the semantic cache! It saved you tokens and time.",
              role: "assistant"
            }
          }
        ]
      }, {
        headers: {
          'x-aireopen-cache-hit': 'true'
        }
      });
    }

    // Simulate streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const text = "This is a streaming response from the AIReOpen Gateway. It simulates how an LLM generates text token by token. We can also use Markdown here.\n\n- Point 1\n- Point 2\n\n**Bold text** and *Italic*.";
        // Split by space or simple regex to simulate chunks
        const chunks = text.match(/.{1,5}/g) || [];

        for (const chunk of chunks) {
          const data = JSON.stringify({
            choices: [{ delta: { content: chunk } }]
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          await delay(100);
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  }),
];
