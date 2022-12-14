'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;

  router.get('/', controller.home.index);
  router.get('/init', controller.api.init);


  router.post('/api/login', controller.api.login);
  router.post('/api/logout', controller.api.logout);
  router.post('/api/reg', controller.api.reg);
  router.get('/api/isLogin', controller.api.isLogin);
  router.get('/api/getInfo', controller.api.getInfo);
  router.post('/api/setInfo', controller.api.setInfo);
  router.post('/api/userList', controller.api.userList);
  router.post('/api/delUser', controller.api.delUser);

  router.post('/api/nodeList', controller.api.nodeList);
  router.post('/api/logList', controller.api.logList);
  router.post('/api/docBack', controller.api.docBack);
  router.post('/api/delDoc', controller.api.delDoc);
  router.post('/api/addDoc', controller.api.addDoc);
  router.post('/api/setConfig', controller.api.setConfig);
  router.post('/api/getConfig', controller.api.getConfig);
  router.post('/api/trans', controller.api.trans);
  router.post('/api/transList', controller.api.transList);


  router.post('/common/upload', controller.common.upload);



  io.of('/file').route('save', io.controller.io.save)

};
