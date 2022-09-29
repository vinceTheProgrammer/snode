// Copyright 2022 Favware


// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at


//     http://www.apache.org/licenses/LICENSE-2.0


// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Modified from original slightly: (https://github.com/favware/dragonite/blob/489afb1decfad9564e2cfe282baa3002447e95c7/src/commands/Admin/eval.ts)

import { ChatInputCommand, Command } from '@sapphire/framework';
import { ADMINGUILDS } from '../../../config';
import { Time } from '@sapphire/time-utilities';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v9';
import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';
import { compressEvalCustomIdMetadata } from '../../lib/utils/external/evalCustomIdCompression';
import { ModalCustomIds } from '../../lib/constants';

export class EvalCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, 
            name: 'eval', 
            description: 'Evaluates any JavaScript code. Can only be used by the bot owner.', 
            preconditions: ['OwnerOnly'] });
	}

    readonly #timeout = Time.Minute;

    readonly #languageChoices: APIApplicationCommandOptionChoice<string>[] = [
        { name: 'JavaScript', value: 'js' },
        { name: 'TypeScript', value: 'ts' },
        { name: 'JSON', value: 'json' },
        { name: 'Raw text', value: 'txt' }
      ];
    
      readonly #outputChoices: APIApplicationCommandOptionChoice<string>[] = [
        { name: 'Reply', value: 'reply' },
        { name: 'File', value: 'file' },
        { name: 'Hastebin', value: 'hastebin' },
        { name: 'Console', value: 'console' },
        { name: 'Abort', value: 'none' }
      ];

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		const depth = interaction.options.getInteger('depth') ?? 0;
        const language = interaction.options.getString('language') ?? 'ts';
        const outputTo = interaction.options.getString('output-to') ?? 'reply';
        const async = interaction.options.getBoolean('async') ?? false;
        const noTimeout = interaction.options.getBoolean('no-timeout') ?? false;
        const silent = interaction.options.getBoolean('silent') ?? false;
        const showHidden = interaction.options.getBoolean('show-hidden') ?? false;

        const timeout = noTimeout ? Time.Minute * 10 : this.#timeout;

        const metadata = compressEvalCustomIdMetadata({
            depth,
            async,
            language,
            outputTo,
            silent,
            showHidden,
            timeout
        });

        const customIdStringified = `${ModalCustomIds.EVAL}|${metadata}`;

        const modal = new Modal() //
        .setCustomId(customIdStringified)
        .setTitle('Code to evaluate')
        .setComponents(
            new MessageActionRow<ModalActionRowComponent>().addComponents(
            new TextInputComponent() //
                .setCustomId('code-input')
                .setLabel("What's the code to evaluate")
                .setStyle('PARAGRAPH')
            )
        );

        await interaction.showModal(modal);
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
            (builder) =>
              builder //
                .setName(this.name)
                .setDescription(this.description)
                .setDefaultMemberPermissions(0)
                .addIntegerOption((option) =>
                  option //
                    .setName('depth')
                    .setDescription('The inspection depth to apply.')
                )
                .addStringOption((builder) =>
                  builder //
                    .setName('language')
                    .setDescription('The language of the output codeblock.')
                    .setChoices(...this.#languageChoices)
                )
                .addStringOption((builder) =>
                  builder //
                    .setName('output-to')
                    .setDescription('The location to send the output to.')
                    .setChoices(...this.#outputChoices)
                )
                .addBooleanOption((builder) =>
                  builder //
                    .setName('async')
                    .setDescription('Whether this code should be evaluated asynchronously.')
                )
                .addBooleanOption((builder) =>
                  builder //
                    .setName('no-timeout')
                    .setDescription('Whether there should be no timeout for evaluating this code.')
                )
                .addBooleanOption((builder) =>
                  builder //
                    .setName('silent')
                    .setDescription('Whether the bot should not give a reply on the evaluation.')
                )
                .addBooleanOption((builder) =>
                  builder //
                    .setName('show-hidden')
                    .setDescription('Whether to show hidden JSON properties when stringifying.')
                ),
            { guildIds: ADMINGUILDS }
          );
	}
}
