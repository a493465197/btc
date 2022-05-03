'use strict';

const PREFIX = 'room';

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, helper } = ctx;
    const id = socket.id;
    const nsp = app.io.of('/home');
    const query = socket.handshake.query;

    // 用户信息
    const { room, userId } = query;
    const rooms = [ room ];


    // 检查房间是否存在，不存在则踢出用户
    // 备注：此处 app.redis 与插件无关，可用其他存储代替
    // const hasRoom = await app.redis.get(`${PREFIX}:${room}`);

    // logger.debug('#has_exist', hasRoom);

    // if (!hasRoom) {
    //   tick(id, {
    //     type: 'deleted',
    //     message: 'deleted, room has been deleted.',
    //   });
    //   return;
    // }
    // const el = await ctx.model.Config.findOne()
    // socket.emit('init', {
    //   val: el
    // })

    const blocks = await ctx.model.Block.find().sort({currHeight: -1})
    const config = await ctx.model.Config.findOne()
    socket.emit('init', config)
    socket.emit('block', blocks)

    await next();

  };
};
