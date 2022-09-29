import { Command, type ChatInputCommand } from '@sapphire/framework';
import _ from 'lodash';
import { fetch, FetchResultTypes } from '@sapphire/fetch'
import { Stopwatch } from '@sapphire/stopwatch';
import { bufferToDiscordAttachment, convertBuffer, getTargetExt } from '../lib/utils/utils';

export class ConvertCommand extends Command {

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'convert', description: 'Convert SN related file-types.' });
	}

	public async chatInputRun(interaction: ChatInputCommand.Interaction) {
        let ephemeral = interaction.options.getBoolean('ephemeral');
        if (ephemeral == null) ephemeral = false;
		await interaction.deferReply({ephemeral: ephemeral});

        let attachment = interaction.options.getAttachment('file');
        if (attachment == null) return interaction.editReply({content: `The attachment provided is null.`});

        const extArray = attachment.name?.split('.');
        let ext = _.last(extArray);
        const filename = _.first(extArray)?.toLowerCase();
        let targetExt = getTargetExt(ext);

        interaction.editReply({ content: `Converting ${attachment.size} bytes of ${ext?.toUpperCase()} data to ${targetExt.toUpperCase}...`})

        const stopwatch = new Stopwatch();

        try {
            const buffer = await fetch(attachment.attachment.toString(), FetchResultTypes.Buffer);

            const convertedBuffer = await convertBuffer(buffer, ext);

            if (convertedBuffer === buffer) targetExt = ext != undefined ? ext : ".lolthisisanerror";

            attachment = await bufferToDiscordAttachment(convertedBuffer, filename, targetExt);

            console.log(buffer);
        } catch(err) {
            return interaction.editReply({content: `There was an error with converting your file. Error message: ${err}`});
        }

        const elapsedTime = stopwatch.stop().toString();

		return interaction.editReply({content: `Done in ${elapsedTime}.`, files: [attachment]});
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description)
        .addAttachmentOption((option) => 
            option //
            .setName('file')
            .setDescription('The .json or .nodes file to convert.')
            .setRequired(true)
        )
        .addBooleanOption((option) =>
            option //
            .setName('ephemeral')
            .setDescription('Set this to true to keep output private and temporary.')
        ),
        {idHints: ['1012817353215574187']});
	}
}

