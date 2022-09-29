import { BufferResolvable, MessageAttachment, MessageEmbed, TextChannel } from "discord.js";
import type { Stream } from "stream";
import { jsonToNodes, nodesToJson } from "./conversions/file_conversions";

export async function sendRateLimitedMessageEmbeds(messageEmbeds: Array<MessageEmbed>, textChannel: TextChannel) {
    for (const messageEmbed of messageEmbeds) {
        await sendEmbed(messageEmbed, textChannel);
    }
}

function sendEmbed(messageEmbed: MessageEmbed, textChannel: TextChannel): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                textChannel.send({ embeds: [messageEmbed] })
                resolve();
            }, 10000);
        } catch(err) {
            reject(err);
        }
    })
}

export function isCurrentTimeWithinRange(dateObject: Date, hourRange: number, minuteRange: number) {
    // create Date Object from input string:
    const inputHours = dateObject.getHours()
    const inputMinutes = dateObject.getMinutes()

    // get current time
    const nowHours = new Date(Date.now()).getHours()
    const nowMinutes = new Date(Date.now()).getMinutes()

    // calculate min && max
    const minHours = inputHours - hourRange
    const maxHours = inputHours + hourRange

    // calculate min && max
    const minMinutes = inputMinutes - minuteRange
    const maxMinutes = inputMinutes + minuteRange

    // check condition
    return nowHours <= maxHours && nowHours >= minHours && nowMinutes <= maxMinutes && maxMinutes >= minMinutes;
}

export function bufferToDiscordAttachment(convertedBuffer: BufferResolvable | Stream, filename: string = 'file', ext: string = 'extension') : MessageAttachment {
    let attachment = new MessageAttachment(convertedBuffer);
    attachment.setName(`${filename}.${ext}`)
    return attachment;
}

export function convertBuffer(buffer: Buffer, ext: string | undefined) : Promise<Buffer> {
    return new Promise((resolve, reject) => {
        let convertedBuffer;

        try {
            switch(ext) {
                case 'nodes':
                    convertedBuffer = nodesToJson(buffer);
                    break;
                case 'json':
                    convertedBuffer = jsonToNodes(buffer);
                    break;
                default:
                    convertedBuffer = buffer;
                    reject(`Unknown filetype: .${ext}`);
            }
        } catch(err) {
            reject(err);
        }

        if (convertedBuffer === undefined) {
            reject('Could not convert buffer.');
            return;
        }

        resolve(convertedBuffer);
    });
}

export function getTargetExt(ext: string | undefined) {
    switch(ext) {
        case 'nodes':
            return 'json';
        case 'json':
            return 'nodes';
        default:
            return 'bruhmoment';
    }
}