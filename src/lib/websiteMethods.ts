import { fetch, FetchResultTypes } from '@sapphire/fetch'
import { load } from 'cheerio';
import _ from 'lodash';
import StickfigurePost from "./classes/StickfigurePost";

export function getRandomStickfigures(_amount: number) : Promise<Array<StickfigurePost>> {
    return new Promise(async resolve => {
        let data = await fetch('http://sticknodes.com/stickfigures', FetchResultTypes.Text);
        let $ = load(data);

        let maxPageIndexString = $('.dots').next().text();
        maxPageIndexString = maxPageIndexString.replaceAll(',', '');
        const maxPageIndex = parseInt(maxPageIndexString);
        const pageIndex = _.random(1, maxPageIndex);

        const pageUrl = `http://sticknodes.com/stickfigures/?wpfb_list_page=${pageIndex}`;

        data = await fetch(pageUrl, FetchResultTypes.Text);
        $ = load(data);

        const stickfigurePostUrls : Array<string> = [];

        $( ".wpfilebase-list-default ul").children('li').each((_i, el) => {
            if($(el).html()?.startsWith('<span class="star rating')) {
                return;
            } else {
                const stickfigurePostUrl : string = $(el).find('.item-comments a').attr('href') || "http://sticknodes.com/sticks/question-mark-remasted-nodes/";
                stickfigurePostUrls.push(stickfigurePostUrl);
            }
        });

        const url : string = _.sample(stickfigurePostUrls) || 'http://sticknodes.com/sticks/question-mark-remasted-nodes/';

        const stickfigure = new StickfigurePost(url);
        await stickfigure.resolveStickfigurePostInfo();
        resolve([stickfigure]);
    })
}