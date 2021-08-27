import { v4 as uuidv4 } from 'uuid';
import sqlite3 from 'sqlite3';
import nodemailer from 'nodemailer';

const name = "link";
const description = "Link Epitech and Discord acounts";

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
        subject: 'Discord account link token',
        text: token
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

const insert_db = (message, username) => {
    const db = new sqlite3.Database('./sql/db.sql');
    const token = uuidv4();
    db.all("SELECT discord_id FROM users WHERE ad_username='"+ username +"';", [], (err, rows) => {
        if (rows == "") { 
            db.run("INSERT INTO users (ad_username, token) VALUES ('"+ username +"', '"+ token +"')");
            console.log('link : link requested for', username);
            send_email(username, token);
            message.reply(`an email with a token has been sent to ${username}. Use ${process.env.CMD_PREFIX}token <token> to finish the linking :wink:`);
        } else {
            const user = message.guild.client.users.cache.get(rows[0].discord_id);
            message.reply(`this AD account is already linked to ${user.tag}`);
        }
    });
    db.close();
};

const execute = (message, args) => {
    if (message.channel.id === process.env.BOT_STUFF_CHANNEL_ID) {
        if (args.length === 1) {
            const username = args[0] + '@' + process.env.EMAILS_DOMAIN;

            insert_db(message, username);
        } else {
            message.reply(`you did an error in your syntax :confused:. Please use ${process.env.CMD_PREFIX}link <firstname(int).lastname>`);
        }
    } else {
        message.reply(
            `please send me this command in <#${process.env.BOT_STUFF_CHANNEL_ID}> \^\^`
          );     
    }
};

export { name, description, execute };