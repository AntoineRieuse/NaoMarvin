import sqlite3 from 'sqlite3';
import Discord from "discord.js";

const name = "schedule";
const description = "Get school's opening hours";

const get_db_schedule = (message, callback) => {
    const db = new sqlite3.Database('./sql/extra_db.sql');
    db.all("SELECT * FROM schedule;", [], (err, rows) => {
        return callback(rows);
    });
    db.close();
}

const display_infos = (message) => {
        const db_datas = get_db_schedule(message, async function(db_schedule) {
            const schedule = db_schedule[0];
            const infosEmbed = new Discord.MessageEmbed()
                .setColor("#2699e0")
                .setTitle("School's opening hours")
                .setFooter(process.env.SERVER_NAME);
            
            Object.keys(schedule).forEach(day => {
                if (schedule[day] == "0 - 0") {
                    schedule[day] = "Closed";
                }
            });
            // console.log(schedule);
            infosEmbed.addField("Monday", schedule.monday);
            infosEmbed.addField("Tuesday", schedule.tuesday);
            infosEmbed.addField("Wednesday", schedule.wednesday);
            infosEmbed.addField("Thursday", schedule.thursday);
            infosEmbed.addField("Friday", schedule.friday);
            infosEmbed.addField("Saturday", schedule.saturday);
            infosEmbed.addField("Sunday", schedule.sunday);
            message.channel.send(infosEmbed);
        });
}

const execute = (message) => {
    if (message.channel.id === process.env.BOT_STUFF_CHANNEL_ID || message.channel.id === process.env.ADMIN_BOT_STUFF_CHANNEL_ID) {
        display_infos(message);
    } else {
        message.reply(
            `please send me this command in <#${process.env.BOT_STUFF_CHANNEL_ID}> \^\^`
            );
    }
};

export { name, description, execute };