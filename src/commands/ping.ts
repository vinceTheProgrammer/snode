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
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), 
		{ idHints: ['1006155273578233866', '1006799683496190053'] });
	}
}

