const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { Sequelize, DataTypes } = require('sequelize')

const app = new Koa()
app.use(bodyParser())

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')

  ctx.set('Access-Control-Allow-Headers', 'Content-Type')

  if (ctx.method === 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
})

const User = sequelize.define('User', {
  username: DataTypes.STRING,
  password: DataTypes.STRING
})

User.sync()

app.use(async ctx => {
  if (ctx.url === '/login' && ctx.method === 'POST') {
    const { username, password } = ctx.request.body
    const user = await User.findOne({ where: { username, password } })
    if (user) {
      ctx.body = { username: user.username }
    } else {
      ctx.body = { username: '账号密码错误' }
    }
  }
  else if (ctx.url === '/registry' && ctx.method === 'POST') {
    const { username, password } = ctx.request.body
    const user = await User.create({ username, password })
    ctx.body = { success: true }
  }
  else if (ctx.url === '/users' && ctx.method === 'GET') {
    const users = await User.findAll()
    ctx.body = { users: users.map(item => item.username) }
  }
})


app.listen(3000, () => {
  console.log('server start port 3000')
})