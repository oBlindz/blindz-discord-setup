// TOPICS //  
// [ 1 ] Create the terminal inputs commands : DONE
// [ 2 ] Instaling the dependencies
// [ 3 ] Creating the files and folders according the first step
// === //  

// Child Process
import { execSync } from 'node:child_process';

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
      testCommand();
    };
  };

  async function testCommand(){
    const testCommand = await confirm({
      message: "Do you want a test command? "
    });

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
    }
  };

  // Call project name
  projectName();
};
terminalInputs();
