import sqlite3 from 'sqlite3';
import nodemailer from 'nodemailer';

const name = "unlink";
const description = `Admins: unlink ${process.env.COMPANY_NAME} and Discord account of a specific user`;

var transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: 587,
    secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
    tls: { ciphers: 'SSLv3' }
  });
  
  const send_email = (username, token) => {
      var mailOptions = {
          from: `"${process.env.BOT_NAME}" <infos@rieuse.fr>`,
          to: username,
          subject: 'Discord account unlinked',
          text: 'Your Discord account has been unlinked by an admin.'
      };
        
      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
      });
}

const rm_db = (message, given_username, user_to_remove) => {
    const db = new sqlite3.Database('./sql/db.sql');
    const role = message.guild.roles.cache.find(r => r.id === process.env.VERIFIED_ROLE_ID);
    db.all("SELECT discord_id, linked FROM users WHERE ad_username='"+ given_username +"';", [], async (err, rows) => {
        if (rows != "") {
            db.run("DELETE FROM users WHERE ad_username='"+ given_username +"';");
            console.log('unlink : unlink done for', given_username);
            send_email(given_username);
            if (rows[0].linked == 1) {
                const get_user = await message.guild.client.users.fetch(rows[0].discord_id);
                message.reply(`${process.env.COMPANY_NAME} account ${given_username} and Discord account ${await message.guild.client.users.cache.get(get_user.id)} has been sucessfully unlinked`);
                await user_to_remove.setNickname(null);
                await user_to_remove.roles.remove(role);
            } else {
                message.reply(`linking of ${process.env.COMPANY_NAME} account ${given_username} has been sucessfully canceled`);
            }
        } else {
            message.reply(`this ${process.env.COMPANY_NAME} account is not linked to any Discord account`);
        }
    });
    db.close();
};

const execute = (message, args) => {
    if (message.channel.id === process.env.BOT_STUFF_CHANNEL_ID || message.channel.id === process.env.ADMIN_BOT_STUFF_CHANNEL_ID) {
        if (message.member.roles.cache.has(process.env.BOT_ADMIN_ROLE_ID)) {
            if (args.length === 2) {
                const given_username = args[0] + '@' + process.env.EMAILS_DOMAIN;
                const user_to_remove = message.mentions.members.first()
                rm_db(message, given_username, user_to_remove);
            } else {
                message.reply(`you did an error in your syntax :confused:. Please use ${process.env.CMD_PREFIX}unlink <firstname(int).lastname> @<Discord user>`);
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