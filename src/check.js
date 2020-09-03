const chalk = require('chalk');
const getGitBranchs = require('../utils').getGitBranchs;

module.exports = function (config = {}) {
  const { number, ignore } = config;
  getGitBranchs((branchs) => {
    if (branchs.length <= Number(number)) {
      console.log(chalk.green('Ooo~ You are a neater!'));
    } else {
      console.log(
        chalk.white(
          `Something need to clear, run ${chalk.green(
            'nt clear [options]'
          )} can help!`
        )
      );
    }
  }, ignore || []);
};
