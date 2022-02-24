import dotenv from "dotenv";
import { readdirSync } from "fs";
import Discord from "discord.js";
import sqlite3 from 'sqlite3';

// Getting .env config
dotenv.config();

const prefix = process.env.CMD_PREFIX;

// Starting bot client
const Bot = new Discord.Client({ autoReconnect: true });

// Find all commands files in ./src/commands (finishing with .cmd.js)
const commandFiles = readdirSync("./src/commands").filter((file) =>
  file.endsWith(".cmd.js")
);

// Load DBs
const users_db = new sqlite3.Database('./sql/db.sql');
users_db.run(`CREATE TABLE IF NOT EXISTS users (
        ad_username TEXT NOT NULL,
        discord_id TEXT,
        token TEXT NOT NULL,
        linked INT NOT NULL DEFAULT 0
      );`);
users_db.close();

const extra_db = new sqlite3.Database('./sql/extra_db.sql');
extra_db.run(`CREATE TABLE IF NOT EXISTS schedule (
        monday TEXT DEFAULT 0,
        tuesday TEXT DEFAULT 0,
        wednesday TEXT DEFAULT 0,
        thursday TEXT DEFAULT 0,
        friday TEXT DEFAULT 0,
        saturday TEXT DEFAULT 0,
        sunday TEXT DEFAULT 0
      );`);

extra_db.run(`INSERT INTO schedule (monday, tuesday, wednesday, thursday, friday, saturday, sunday) VALUES ('09:00 - 18:00','09:00 - 18:00','09:00 - 18:00',
'09:00 - 18:00','09:00 - 18:00','0 - 0','0 - 0')`);
  
extra_db.close();

// Creating command collection with previous collected files
Bot.commands = new Discord.Collection();
commandFiles.map(async (file) => {
  const command = await import(`./src/commands/${file}`);
  Bot.commands.set(command.name, command);
});
const commands = commandFiles.map((file) =>
  file.substring(0, file.indexOf(".cmd.js"))
);

// On bot login
Bot.on("ready", () => {
  console.log(`Logged in as ${Bot.user.tag}`);
  console.log(`Commands prefix set to '${prefix}'`);
});


// When bot detects a message
Bot.on("message", (message) => {
  // Detecting bot prefix
  if (!message.content.startsWith(prefix) || message.content.length <= 1 || message.author.bot) return;

  // Parsing arguments from command
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLocaleLowerCase();

  // Execute typed command if exists
  if (commands?.find((cmd) => cmd === command)) {
    try {
      Bot.commands.get(command).execute(message, args);
    } catch (err) {
      message.reply("Hmmm... 🤔 Something went wrong with this command...");
    }
  } else {
    message.reply("Hmmm... 🤔 I think you typed a wrong command...");
  }
});

// Start bot
Bot.login(process.env.TOKEN);
