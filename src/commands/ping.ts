// Copyright 2022 Favware


// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at


// 	http://www.apache.org/licenses/LICENSE-2.0


// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Command, type ChatInputCommand } from '@sapphire/framework';
import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIMessage } from 'discord-api-types/v9';
import type { CommandInteraction, Message } from 'discord.js';

export class PingCommand extends Command {

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'ping', description: 'Ping bot to see if it is alive' });
	}

	public async chatInputRun(interaction: ChatInputCommand.Interaction) {
		const msg = await interaction.reply({ content: `Ping?`, ephemeral: true, fetchReply: true });

		const { diff, ping } = this.getPing(msg, interaction);

		return interaction.editReply(`Pong 🏓! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
	}

	private getPing(message: APIMessage | Message, interaction: CommandInteraction) {
		const msgTimestamp = DiscordSnowflake.timestampFrom(message.id);
		const diff = msgTimestamp - interaction.createdTimestamp;
		const ping = Math.round(this.container.client.ws.ping);
		return { diff, ping };
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}
}

