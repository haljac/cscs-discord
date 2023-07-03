import {
    InteractionType,
    InteractionResponseType,
    verifyKey
} from 'discord-interactions';
import { getRandomEmoji } from './utils.js';
import type { APIGatewayEvent } from 'aws-lambda';

interface APIGatewayDiscordEvent extends APIGatewayEvent {
  body: string;
  headers: {
    'x-signature-ed25519': string;
    'x-signature-timestamp': string;
  }
}

const CLIENT_KEY = process.env.PUBLIC_KEY as string;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
export const handler = async (event: APIGatewayDiscordEvent) => {
  const verified = verifyKey(
    event.body,
    event.headers['x-signature-ed25519'],
    event.headers['x-signature-timestamp'],
    CLIENT_KEY
  );

  if (!verified) {
    return {
      statusCode: 401,
      body: JSON.stringify('invalid request signature'),
    };
  }

  const body = JSON.parse(event.body);
  const { type, /*id,*/ data } = body;
  if (event) {
    switch (type) {
      case InteractionType.PING:
        // Return pongs for pings
        return {
          statusCode: 200,
          body: JSON.stringify({ "type": InteractionResponseType.PONG }),
        }
      case InteractionType.APPLICATION_COMMAND:
        // TODO: ApplicationCommandRouter
        if (data.name === 'test') {
          console.log('invoked test command');
          // Send a message into the channel where command was triggered from
          return {
            statusCode: 200,
            body: JSON.stringify({
              "type": InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              "data": { content: 'hello world ' + getRandomEmoji() }
            })
          };
        }

        if (data.name === 'foo') {
          console.log('invoking foo command');
          return JSON.stringify({  // Note the absence of statusCode
            "type": InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,  // This type stands for answer with invocation shown
            "data": { "content": "bar" }
          });
        }


        // no handlers for command
        console.log('returning 404')
        return {
          statusCode: 404
        }
    }
  } 

  console.log('returning 500')
  return {
    statusCode: 500
  }
};

