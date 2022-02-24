import { get_school_status } from '../core/background_tasks.js';

const name = "close";
const description = "Admins: force school status to closed";
const execute = async (message) => {
    if (message.channel.id === process.env.ADMIN_BOT_STUFF_CHANNEL_ID) {
        if (message.member.roles.cache.has(process.env.BOT_ADMIN_ROLE_ID)) {
            const channel = await message.guild.channels.cache.get(process.env.SCHOOL_STATUS_DISPLAY_CHANNEL, false);
            channel.setName("⛔️SCHOOL IS CLOSED");
            console.log("close: School status now set to: CLOSE");
            message.reply("school status is now set to close! :no_entry:")
        } else {
            message.reply("school status is already set to close :confused:");
        }
    } else {
        message.reply(
            `please send me this command in <#${process.env.ADMIN_BOT_STUFF_CHANNEL_ID}> \^\^`
        );     
    }
};

export { name, description, execute };