import {
    InteractionResponseType,
} from 'discord-interactions';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { getRandomEmoji } from '../utils.js'

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

  async init() {
    const command = new ScanCommand({
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
    });

    const { Items } = await client.send(command);

    console.log(Items![0]);

    if (Items) {
      this.body = {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Here's your ${Items[0]?.difficulty} leetcode problem! ${Items[0]?.url} ${getRandomEmoji()}`,
        }
      }
    } else {
      throw new Error('whoops! could not fetch problem');
    }
  }
}
