const chalk = require('chalk');
const inquirer = require('inquirer');

const getGitBranchs = require('../utils').getGitBranchs;
const deleteLocalBranchItem = require('../utils').deleteLocalBranchItem;
const deleteRemoteBranchItem = require('../utils').deleteRemoteBranchItem;

const doClear = (branch, config) => {
  deleteLocalBranchItem(branch, config.force);
  if (!config.local) {
    deleteRemoteBranchItem(branch, config.remote);
  }
};

const filterBranchs = (branchs, number) => {
  const removes = [];
  const keeps = [];
  branchs.forEach((b, i) => {
    const keep = branchs.length - number;
    if (i < keep) {
      removes.push({
        branch: branchs.map[b],
        action: 'clear'
      });
    } else {
      keeps.push({
        branch: branchs.map[b],
        action: 'skip'
      });
    }
  });
  return [removes, keeps];
};

const makeSure = () => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'isGo',
      message: 'Please check the list before start and are you sure'
    }
  ]);
};

monsterClear = async (config = {}) => {
  const { ignore, number, local, remote, force } = config;

  const branchs = getGitBranchs(ignore || []);
  const [removes, keeps] = filterBranchs(branchs, number);

  if (!removes.length) {
    return console.log(chalk.green('Nothing to clear!'));
  }
  console.log(chalk.red('This branchs will be clear:'));
  console.table(removes);
  if (keeps.length) {
    console.log(chalk.yellow('This branchs will be skip:'));
    console.table(keeps);
  }

  const answer = await makeSure();
  if (answer.isGo) {
    removes.forEach((b) => {
      doClear(b.branch, { local, remote, force });
    });
  }
};

module.exports = monsterClear;
