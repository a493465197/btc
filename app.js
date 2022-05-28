'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    const nsp = app.io.of('/home');

    app.intervalTime = 1000*60
    app.intervalFunc = async(intervalTime) => {
      const lastConfig = await app.model.Config.findOne()

      await app.model.Config.updateOne({}, {
        nextBlockTime: Date.now() + Number.parseInt(intervalTime),
        currHeight: (lastConfig.currHeight || 0) +1
      })
      const currSockets = Object.keys(await app.io.of('/wakuang').sockets)
      let users = await app.model.User.find()
      users = users.filter((e) => currSockets.includes(e.socketId))
      const allHash = users.reduce((all, item) => {
        return all + item.hash
      }, 0)
      const currBlockHash = Math.random() * allHash

      let blockUser = null
      users.reduce((all, item) => {
        const temp = all + item.hash
        if (blockUser) {
          return 0
        }
        if (temp > currBlockHash) {
          blockUser = item
          return 0
        }
        return all + item.hash

      }, 0)
      if (blockUser) {
        await app.model.User.updateOne({}, {
          coin: (blockUser.coin || 0) + lastConfig.blockSize,
        })
      }

      await app.model.Block.create({
        currHeight: lastConfig.currHeight + 1,
        blockSize: lastConfig.blockSize,
        username: blockUser ? blockUser.username : '无在线节点丢失',
      })

      const blocks = await app.model.Block.find().sort({currHeight: -1}).limit(200)
      const config = await app.model.Config.findOne()
      nsp.emit('init', config)
      nsp.emit('block', blocks)
    }
    app.interval = setInterval(app.intervalFunc.bind(this, app.intervalTime), app.intervalTime)
  });

};
