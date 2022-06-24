import Discord from "discord.js";
import sqlite3 from 'sqlite3';
import { username_to_disName } from '../core/users_managmt.js';

const name = "status";
const description = `Admins: Get status about an ${process.env.COMPANY_NAME} user`;

const get_db_infos = (message, given_username, callback) => {
    const db = new sqlite3.Database('./sql/db.sql');
    db.all("SELECT discord_id, linked FROM users WHERE ad_username='"+ given_username +"';", [], (err, rows) => {
        if (rows != "") {
            return callback(rows);
        } else {
            message.reply(`linking process not started yet for this AD account :confused:`);
        }
    });
    db.close();
}

const display_infos = (message, given_username) => {
        const db_infos = get_db_infos(message, given_username, async function(datas) {
            const db_datas = datas[0];
            const infosEmbed = new Discord.MessageEmbed()
                .setColor("#2699e0")
                .setTitle(username_to_disName(given_username))
                .setFooter(process.env.SERVER_NAME);

            infosEmbed.addField("Email", given_username);
            if (db_datas.linked === 1) {
                const user = await message.guild.client.users.fetch(db_datas.discord_id);
                infosEmbed.addField("Discord account", await message.guild.client.users.cache.get(user.id));
            } else
            infosEmbed.addField("Link status", "Token validation pending");
            message.channel.send(infosEmbed);
        });
}

const execute = (message, args) => {
    if (message.channel.id === process.env.BOT_STUFF_CHANNEL_ID || message.channel.id === process.env.ADMIN_BOT_STUFF_CHANNEL_ID) {
        if (message.member.roles.cache.has(process.env.BOT_ADMIN_ROLE_ID)) {
            if (args.length === 2) {
                const emails_domains = process.env.EMAILS_DOMAINS.split(',');
                var username;


                if (args[1] === "it") {
                    username = args[0] + '@' + emails_domains[0];
                    display_infos(message, username)
                } else if (args[1] === "digital") {
                    username = args[0] + '@' + emails_domains[1];
                    display_infos(message, username)
                } else {
                    message.reply(`you did an error in your syntax :confused:. Please use ${process.env.CMD_PREFIX}status <firstname(int).lastname> <it | digital>`);
                }
            } else {
                message.reply(`you did an error in your syntax :confused:. Please use ${process.env.CMD_PREFIX}status <firstname(int).lastname> <it | digital>`);
            }
        } else {
            message.reply("Woow... you can't do that :disappointed_relieved:");
        }
    } else {
        message.reply(
            `please send me this command in <#${process.env.BOT_STUFF_CHANNEL_ID}> \^\^`
            );
    }
};

export { name, description, execute };