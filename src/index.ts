require('dotenv').config();

import { LogLevel, SapphireClient } from '@sapphire/framework';

const client = new SapphireClient({
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: ['GUILD_MEMBERS']
});

client.login(process.env.BOT_TOKEN);
