import {
    InteractionResponseType,
} from 'discord-interactions';
import fetch from 'node-fetch';
import { checkStatus } from '../errors.js';
import type { CommandOption } from './index.js';

const DISCORD_HOST = 'https://discord.com/';

interface InteractionResponse {
  type: InteractionResponseType;
  data: {
    tts?: boolean;
    content?: string;
    embeds?: any;
    allowedMentions?: "roles" | "users" | "everyone";
    flags?: number;
    components?: {
      type: number,
      components: string[]
    };
    attachments?: any;
  }
}

export default abstract class Command {
  callbackUrl: URL;
  _body: InteractionResponse;

  constructor(public name: string) {
    this.callbackUrl = new URL(DISCORD_HOST);
  }

  abstract init(options?: CommandOption[]): Promise<void>;

  async run(id: string, token: string) {
    this.callbackUrl.pathname = `/api/v10/interactions/${id}/${token}/callback`

    const response = await fetch(
      this.callbackUrl,
      { 
        method: 'POST',
        body: JSON.stringify(this._body),
        headers: {'Content-Type': 'application/json'}
      }
    );

    checkStatus(response);
  }

  set body(body: InteractionResponse) {
    this._body = body;
  }
}
