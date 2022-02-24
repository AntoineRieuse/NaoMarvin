import sqlite3 from 'sqlite3';

const name = "getschedule";
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
            const schedule = db_schedule;
            console.log(schedule);

            // const infosEmbed = new Discord.MessageEmbed()
            //     .setColor("#2699e0")
            //     .setTitle("School's opening hours")
            //     .setThumbnail(process.env.ICON_URL)
            //     .setFooter(process.env.SERVER_NAME);

            // infosEmbed.addField("Monday", schedule.);
            // if (db_datas.linked === 1) {
            //     const user = await message.guild.client.users.fetch(db_datas.discord_id);
            //     infosEmbed.addField("Discord account", await message.guild.client.users.cache.get(user.id));
            // } else
            // infosEmbed.addField("Link status", "Token validation pending");
            // message.channel.send(infosEmbed);
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