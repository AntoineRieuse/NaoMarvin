import Discord from "discord.js";
import loadCommands from "../core/loadCommands.js";

const name = "help";
const description =
  "Get all commands list";
const execute = async (message, args) => {
  const commands = await loadCommands();

  const helpEmbed = new Discord.MessageEmbed()
    .setColor("#2699e0")
    .setTitle("Help")
    .setFooter(process.env.SERVER_NAME);

  if (!args.length)
    commands.map((command) => {
      helpEmbed.addField(command.name, command.description);
    });
  else {
    const command = commands.find((cmd) => cmd.name === args[0]);
    if (!!command) {
      const { name, description } = command;
      helpEmbed.addField(name, description);
    } else {
      helpEmbed.addField(args[0], "This command doesn't exists");
    }
  }
  message.channel.send(helpEmbed);
};

export { name, description, execute };
