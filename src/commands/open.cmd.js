import { get_school_status } from '../core/background_tasks.js';

const name = "open";
const description = "Admins: force school status to open";
const execute = async (message) => {
    if (message.channel.id === process.env.ADMIN_BOT_STUFF_CHANNEL_ID) {
        if (message.member.roles.cache.has(process.env.BOT_ADMIN_ROLE_ID)) {
            const channel = await message.guild.channels.cache.get(process.env.SCHOOL_STATUS_DISPLAY_CHANNEL, false);
            channel.setName("✅SCHOOL IS OPEN");
            console.log("open: School status now set to: OPEN");
            message.reply("school status is now set to open! :white_check_mark:")
        } else {
            message.reply("school status is already set to open :confused:");
        }
    } else {
        message.reply(
            `please send me this command in <#${process.env.ADMIN_BOT_STUFF_CHANNEL_ID}> \^\^`
        );     
    }
};

export { name, description, execute };