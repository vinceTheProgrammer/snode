import { ChatInputCommand, Command } from '@sapphire/framework';

export class LinkCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'link', description: 'Link your sticknodes.com account to your Discord account.' });
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		interaction.reply({ content: `linking...`, fetchReply: true });
		return interaction.editReply({ content: "yes"});
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}
}
