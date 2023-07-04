import type Command from './command.js';
import Leetcode from './leetcode.js'

const commands = {
  'leetcode': Leetcode
}

export const route = async (name: keyof typeof commands/*, interaction: any*/): Promise<Command> => {
  const command = new commands[name]();
  await command.init() // interaction can be passed here for subcommands
  return command;
}
