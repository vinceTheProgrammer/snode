require('dotenv').config();
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import './lib/utils/external/Sanitizer/initClean';
import '@kaname-png/plugin-statcord/register';
import Redis from 'ioredis';

let redis : Redis;
if (typeof(process.env.REDIS_URL) == 'string') {
	redis = new Redis(process.env.REDIS_URL, {
		username: process.env.REDIS_USER,
		password: process.env.REDIS_PASS,
		maxRetriesPerRequest: null
	});
} else {
	process.exit();
}

const client = new SapphireClient({
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: ['GUILD_MEMBERS'],
	tasks: { strategy: new ScheduledTaskRedisStrategy({ bull: { connection: redis } }) },
	statcord: { 
		key: process.env.STATCORD_KEY || '', // TODO: this is kind of a hack... look into a better way of doing this later
		autopost: true,
		debug: true
	}
});

client.login(process.env.BOT_TOKEN);

export default redis
