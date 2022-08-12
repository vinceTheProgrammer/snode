import type { MessageEmbed, TextChannel } from "discord.js";

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