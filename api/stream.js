// api/stream.js
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

export const config = {
  runtime: 'edge'
}

export default async function handler(request) {
  try {
    let gameState = await redis.get('gameState')

    if (!gameState) {
      gameState = {
        sprites: [
            {
                id: 'truman',
                x: 500,
                y: 500,
                type: 'TrumanSprite',
                isUnaware: true,
                thoughts: [],
                memories: []
            },
            {
                id: 'sarah',
                x: 450,
                y: 450,
                type: 'NPCSprite',
                thoughts: [],
                memories: []
            },
            {
                id: 'michael',
                x: 550,
                y: 550,
                type: 'NPCSprite',
                thoughts: [],
                memories: []
            },
            {
                id: 'emma',
                x: 400,
                y: 500,
                type: 'NPCSprite',
                thoughts: [],
                memories: []
            },
            {
                id: 'james',
                x: 600,
                y: 400,
                type: 'NPCSprite',
                thoughts: [],
                memories: []
            },
            {
                id: 'olivia',
                x: 500,
                y: 600,
                type: 'NPCSprite',
                thoughts: [],
                memories: []
            },
            {
                id: 'william',
                x: 350,
                y: 350,
                type: 'NPCSprite',
                thoughts: [],
                memories: []
            },
            {
                id: 'sophia',
                x: 650,
                y: 650,
                type: 'NPCSprite',
                thoughts: [],
                memories: []
            }
        ],
        time: Date.now(),
        thoughts: [],
        currentEvent: null,
        votes: {},
        activeVoting: false
    };

      // Save initial state if none exists
      await redis.set('gameState', gameState)
    }

    // Add debug logging
    console.log('Current game state:', {
      spriteCount: gameState.sprites?.length,
      spritePositions: gameState.sprites?.map(s => ({id: s.id, x: s.x, y: s.y}))
    });

    // Format the response as an SSE message
    const message = `data: ${JSON.stringify(gameState)}\n\n`;

    return new Response(message, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Stream error:', error);
    return new Response(`data: ${JSON.stringify({ error: error.message })}\n\n`, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}
