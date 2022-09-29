import { MessageEmbed } from "discord.js";
import { fetch, FetchResultTypes } from '@sapphire/fetch'
import { load } from 'cheerio';
import { getAverageColor } from 'fast-average-color-node';
import type { ColorResolvable } from 'discord.js';

class StickfigurePost {
    title: string = '';
    author: string = '';
    authorNickname: string = '';
    url: string;
    tags: Array<string> = [''];
    category: string = '';
    thumbnailUrl: string = '';
    iconUrl: string = '';
    downloadUrl: string = '';
    authorUrl: string = '';
    color: ColorResolvable = 5198940;
    uploadDate: Date = new Date(0);
    description: string = '';
    
    constructor(url: string) {
        this.url = url;
    }

    resolveStickfigurePostInfo() : Promise<StickfigurePost> {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await fetch(this.url, FetchResultTypes.Text);
                const $ = load(data);
                this.title = $('.entry-title').text();
                this.author = $('.mention-name').text() || $('.member-since').children('p').text();
                this.authorNickname = $('.author-name').children('a').text() || $('.author-name').text();
                this.authorUrl = $('.author-name').children('a').attr('href') || 'http://sticknodes.com';
                this.description = $('.description-box').text();
                //this.tags;
                //this.category;
                this.thumbnailUrl = $('.pic').find('a').find('img').attr('src') || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png';
                this.iconUrl = $('.author-box').children('.profile-pic').attr('src') || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png';
                this.downloadUrl = $('.download-button').attr('href') || this.url;
                let hexColor : string = await getAverageColor(this.thumbnailUrl).then(facColor => {
                    return facColor.hex;
                });
                this.color = parseInt(hexColor.slice(1), 16);
                const unparsedDate: string = $('.file-meta-box').find('.title').filter((_i, el) => {
                    return $(el).text() === 'Date:';
                }).first().parent().text();
                this.uploadDate = new Date(Date.parse(unparsedDate));
                resolve(this);
            } catch(err) {
                reject(err);
            }
        });
    }

    getPreviewEmbed() : MessageEmbed {
        const embed = new MessageEmbed()
            .setTitle(this.title)
            .setAuthor({ name: this.authorNickname, iconURL: this.iconUrl, url: this.authorUrl })
            .setImage(this.thumbnailUrl)
            .setURL(this.url)
            .setFooter({ text: this.author })
            .setDescription(`[Download](${this.downloadUrl})`)
            .setColor(this.color);
        return embed;
    }

    getVerboseEmbed() : MessageEmbed {
        const embed = new MessageEmbed()
            .setTitle(this.title)
            .setAuthor({ name: this.authorNickname, iconURL: this.iconUrl, url: this.authorUrl })
            .setImage(this.thumbnailUrl)
            .setURL(this.url)
            .setFooter({ text: this.author })
            .setDescription(`[Download](${this.downloadUrl})`)
            .setColor(this.color)
            .setTimestamp(this.uploadDate)
            .setDescription(this.description)
        return embed;
    }
}

export default StickfigurePost