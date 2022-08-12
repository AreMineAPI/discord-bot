const { Client, Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require("../../config.mineapi.js");
const fs = require("fs");
const path = require("path");

module.exports = class MineAPI extends Client {

  //client.config
  get config() {
    return config;
  }

  async run() {
    //definitions
    const rest = new REST({ version: "9" }).setToken(config.client.token);
    this.commands = new Collection();
    this.botReady = false;
    this.customColor = '#86EFAC';

    //run client
    fs.readdir(path.join(__dirname, "../commands"), (err, commands) => {
      if (err) throw new Error(err.message);
      commands
        .filter((command) => command.endsWith(".js"))
        .forEach(async (command) => {
          try {
            const Command = await require(`../commands/${command}`);
            this.commands.set(Command.name, Command);
          } catch (err) {
            console.error(err);
          }
        });
    });

    fs.readdir("./src/events", async (err, files) => {
      if (files) {
        let loadedEvents = 0;
        console.info(`${files.length} event found, loading..`);
        files.forEach((file) => {
          loadedEvents++;
          require(`${process.cwd()}/${"./src/events"}/${file}`)(this, config);
          if (loadedEvents == files.length)
            console.success(`All events loaded! (${files.length})`);
        });
      }
    });

    this.once("ready", async () => {
      try {
        console.info("Started loading application [/] commands...");
        await rest.put(Routes.applicationCommands(this.user.id), {
          body: this.commands.toJSON(),
        });
        console.success(
          `Successfully loaded application [${this.commands.size}] commands!`
        );
        this.botReady = true;
        console.info("Commands are enabled!");
      } catch (err) {
        console.error(err);
      }
    });

    this.on("interactionCreate", async (interaction) => {
      try {
        if (!interaction.isCommand() || !this.botReady) return;
        const command = this.commands.find(
          (cmd) => cmd.name == interaction.commandName
        );
        if (!command) return;

        command.run(this, interaction);
      } catch (err) {
        console.error(err);
      }
    });

    this.login(config.client.token)
      .then(() => {
        console.success(
          "Client successfully logged in. (" + this.user.tag + ")",
          "MineAPI"
        );
      })
      .catch(() => {
        console.error("Client failed to log in. Please check token.");
      });
  }
};
