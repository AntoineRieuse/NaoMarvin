import sqlite3 from 'sqlite3';
import { username_to_disName } from '../core/users_managmt.js';

const name = "token";
const description = `To provide the token into email to finish the linking of ${process.env.COMPANY_NAME} and Discord accounts`;

const check_token = (message, given_token) => {
    const db = new sqlite3.Database('./sql/db.sql');
    const role = message.guild.roles.cache.find(r => r.id === process.env.VERIFIED_ROLE_ID);
    db.all("SELECT ad_username, linked FROM users WHERE token='"+ given_token +"' AND linked='0';", [], (err, rows) => {
        if (rows != "") {
            db.run("UPDATE users SET discord_id='"+ message.member.user.id +"' WHERE token='"+ given_token +"'");
            console.log('token : token accepted for', message.member.user.tag);
            db.run("UPDATE users SET linked='1' WHERE token='"+ given_token +"'");
            message.reply(`your ${process.env.COMPANY_NAME} account as been linked! :partying_face:`);
            message.member.setNickname(username_to_disName(rows[0].ad_username));
            message.member.roles.add(role);
        } else {
            message.reply(`Hummm... This token don't works... :cold_sweat:`);
        }
    });
    db.close();
}

const execute = (message, args) => {
    if (message.channel.id === process.env.BOT_STUFF_CHANNEL_ID || message.channel.id === process.env.ADMIN_BOT_STUFF_CHANNEL_ID) {
        if (args.length === 1) {
            const given_token = args[0];
            
            check_token(message, given_token);
        } else {
            message.reply(`you did an error in your syntax :confused:. Please use ${process.env.CMD_PREFIX}token <token>`);
        }
    } else {
        message.reply(
            `please send me this command in <#${process.env.BOT_STUFF_CHANNEL_ID}> \^\^`
          );
    }
};

export { name, description, execute };