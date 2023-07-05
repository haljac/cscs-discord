import type Command from './command.js';
import Leetcode from './leetcode.js'

const commands = {
  'leetcode': Leetcode
}

export interface CommandOption {
  name: string;
  type: number;
  value: string;
}

export const route = async (name: keyof typeof commands, options?: CommandOption[]): Promise<Command> => {
  const command = new commands[name]();
  await command.init(options) // interaction can be passed here for subcommands
  return command;
}
