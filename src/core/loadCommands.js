import { readdirSync } from "fs";

const loadCommands = async () => {
  const commandFiles = readdirSync("./src/commands").filter((file) => {
    return file.endsWith(".cmd.js");
  });

  const commands = Promise.all(
    commandFiles.map(async (file) => {
      const { name, description } = await import(`../commands/${file}`);
      return { name, description };
    })
  );

  return commands;
};

export default loadCommands;
