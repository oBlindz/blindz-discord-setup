// TOPICS //  
// [ 1 ] Create the terminal inputs commands : DONE
// [ 2 ] Instaling the dependencies : DONE
// [ 3 ] Creating the directories : DONE 
//   - commands
//     - utility (optional)
// [ 4 ] Creating the files (according the user preference)
//   - deploycommands
//   - index
//   - ping (optional)
// === //  

// mkdirSync & writeFileSync 
import { mkdirSync, writeFileSync } from 'node:fs';

// Child Process
import { execSync } from 'node:child_process';

// Global variables
var testcommand;
var language;

// cjs function
function createcjs(tstcmd){
  // create main.cjs
  // create deploycommands.cjs
  // if necessary create testcommand
  
  // files code
  const cjs_main_code = `const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(token);
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".cjs"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log('[WARNING] The command at ', filePath, 'is missing a required "data" or "execute" property.');
    }
  }
}

client.once(Events.ClientReady, () => {
  console.log("Bot online");
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error('No command matching' ,interaction.commandName, ' was found.');
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    }
  }
});
  `; 
  const cjs_deploy_code = `const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log('[WARNING] The command at ', filePath, ' is missing a required "data" or "execute" property.');
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log('Started refreshing ',commands.length,' application (/) commands.');

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log('Successfully reloaded ',data.length, 'application (/) commands.');
  } catch (err) {
    console.error(err);
  }
})();
    
  `; 

  // Test command area
  if(tstcmd == true){
    const cjs_tst_code = `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('answer with pong'),
  async execute(interaction) {
    await interaction.reply('pong');
  },
}
    `;
    writeFileSync('./commands/utility/ping.cjs', cjs_tst_code, 'utf8');
  }

  // Creating the files
  writeFileSync('main.cjs', cjs_main_code, 'utf8'); 
  writeFileSync('deploycommands.cjs', cjs_deploy_code, 'utf8');
}; 

// Temrinal input commands
import { input, select, confirm } from '@inquirer/prompts';
function terminalInputs() {
  async function projectName(){
    const projectName = await input({
      message: "What's the project name? "
    });

    if(projectName) {
      // Call project description     
      projectDescription();
    };
  }; 

  async function projectDescription(){
    const projectDescription = await input({
      message: "What's the project description? "
    });

    if(projectDescription) {
      // Call project language
      projectLanguage();
    };
  };

  async function projectLanguage(){
    const projectLanguage = await select({
      message: "Choose one language / type model: ",
      choices: [
        {name: "Javascript (cjs)", value: "cjs", description: "Javascript but type commonJs"},
        {name: "Javascript (mjs)", value: "mjs", description: "Javascript but type moduleJs"},
        {name: "Typescript (mts)", value: "mts", description: "Typescript but type moduleJs"}
      ]
    });

    if(projectLanguage) {
      // Call test command
      language = projectLanguage.valueOf();
      testCommand();
    };
  };

  async function testCommand(){
    const testCommand = await confirm({
      message: "Do you want a test command? "
    });

    testcommand = testCommand.valueOf();

    // Call project author
    projectAuthor();
  };

  async function projectAuthor() {
    const projectAuthor = await input({
      message: "Author: "
    });

    if(projectAuthor) {
      // Call license
      license();
    };
  };

  async function license(){
    const license = await select({
      message: "Choose the license: ",
      choices: [
        {
          name: "MIT",
          description: "A permissive license that is simple and allows virtually unrestricted use, copying, modification, and distribution of software, as long as the original license and copyright notice are included.",
          value: "mit"
        },
        {
          name: "Apache license 2.0",
          description: "A permissive license that allows use, distribution, and modification, provided that changes are documented and significant contributions are acknowledged.",
          value: "apache2"
        },
        {
          name: "GNU General Public License (GPL) 3.0",
          description: "A copyleft license that requires any distributed modifications of the software to also be open source and under the same license.",
          value: "gpl3"
        },
        {
          name: "BSD 3-Clause license",
          description: "A permissive license similar to MIT but with additional disclaimers regarding endorsements.",
          value: "bsd3"
        },
        {
          name: "Mozilla Public License 2.0",
          description: "A hybrid license that allows for some proprietary uses but requires modifications to the source code to be made publicly available.",
          value: "mpl2"
        },
        { 
          name: "Unlicense",
          description: "A public domain license that allows unrestricted use, modification, and distribution of the software, without any conditions.",
          value: "unlicese"
        }
      ]
    });

    if(license){
      // Start step 2
      console.log('Installing dependencies...'); 
      execSync('npm i discord.js');
      console.log('Dependencies installed');
      // Start step 3
        // Creating the 'commands' directory
        console.log('creating directories');
        mkdirSync('commands', (err => {
          if(err) console.error(err);
        }));
        console.log("'commands' directory created");

        // If "testcommand === 'yes'" create one more directory
        if(testcommand == true) {
          mkdirSync('./commands/utility', (err => {
            console.error(err);
          }));
          console.log("'utility' directory created");
        };

        // Start step 4
          // create .config.json
          const cfgjson = `{
"clientId": "",
"guildId": "",
"token": ""
}
          `;

          writeFileSync('config.json', cfgjson, 'utf8');
          // Switch between the languages
          switch (language) {
            case 'cjs':
              // Call func cjs
              createcjs(testcommand);
              break;
            case 'mjs': 
              // Call func mjs

              break;
            case 'mts': 
              // Call func mts

              break;

            default:
              console.log('choose one language');
          };
    }
  };

  // Call project name
  projectName();
};
terminalInputs();
