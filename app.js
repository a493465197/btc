'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    const nsp = app.io.of('/home');
    app.intervalFunc = async() => {
      const lastConfig = await app.model.Config.findOne()

      await app.model.Config.updateOne({}, {
        nextBrockTime: Date.now() + 3000,
        currHeight: (lastConfig.currHeight || 0) +1
      })
      console.log(app.io.of('/wakuang'))
      const config = await app.model.Config.findOne()
      nsp.emit('init', config)
    }
    app.interval = setInterval(app.intervalFunc, 3000)
  });

};
