import { OWNERS } from '../../config';
import { AllFlowsPrecondition } from '@sapphire/framework';
import type { Snowflake } from 'discord-api-types/v9';
import type { CommandInteraction, ContextMenuInteraction, Message } from 'discord.js';

export class UserPrecondition extends AllFlowsPrecondition {
  #message = 'This command can only be used by the owner.';

  public override chatInputRun(interaction: CommandInteraction) {
    return this.doOwnerCheck(interaction.user.id);
  }

  public override contextMenuRun(interaction: ContextMenuInteraction) {
    return this.doOwnerCheck(interaction.user.id);
  }

  public override messageRun(message: Message) {
    return this.doOwnerCheck(message.author.id);
  }

  private doOwnerCheck(userId: Snowflake) {
    return OWNERS.includes(userId) ? this.ok() : this.error({ message: this.#message });
  }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
	}
}