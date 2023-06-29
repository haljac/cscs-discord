import 'dotenv/config';
import {
    InteractionType,
    InteractionResponseType,
    verifyKey,
} from 'discord-interactions';
import { getRandomEmoji } from './utils';

const CLIENT_KEY = process.env.PUBLIC_KEY as string;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
export const handler = async (event: any) => {
    const buf = Buffer.from(event.body, 'base64');

    const signature = event.headers['X-Signature-Ed25519'];
    const timestamp = event.headers['X-Signature-Timestamp'];
    console.log('headers from discord', signature, timestamp);

    const isValidRequest = verifyKey(buf, signature!, timestamp!, CLIENT_KEY);
    if (!isValidRequest) {
        console.log('request is invalid due to the verifyKey thingy not working');
        return {
            statusCode: 401,
            message: "Invalid discord request"
        };
    }

    const body = JSON.parse(Buffer.from(event.body, 'base64').toString())
    // Interaction type and data
    const { type, /*id, */ data } = body;

    console.log('type', type);

    if (type === InteractionType.PING) {
        return {
            statusCode: 200,
            type: InteractionResponseType.PONG
        };
    }

    /**
    * Handle slash command requests
    * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
    */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;

        // "test" command
        if (name === 'test') {
          // Send a message into the channel where command was triggered from
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              // Fetches a random emoji to send from a helper function
              content: 'hello world ' + getRandomEmoji(),
            },
          };
        } else {
            return {
                statusCode: 500
            }
        }
    } else {
        return {
            statusCode: 500
        }
    }
};

