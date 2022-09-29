import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import redis from '../index';

export class resetRecentStickfiguresFlagTask extends ScheduledTask {
	public constructor(context: ScheduledTask.Context, options: ScheduledTask.Options) {
		super(context, {
			...options,
			cron: '0 5 * * *' // at 5am every day
		});
	}

	public async run() {
		try {
			this.container.logger.info('Resetting flag.');
			redis.setbit('flags:reset-recent-stickfigures', 0, 0);
			this.container.logger.info('Reset flag.');
		} catch(err) {
			this.container.logger.error(err);
		}
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
	interface ScheduledTasks {
		cron: never;
	}
}