import {
    InteractionResponseType,
} from 'discord-interactions';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { normalizeDynamoDBItem, getRandomEmoji } from '../utils.js'
import type { CommandOption } from './index.js';
import Command from './command.js'

const client = new DynamoDBClient({ region: 'us-east-1' });

export default class LeetCode extends Command {
  constructor() {
    super('leetcode');
    this.body = {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: '' }
    }
  }

  async init(options?: CommandOption[]) {
    const commandOptions = {
    ExpressionAttributeNames: {
        '#u': 'url',
        '#n': 'name',
        '#d': 'difficulty',
        '#p': 'pattern',
        '#i': 'id'
      },
      ExpressionAttributeValues: {
        ':s': { S: 'Medium' },
      },
      FilterExpression: '#d = :s',
      ProjectionExpression: '#i, #n, #d, #p, #u',
      TableName: 'cscs-problems',
    }

    if (options && options.length) {
      for (const option of options) {
        switch (option.name) {
          case 'difficulty':
            commandOptions.ExpressionAttributeValues[':s'] = { S: option.value };
            break;
          default:
            throw new Error(`invalid option '${option.name}' received`);
        }
      }
    }

    const command = new ScanCommand(commandOptions);

    const { Items } = await client.send(command);

    if (!Items || !Items.length) throw new Error('whoops! could not fetch problem');

    const randomIndex = Math.floor(Math.random() * Items.length);
    const item = normalizeDynamoDBItem(Items?.[randomIndex]);

    this.body = {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Here's your ${item?.difficulty} leetcode problem! ${item?.url} ${getRandomEmoji()}`,
      }
    }
  }
}
