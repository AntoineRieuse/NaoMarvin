import sqlite3 from 'sqlite3';

const name = "setschedule";
const description = "Admins: Update school's opening hours";

const insert_db = (message, schedule) => {
    const db = new sqlite3.Database('./sql/extra_db.sql');
    db.run(`UPDATE schedule SET monday='`+ schedule.opening_monday +` - `+ schedule.closing_monday +`', tuesday='`+ schedule.opening_tuesday +` - `+ schedule.closing_tuesday +`',
    wednesday='`+ schedule.opening_wednesday +` - `+ schedule.closing_wednesday +`',thursday='`+ schedule.opening_thursday +` - `+ schedule.closing_thursday +`',
    friday='`+ schedule.opening_friday +` - `+ schedule.closing_friday +`',saturday='`+ schedule.opening_saturday +` - `+ schedule.closing_saturday +`',
    sunday='`+ schedule.opening_sunday +` - `+ schedule.closing_sunday +`';`);

    console.log('setschedule : updated to', schedule);
    message.reply(`school's opening hours has been successfully updated :wink:`);

    db.close();
};

const execute = (message, args) => {
    if (message.channel.id === process.env.ADMIN_BOT_STUFF_CHANNEL_ID) {
        if (message.member.roles.cache.has(process.env.BOT_ADMIN_ROLE_ID)) {
            if (args.length >= 14) {
                const schedule = {
                    opening_monday: args[0],
                    closing_monday: args[1],
                    opening_tuesday: args[2],
                    closing_tuesday: args[3],
                    opening_wednesday: args[4],
                    closing_wednesday: args[5],
                    opening_thursday: args[6],
                    closing_thursday: args[7],
                    opening_friday: args[8],
                    closing_friday: args[9],
                    opening_saturday: args[10],
                    closing_saturday: args[11],
                    opening_sunday: args[12],
                    closing_sunday: args[13]
                };
                insert_db(message, schedule);
            } else {
                message.reply(`you did an error in your syntax :confused:. Please use ${process.env.CMD_PREFIX}setschedule <monday opening hour> <monday closing hour> ...`);
            }
        } else {
            message.reply("Woow... you can't do that :disappointed_relieved:");
        }
    } else {
        message.reply(
            `please send me this command in <#${process.env.ADMIN_BOT_STUFF_CHANNEL_ID}> \^\^`
          );     
    }
};

export { name, description, execute };