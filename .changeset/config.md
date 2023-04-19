# config.json 参数介绍
changelog: changelog 生成方式
commit: 不要让 changeset 在 publish 的时候帮我们做 git add
linked: 配置哪些包要共享版本
access: 公私有安全设定，内网建议 restricted ，开源使用 public
baseBranch: 项目主分支
updateInternalDependencies: 确保某包依赖的包发生 upgrade，该包也要发生 version upgrade 的衡量单位（量级）
ignore: 不需要变动 version 的包

