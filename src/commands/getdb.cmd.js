import Discord from "discord.js";
import sqlite3 from 'sqlite3';

const name = "getdb";
const description = "Admins: send you SQL data in dm";

const display_sql = (message, datas) => {
    const infosEmbed = new Discord.MessageEmbed()
        .setColor("#2699e0")
        .setTitle("SQL DATABASE")
        .setThumbnail(process.env.ICON_URL)
        .setFooter(process.env.SERVER_NAME);

    datas.forEach(data => {
        infosEmbed.addField(data.ad_username, data.token);
    });
    message.reply("I sent you the data by dm :wink:")
    message.author.send(infosEmbed);
}

const get_sql = (message, callback) => {
    const db = new sqlite3.Database('./sql/db.sql');
    db.all("SELECT ad_username, token FROM users;", [], (err, rows) => {
        if (rows != "") {
           return callback(rows);
        } else {
            message.reply(`Hummm... The data base is empty :confused:`);
        }
    });
    db.close();
}

const execute = (message, args) => {
    if (message.channel.id === process.env.BOT_STUFF_CHANNEL_ID) {
        if (message.member.roles.cache.has(process.env.BOT_ADMIN_ROLE_ID)) {
            get_sql(message, function(result) {
                display_sql(message, result);
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