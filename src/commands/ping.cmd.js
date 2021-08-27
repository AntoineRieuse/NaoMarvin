const name = "ping";
const description = "Ping command";
const execute = (message) => {
  message.channel.send("Pong!");
};

export { name, description, execute };