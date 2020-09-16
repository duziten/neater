# Neater

> Neater(体面人 👨‍💼) 是一个帮你管理 `git` 分支的 cli 工具，保持体面

## Feature

- 🚀 告别 git 命令，比 GUI 工具更加方便快捷
- 🤙 多种模式支持：交互式模式、自定义正则匹配模式和 all in 模式
- 🏥 默认保护最近使用分支和 master，检查工作目录是否需要清理

## Install

```js
> npm install -g neater
// or yarn
> yarn add -g neater
...
// success
> nt -v
```

## Usage

**注意：删除分支是一件很危险的事，请确保当前仓库工作已经完成，仔细核对 prompt 的信息。**

- 为了尽可能保证不误删分支，neater 默认会忽略 master 分支 和当前分支以及最近活跃的 3 条分支。（可通过配置覆盖默认行为）
- neater 默认会删除本地分支和远程 origin 对应的远程分支（可配置）
- 删除前检查是否体面 `nt check -n 5` 在保留最近 5 条分支的前提下是不是需要清除

```sh
nt [command] [options]

# options
-f --force 强制删除
-r --remoote 修改远程仓库
-ig --ignore 添加忽略分支
-n --number 修改默认保护分支数
-l --local 仅删除本地分支

# 仅匹配模式
-p --pattern 指定匹配模式
```

### Check

检查当前目录是否体面（默认排除保护分支）

```sh
nt check
```

```sh
# 保护活跃度 5条分支的前提下
nt check -n 5
```

### 交互模式（推荐）

> 通过 QA 的方式删除当前工作目录的 git 分支，**默认保护最近活跃的 3 条分支和 master**

1. 交互式方式清除(默认)

```sh
nt clear
# or
nt clear -i
```

2. 仅删除本地分支（默认删除远程同名分支）

```sh
nt clear -l
```

3. 修改默认保护分支数量为 6 条(默认为 3 条)

```sh
nt clear -n 6
```

4. 修改远程仓库 ori（默认远程仓库 origin）

```sh
nt clear -r ori
```

5. 忽略 dev, develop 分支（默认忽略当前分支、master 和最近活跃）

```sh
nt clear -ig dev develop
```

6. 强制删除

```sh
nt clear -f
```

### 自定义正则匹配模式
支持`js`正则表达式自定义检索分支：
删除以 feat 开头的分支, -p 指定模式（默认也会启用保护，删除所有： `-n 0`）

```sh
nt clear -e -p '/feat.*/'

```

### All in 模式（删除所有）

除保护分支的所有分支（master 和当前分支永不会删除）

```sh
nt clear -a
# 默认也会启用保护，删除所有： `-n 0`
nt clear -a -n 0
```

### 如何判断分支是否活跃？

```sh
git branch --sort=committerdate
```
