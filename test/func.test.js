const shelljs = require('shelljs');
const {
  genDelRemoteCommand,
  genDelLocalCommand,
  getGitBranchText,
  getGitBranchs,
} = require('../utils');

jest.mock('shelljs', () => ({
  exec: jest.fn(),
}));

// test generate git command
describe('test generate local git command', () => {
  // invalidate
  it('no arg, it should generate undefined command', () => {
    const val = genDelLocalCommand();
    expect(val).toBe('git branch -d undefined');
  });
  it('arg empty str, it should generate no branch command', () => {
    const val = genDelLocalCommand('');
    expect(val).toBe('git branch -d ');
  });

  // validate
  it('pass arg 1 dev, it should generate dev branch command with "-d" flag', () => {
    const val = genDelLocalCommand('dev');
    expect(val).toBe('git branch -d dev');
  });
  it('pass arg dev false, it should generate dev branch command with "-d" flag', () => {
    const val = genDelLocalCommand('dev', false);
    expect(val).toBe('git branch -d dev');
  });
  it('pass arg dev true, it should generate dev branch command with "-D" flag', () => {
    const val = genDelLocalCommand('dev', true);
    expect(val).toBe('git branch -D dev');
  });
});

describe('test generate remote git command', () => {
  // invalidate
  it('no arg, it should generate undefined command', () => {
    const val = genDelRemoteCommand();
    expect(val).toBe('git push --delete origin undefined');
  });
  it('arg empty str, it should generate empty branch command', () => {
    const val = genDelRemoteCommand('');
    expect(val).toBe('git push --delete origin ');
  });
  it('arg empty str ori, it should generate remote ori branch command', () => {
    const val = genDelRemoteCommand('', 'ori');
    expect(val).toBe('git push --delete ori ');
  });

  // validate
  it('arg dev, it should generate remote origin/dev branch command', () => {
    const val = genDelRemoteCommand('dev');
    expect(val).toBe('git push --delete origin dev');
  });
  it('arg dev ori, it should generate remote ori/dev branch command', () => {
    const val = genDelRemoteCommand('dev', 'ori');
    expect(val).toBe('git push --delete ori dev');
  });
});

describe('test func getGitBranchText', () => {
  it('should return correct text', () => {
    const val = 'just for test';
    const mockText = { stdout: val };
    shelljs.exec.mockReturnValueOnce(mockText);
    const text = getGitBranchText();
    expect(text).toEqual(val);
  });
  it('should return empty str', () => {
    const val = '';
    const mockText = { stdout: val };
    shelljs.exec.mockReturnValueOnce(mockText);
    const text = getGitBranchText();
    expect(text).toEqual(val);
  });

  it('should return branch list', () => {
    const val = `
      feat/202008-test1
      feat/202008-test2
      feat/202008-test3
      * master
    `;
    const mockText = { stdout: val };
    shelljs.exec.mockReturnValueOnce(mockText);
    const text = getGitBranchText();
    expect(text).toEqual(val);
  });
});

describe('test func getGitBranchs', () => {
  const branchs = `
    feat/202008-test1
    feat/202008-test2
    feat/202008-test3
    * master
  `;
  const branchs1 = `
    * feat/202008-test1
    feat/202008-test2
    feat/202008-test3
    master
  `;
  const emptyStr = '';

  it('should return empty with map property branchs array when pass emptyStr', () => {
    shelljs.exec.mockReturnValueOnce({ stdout: emptyStr });
    const values = getGitBranchs();
    expect(values).toHaveLength(0);
    expect(values).toHaveProperty('map');
  });

  it('should return not empty with map property branchs array when pass branchs array', () => {
    shelljs.exec.mockReturnValueOnce({ stdout: branchs });
    const values = getGitBranchs();
    expect(values).not.toHaveLength(0);
    expect(values).toHaveProperty('map');
  });

  it('should return array without master', () => {
    shelljs.exec.mockReturnValueOnce({ stdout: branchs });
    const values = getGitBranchs();
    expect(values).toHaveLength(3);
    expect(values).toHaveProperty('map');
    expect(values.map['branch1']).toBe('feat/202008-test1');
    expect(values.map['branch2']).toBe('feat/202008-test2');
    expect(values.map['branch3']).toBe('feat/202008-test3');
    values.forEach(v => {
      expect(values.map[v]).not.toBe('master');
    });
  });

  it('should return array without master and ignores', () => {
    shelljs.exec.mockReturnValueOnce({ stdout: branchs });
    const values = getGitBranchs(['feat/202008-test1']);
    expect(values).toHaveLength(2);
    expect(values).toHaveProperty('map');
    // ignores and master
    values.forEach(v => {
      expect(values.map[v]).not.toBe('feat/202008-test1');
      expect(values.map[v]).not.toBe('master');
    });
  });

  it('should return array without master and current', () => {
    shelljs.exec.mockReturnValueOnce({ stdout: branchs1 });
    const values = getGitBranchs();
    expect(values).toHaveLength(2);
    expect(values).toHaveProperty('map');
    // ignores and master
    values.forEach(v => {
      expect(values.map[v]).not.toBe('feat/202008-test1');
      expect(values.map[v]).not.toBe('master');
    });
  });
});
