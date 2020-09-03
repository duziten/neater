#! /usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const shell = require('shelljs');

const interact = require('../src/interact');
const monster = require('../src/monster');
const regexp = require('../src/regexp');
const checkCwd = require('../src/check');

const app = require('../package.json');

if (!shell.which('git')) {
  shell.echo(chalk.red('Sorry, this script requires git'));
  shell.exit(1);
}

program.version(app.version, '-v, --version');

program.option('-f, --force', 'force to delete', false);
program.option('-r, --remote <remote>', 'the name of remote repo', 'origin');
program.option('-ig, --ignore <ignore...>', 'ignore branchs');

program
  .command('check')
  .description('check current work dirctory')
  .option('-n, --number <number>', 'the number of safety branchs', 3)
  .action((opts) => {
    const { number } = opts;
    checkCwd({ ...program.opts(), number });
  });

program
  .command('clear')
  .description('clear git brach in current work dirctory')
  .option('-i, --interactive', 'clear git branch interactively', true)
  .option('-e, --execute', 'clear git branch by regexp')
  .option('-a, --all', 'clear all git branch but master')
  .option('-l, --local', 'just clear local branch', false)
  .option('-n, --number <number>', 'the number of safety branchs', 3)
  .option('-p, --pattern <pattern>', 'the pattern of match')
  .action((opts) => {
    const { interactive, all, execute, number, local, pattern } = opts;
    switch (true) {
      case execute:
        regexp({ ...program.opts(), number, local, pattern });
        break;
      case all:
        monster({ ...program.opts(), number, local });
        break;
      case interactive:
        interact({ ...program.opts(), number, local });
        break;
      default:
        interact({ ...program.opts(), number, local });
        break;
    }
  });

program.name('nt').usage('[command] [options] ');
program.parse(process.argv);
