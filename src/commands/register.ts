import 'dotenv/config';
import { InstallGlobalCommands } from '../utils.js';

// Simple test command
const LEETCODE_COMMAND = {
  name: 'leetcode',
  description: 'Fetch a random leetcode problem',
  type: 1,
  options: [
    {
      name: 'difficulty',
      description: 'The difficulty of the problem',
      type: 3,
      required: true,
      choices: [
        {
          name: 'Easy',
          value: 'Easy',
        },
        {
          name: 'Medium',
          value: 'Medium',
        },
        {
          name: 'Hard',
          value: 'Hard',
        },
      ],
    },
  ],
};

const ALL_COMMANDS = [LEETCODE_COMMAND];

InstallGlobalCommands(process.env.APP_ID as string, ALL_COMMANDS);
