import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { getRecentStickfigurePostUrls, filterSentStickfigurePostUrls, sendStickFigurePosts } from '../lib/recentStickfigureMethods';

export class recentStickfiguresTask extends ScheduledTask {
	public constructor(context: ScheduledTask.Context, options: ScheduledTask.Options) {
		super(context, {
			...options,
			interval: 1_800_000 // 30 minutes
		});
	}

	public async run() {
		this.container.logger.info('Checking for new figures.');
        try {
            let stickfigurePostUrls : Array<string> = await getRecentStickfigurePostUrls();
            stickfigurePostUrls = await filterSentStickfigurePostUrls(stickfigurePostUrls);
            const newStickfigureCount = await sendStickFigurePosts(stickfigurePostUrls, this.container.client);
			this.container.logger.info(`${newStickfigureCount} new stickfigures found.`);
        } catch(err) {
            this.container.logger.error(err);
        }
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
	interface ScheduledTasks {
		interval: never;
	}
}