import { ChatInputCommand, Command } from '@sapphire/framework';
import type StickfigurePost from '../lib/classes/StickfigurePost';
import { getRandomStickfigures } from '../lib/websiteMethods';

export class RandomStickfigureCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'randomstickfigure', description: 'Get a random stickfigure from the site.' });
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		interaction.reply({ content: `Retrieving random stickfigure...`, fetchReply: true });
		const randomStickfigures : Array<StickfigurePost> = await getRandomStickfigures(1);
		const randomStickfigure : StickfigurePost = randomStickfigures[0];
		const randomStickfigureEmbed = randomStickfigure.getVerboseEmbed();
		return interaction.editReply({ content: null, embeds: [randomStickfigureEmbed] });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description),
		{ idHints: ['1007587553462992907', '1007556347807666176']  });
	}
}
