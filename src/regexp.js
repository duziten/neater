const minimatch = require('minimatch');
const chalk = require('chalk');
const inquirer = require('inquirer');

const getGitBranchs = require('../utils').getGitBranchs;
const deleteLocalBranchItem = require('../utils').deleteLocalBranchItem;
const deleteRemoteBranchItem = require('../utils').deleteRemoteBranchItem;
const getRegExp = require('../utils').getRegExp;

const doClear = (branch, config) => {
  deleteLocalBranchItem(branch, config.force);
  if (!config.local) {
    deleteRemoteBranchItem(branch, config.remote);
  }
};

const filterBranchs = (branchs, pattern, number) => {
  const removes = [];
  const keeps = [];
  branchs.forEach((b, i) => {
    const keep = branchs.length - number;
    if (i < keep && getRegExp(pattern).test(branchs.map[b])) {
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

const regexpClear = async (config = {}) => {
  const { pattern, ignore, local, number, remote, force } = config;
  if (getRegExp(pattern)) {
    const branchs = getGitBranchs(ignore || []);
    const [removes, keeps] = filterBranchs(branchs, pattern, number);

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
  } else {
    console.log(chalk.red('Invalidate RegExp!'));
  }
};

module.exports = regexpClear;
