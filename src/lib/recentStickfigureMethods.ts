import { fetch, FetchResultTypes } from '@sapphire/fetch'
import type { SapphireClient } from '@sapphire/framework';
import { load } from 'cheerio';
import { AnyChannel, MessageEmbed } from 'discord.js';
import _ from 'lodash'
import redis from '../index';
import StickfigurePost from './classes/StickfigurePost'
import { isCurrentTimeWithinRange, sendRateLimitedMessageEmbeds } from './utils'
import { recentlyAddedChannelID } from './config'

export function getRecentStickfigurePostUrls() : Promise<Array<string>> { 
    return new Promise(async (resolve, reject) => {
        try {
            const stickfigurePostUrls : Array<string> = [];
            const data = await fetch('http://sticknodes.com/stickfigures', FetchResultTypes.Text);
            const $ = load(data);
            $( ".wpfilebase-list-default ul").children('li').each((_i, el) => {
                    if($(el).html()?.startsWith('<span class="star rating')) {
                        return;
                    } else {
                        const stickfigurePostUrl = $(el).find('.item-comments a').attr('href') || "http://sticknodes.com/sticks/question-mark-remasted-nodes/";
                        stickfigurePostUrls.push(stickfigurePostUrl);
                    }
            });
            resolve(stickfigurePostUrls)
        } catch(err) {
            reject(err);
        }
    });
}

export function filterSentStickfigurePostUrls(stickfigurePostUrls: Array<string>) : Promise<Array<string>> { 
    return new Promise(async (resolve, reject) => {
        try {
            let recentStickfigurePostUrls = await redis.lrange('stickfigure-post-urls:recent', 0, -1);
            recentStickfigurePostUrls = _.difference(stickfigurePostUrls, recentStickfigurePostUrls).reverse();
            recentStickfigurePostUrls.forEach(post => {
                redis.lpush('stickfigure-post-urls:recent', post);
                redis.ltrim('stickfigure-post-urls:recent', 0, 30);
            });
            resolve(recentStickfigurePostUrls);
        } catch(err) {
            reject(err);
        }
    });
}

export function sendStickFigurePosts(stickfigurePostUrls: Array<string>, client : SapphireClient) : Promise<number> { 
    return new Promise(async (resolve, reject) => {
        let textChannel : AnyChannel | undefined = await client.channels.fetch(recentlyAddedChannelID) || undefined
        if (textChannel == undefined || textChannel.type !== 'GUILD_TEXT') {
            reject('Channel set in config as recently-added-figures channel is not a TextChannel.');
            return
        }
        try {
            const messageEmbeds : Array<MessageEmbed> = [];
        ;
        for (const post of stickfigurePostUrls) {
            let stickfigurePost: StickfigurePost = new StickfigurePost(post);
            stickfigurePost = await stickfigurePost.resolveStickfigurePostInfo();
            messageEmbeds.push(stickfigurePost.getPreviewEmbed())
        };
        if (isCurrentTimeWithinRange(new Date('20 Apr 2020 04:30:00'), 0, 35)) {
            console.log('Within time range.');
            const alreadyReset = await redis.getbit('flags:reset-recent-stickfigures', 0);
            if (!alreadyReset) {
                console.log('Resetting stickfigures.')
                resetRecentStickfigures(client);
            } else {
                console.log('Not resetting Stickfigures.')
            }
        } else {
            console.log('Not within time range.')
        }
        sendRateLimitedMessageEmbeds(messageEmbeds, textChannel);
        resolve(stickfigurePostUrls.length);
        } catch(err) {
            reject(err);
        }
    })
}

export async function resetRecentStickfigures(client: SapphireClient) {
    let textChannel : AnyChannel | undefined = await client.channels.fetch(recentlyAddedChannelID) || undefined
    if (textChannel == undefined || textChannel.type !== 'GUILD_TEXT') return;
    const recentlyAddedStickfiguresEmbed = new MessageEmbed()
        .setColor(38655)
        .setTitle('Recently Added Stickfigures');
    await textChannel.bulkDelete(100,true);
    textChannel.send({ embeds: [recentlyAddedStickfiguresEmbed] });
    redis.setbit('flags:reset-recent-stickfigures', 0, 1);
}