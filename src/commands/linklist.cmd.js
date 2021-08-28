import Discord from "discord.js";
import sqlite3 from 'sqlite3';

const name = "linklist";
const description = "List all linked Epitech accounts";

const execute = (message, args) => {
    if (message.channel.id === process.env.BOT_STUFF_CHANNEL_ID || message.channel.id === process.env.ADMIN_BOT_STUFF_CHANNEL_ID) {
            if (message.member.roles.cache.has(process.env.BOT_ADMIN_ROLE_ID)) {
            const db = new sqlite3.Database('./sql/db.sql');
            db.all("SELECT discord_id, ad_username FROM users;", [], async (err, rows) => {
                var cur_user;
                const helpEmbed = new Discord.MessageEmbed()
                .setColor("#2699e0")
                .setTitle("Epitech accounts linked")
                .setThumbnail(process.env.ICON_URL)
                .setFooter(process.env.SERVER_NAME);
                if (rows != "" && typeof rows != 'undefined') {
                    for await (var row of rows) {
                        if (row.discord_id) {
                            cur_user = await message.guild.client.users.fetch(row.discord_id);
                            helpEmbed.addField(row.ad_username, await message.guild.client.users.cache.get(cur_user.id));
                        } else
                            helpEmbed.addField(row.ad_username, "Token validation pending");
                    };
                } else 
                    helpEmbed.addField("Empty", "No account is linked yet");
                message.channel.send(helpEmbed);
            });
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