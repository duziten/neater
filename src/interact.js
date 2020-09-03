const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');

const getGitBranchs = require('../utils').getGitBranchs;
const deleteLocalBranchItem = require('../utils').deleteLocalBranchItem;
const deleteRemoteBranchItem = require('../utils').deleteRemoteBranchItem;

const deleteBranchItem = (map, answer, key, config) => {
  if (answer[key]) {
    deleteLocalBranchItem(map[key], config.force);
    if (!config.local) {
      deleteRemoteBranchItem(map[key], config.remote);
    }
  } else {
    console.log(chalk.yellow(`=> skip the branch: ${map[key]}`));
  }
};

const pipe = (map, tasks, index = 0, fn, config) => {
  if (index >= tasks.length) return;
  inquirer.prompt([tasks[index]]).then((answers) => {
    fn(map, answers, tasks[index].name, config);
    pipe(map, tasks, ++index, fn, config);
  });
};

const getQuestions = (branchs, number) => {
  const questions = [];
  branchs.forEach((b, i) => {
    questions.push({
      type: 'confirm',
      name: b,
      message: `Are you sure to delete ${chalk.blue(branchs.map[b])} ${
        i + 1 > branchs.length - number ? chalk.bold.red('Recently Used!') : ''
      }`
    });
  });
  return questions;
};

const interactClear = (config = {}) => {
  const { ignore, number, local, remote, force } = config;
  const branchs = getGitBranchs(ignore || []);
  const questions = getQuestions(branchs, number);
  pipe(branchs.map, questions, 0, deleteBranchItem, { local, remote, force });
};

module.exports = interactClear;
