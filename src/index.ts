import {
  InteractionType,
  InteractionResponseType,
  verifyKey,
} from 'discord-interactions';
import { route } from './commands/index.js';
import type { Handler, APIGatewayEvent } from 'aws-lambda';

interface APIGatewayDiscordEvent extends APIGatewayEvent {
  body: string;
  headers: {
    'x-signature-ed25519': string;
    'x-signature-timestamp': string;
  };
}

const CLIENT_KEY = process.env.PUBLIC_KEY as string;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
export const handler: Handler = async (event: APIGatewayDiscordEvent) => {
  const verified = verifyKey(
    event.body,
    event.headers['x-signature-ed25519'],
    event.headers['x-signature-timestamp'],
    CLIENT_KEY,
  );

  if (!verified) {
    return {
      statusCode: 401,
      body: JSON.stringify('invalid request signature'),
    };
  }

  const body = JSON.parse(event.body);
  const { type, id, token, data } = body;
  if (event) {
    let command;
    switch (type) {
      case InteractionType.PING:
        // Return pongs for pings
        return {
          statusCode: 200,
          body: JSON.stringify({ type: InteractionResponseType.PONG }),
        };
      case InteractionType.APPLICATION_COMMAND:
        command = await route(data.name, data.options);

        if (command) {
          await command.run(id, token);

          return {
            statusCode: 200,
          };
        } else {
          // no handlers
          return {
            statusCode: 404,
          };
        }
    }
  }

  return {
    statusCode: 500,
  };
};
