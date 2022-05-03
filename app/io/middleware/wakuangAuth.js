'use strict';

const PREFIX = 'room';

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, helper } = ctx;
    const id = socket.id;
    const nsp = app.io.of('/wakuang');
    const query = socket.handshake.query;

    // 用户信息
    const { room='wakuang', username, hash } = query;
    const rooms = [ room ];

    logger.debug('#user_info', id, room, username);

    // 用户加入
    logger.debug('#join', room);
    socket.join(room);
    console.log(socket.id)
    await ctx.model.User.updateOne({username}, {
      socketId: socket.id,
      hash
    })



    // 在线列表
    nsp.adapter.clients(rooms, (err, clients) => {
      logger.debug('#online_join', clients);

      // 更新在线用户列表
      nsp.to(room).emit('online', {
        clients,
        action: 'join',
        target: 'participator',
        message: `User(${id}) joined.`,
      });
    });

    await next();

    // 用户离开
    logger.debug('#leave', room);

    // 在线列表
    nsp.adapter.clients(rooms, (err, clients) => {
      logger.debug('#online_leave', clients);

      // 获取 client 信息
      // const clientsDetail = {};
      // clients.forEach(client => {
      //   const _client = app.io.sockets.sockets[client];
      //   const _query = _client.handshake.query;
      //   clientsDetail[client] = _query;
      // });

      // 更新在线用户列表
      nsp.to(room).emit('online', {
        clients,
        action: 'leave',
        target: 'participator',
        message: `User(${id}) leaved.`,
      });
    });

  };
};
