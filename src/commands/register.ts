import 'dotenv/config';
import {InstallGlobalCommands } from '../utils.js';

// Simple test command
const LEETCODE_COMMAND = {
  name: 'leetcode',
  description: 'Fetch a random leetcode problem',
  type: 1,
};

const ALL_COMMANDS = [LEETCODE_COMMAND];

InstallGlobalCommands(process.env.APP_ID as string, ALL_COMMANDS);
