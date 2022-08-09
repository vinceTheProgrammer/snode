import { Listener } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';

export class GuildMemberAddListener extends Listener {
	public run(member: GuildMember) {
		const { username, id } = member.user!;
		this.container.logger.info(`User, ${username}, just joined the server! (${id})`);
	}
}
