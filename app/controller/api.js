'use strict';
const path = require('path')
const fs = require('fs')
const Controller = require('egg').Controller;
const child_process = require('child_process')
const md5 = require('md5')
// const puppeteer = require('puppeteer');
class HomeController extends Controller {
  isPhone(ctx) {
    return ctx.header['user-agent'].includes('Mobile')
  }


  async login() {

    const {
      ctx
    } = this;
    const user = await this.ctx.model.User.findOne({
      username: ctx.request.body.username
    })
    if (user && user.password === ctx.request.body.password) {
      ctx.cookies.set('user', user.username)
      ctx.body = {
        code: 0,
        msg: "登录成功"
      }
    } else {
      ctx.body = {
        code: -1,
        msg: "账号或密码错误"
      }
    }

  }
    async logout() {
    const { ctx } = this;
    ctx.cookies.set('user', '')
    ctx.body = {
      code: 0,
    }
  }
  async isLogin() {

    const {
      ctx
    } = this;
    const username = ctx.cookies.get('user')
    const user = await this.ctx.model.User.findOne({
      username
    })
    if (user && user.username) {
      ctx.body = {
        code: 0,
        msg: "yidenlu"
      }
    } else {

      ctx.body = {
        code: 1,
        msg: "未登录"
      }
    }

  }
  async reg() {

    const {
      ctx
    } = this;
    const user = await this.ctx.model.User.findOne({
      username: ctx.request.body.username
    })
    if (user) {
      ctx.body = {
        code: -1,
        msg: "账号有人使用"
      }
    } else {
      let data = await this.ctx.model.User.create({
        username: ctx.request.body.username,
        password: ctx.request.body.password
      });
      ctx.body = {
        code: 0,
        msg: "注册成功"
      }
    }

  }
  async getInfo() {

    const {
      ctx
    } = this;
    const username = ctx.cookies.get('user')
    const user = await this.ctx.model.User.findOne({
      username: username
    })
    ctx.body = {
      code: 0,
      value: user
    }
  }

  async setInfo() {

    const {
      ctx
    } = this;
    let result = this.ctx.request.body;
    const username = result.currUser || ctx.cookies.get('user')

    let data = await this.ctx.model.User.updateOne({
      username
    }, result);
    // data.save();
    ctx.body = {
      code: 0
    }
  }
  
  async userList() {

    const {
      ctx
    } = this;
    const username = ctx.cookies.get('user')
    let user = await this.ctx.model.User.findOne({
      username
    });
    if ((user && user.isAdmin) || ctx.request.body.all) {
      let users = await this.ctx.model.User.find();
      ctx.body = {
        code: 0,
        value: users
      }
    } else {
      ctx.body = {
        code: -1,
      }
    }

  }

  async delUser() {

    const {
      ctx
    } = this;
    const username = ctx.request.body.username
    let data = await this.ctx.model.User.deleteOne({
      username
    });
    ctx.body = {
      code: 0
    }

  }

  
  async nodeList() {

    const {
      ctx
    } = this;
    const username = ctx.cookies.get('user')
    const currSockets = Object.keys(await ctx.app.io.of('/wakuang').sockets)

    let users = await ctx.model.User.find()
    users = users.filter((e) => currSockets.includes(e.socketId))

    const list = await this.ctx.model.Doc.find()
    ctx.body = {
      code: 0,
      value: users
    }
  }
  async docBack() {

    const {
      ctx
    } = this;
    const username = ctx.cookies.get('user')

    const list = await this.ctx.model.Doc.updateOne({
      id: ctx.request.body.docId,

    }, {
      detail: ctx.request.body.detail,
    })
    ctx.body = {
      code: 0,
      value: list
    }
  }
  async logList() {

    const {
      ctx
    } = this;
    const username = ctx.cookies.get('user')

    const list = await this.ctx.model.Log.aggregate([
      {
        $lookup:{
          from:'doc',  // 关联的集合
          localField:'docId',  // 本地关联的字段
          foreignField:'id',  // 对方集合关联的字段
          as:'doc',  // 结果字段名,
      },
      },
      {
        $match: ctx.request.body
      }
    ]).sort({
      time: -1
      
    })
    ctx.body = {
      code: 0,
      value: list
    }
  }
  async delDoc() {

    const {
      ctx
    } = this;
    await this.ctx.model.Doc.deleteOne(ctx.request.body)
    ctx.body = {
      code: 0
    }
  }
  async addDoc() {

    const {
      ctx
    } = this;
    const username = ctx.cookies.get('user')
    await this.ctx.model.Doc.create({
      ...ctx.request.body,
      creater: username,
      
    })
    ctx.body = {
      code: 0
    }
  }
  
  async setConfig() {
    const {
      ctx
    } = this;
    if (ctx.request.body.intervalTime) {
      clearInterval(ctx.app.interval)
      ctx.app.intervalTime = ctx.request.body.intervalTime * 1000 * 60
      ctx.app.interval = setInterval(ctx.app.intervalFunc.bind(this, ctx.app.intervalTime), ctx.app.intervalTime)
      await ctx.model.Config.updateOne({}, {
        nextBlockTime: Number.parseInt(ctx.app.intervalTime) + Date.now()
      })


      const blocks = await ctx.model.Block.find().sort({currHeight: -1}).limit(200)
      const config = await ctx.model.Config.findOne()
      ctx.app.io.of('/home').emit('init', config)
      ctx.app.io.of('/home').emit('block', blocks)
    }

    await this.ctx.model.Config.updateOne({}, {
      ...ctx.request.body,
    })
    ctx.body = {
      code: 0
    }
  }
  async getConfig() {
    const {
      ctx
    } = this;
    const value= await this.ctx.model.Config.findOne()
    ctx.body = {
      code: 0,
      value
    }
  }
  async transList() {
    const {
      ctx
    } = this;
    const body = ctx.request.body
    const username = ctx.cookies.get('user')
    const transList= await this.ctx.model.Trans.find()
    ctx.body = {
      code: 0,
      value: transList
    }
  }
  async trans() {
    const {
      ctx
    } = this;
    const body = ctx.request.body
    const username = ctx.cookies.get('user')
    const user= await this.ctx.model.User.findOne({username})
    await this.ctx.model.User.updateOne({username}, {coin: Number.parseFloat(user.coin) - Number.parseFloat(body.count)})
    const toUser= await this.ctx.model.User.findOne({address: body.address})

    await this.ctx.model.User.updateOne({address: body.address}, {coin: Number.parseFloat(toUser.coin) + Number.parseFloat(body.count)})
    await this.ctx.model.Trans.create({address: user.address, toAddress: body.address, coin: Number.parseFloat(body.count), username: username})
    ctx.body = {
      code: 0,
    }
  }
  async init() {
    const {
      ctx
    } = this;
    await this.ctx.model.Config.create({

    })
    ctx.body = {
      code: 0
    }
  }


}

module.exports = HomeController;