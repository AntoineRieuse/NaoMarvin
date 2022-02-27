import sqlite3 from 'sqlite3';

const get_cur_day = () => {
    const cur_date = new Date();
    const cur_day_nbr = cur_date.getDay();
    let cur_day = "";

    switch (cur_day_nbr) {
        case 0:
            cur_day = "sunday";
            break;
        case 1:
            cur_day = "monday";
            break;
        case 2:
            cur_day = "tuesday";
            break;
        case 3:
            cur_day = "wednesday";
            break;
        case 4:
            cur_day = "thursday";
            break;
        case 5:
            cur_day = "friday";
            break;
        case 6:
            cur_day = "saturday";
            break;
    }
    return(cur_day);
}

const get_today_schedule = (cur_day, callback) => {
    const db = new sqlite3.Database('./sql/extra_db.sql');
    db.all("SELECT "+ cur_day +" FROM schedule;", [], (err, rows) => {
        return callback(rows[0][cur_day]);
    });
    db.close();
}

const get_school_status = (callback) => {
    const db = new sqlite3.Database('./sql/extra_db.sql');
    db.all("SELECT school_status FROM schedule;", [], (err, rows) => {
        return callback(rows[0]['school_status']);
    });
    db.close();
}

const update_school_status = (channel, status) => {
    if (status === 1) {
        channel.setName("✅OPEN");
        const db = new sqlite3.Database('./sql/extra_db.sql');
        db.run('UPDATE schedule SET school_status=1');
        db.close();
        console.log("School status now set to: OPEN");
    } else if (status === 0) {
        channel.setName("⛔️CLOSED");
        const db = new sqlite3.Database('./sql/extra_db.sql');
        db.run('UPDATE schedule SET school_status=0');
        db.close();
        console.log("School status now set to: CLOSE");
    }
}

const set_school_statut = (Bot) => {
    get_today_schedule(get_cur_day(), async function(today_schedule) {
        const morning = today_schedule.split('-')[0].slice(0, -1) + ":00";
        const evening = today_schedule.split('-')[1].substring(1) + ":00";
        const channel = await Bot.channels.fetch(process.env.SCHOOL_STATUS_DISPLAY_CHANNEL, false);
        const cur_time = new Date().toLocaleTimeString("fr-fr");

        get_school_status(function(school_status) {
            if ((morning <= cur_time) && (cur_time <= evening)) {
                if (school_status === 0) {
                    update_school_status(channel, 1);
                }
            } else {
                if (school_status === 1) {
                    update_school_status(channel, 0);
                }
            }
        });
    });
}

const background_tasks = async (Bot) => {
    setInterval(() => set_school_statut(Bot), 60000);
    return;
}

export { background_tasks, get_school_status, update_school_status };