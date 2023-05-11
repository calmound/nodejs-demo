const express = require('express')
const { Sequelize, DataTypes, Op } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
})

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  age: DataTypes.NUMBER,
  sex: DataTypes.STRING
})

User.sync()

const app = express()
app.use(express.json())

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH')

  if (res.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.post('/users', async (req, res) => {
  const { name, sex, age } = req.body
  await User.create({ name, sex, age })
  return res.sendStatus(200)
})

app.get('/users', async (req, res) => {
  const { name, current } = req.query
  const offset = (current - 1) * 10
  let where = {}
  if (name) {
    where = { name: { [Op.like]: `%${name}%` } }
  }
  const { count: total, rows: users } = await User.findAndCountAll({ order: [['createdAt', 'DESC']], limit: 10, where, offset })
  return res.status(200).json({ total, users })
})

app.patch('/users/:id', async (req, res) => {
  const { name, sex, age } = req.body
  const { id } = req.params
  await User.update({ name, sex, age }, { where: { id } })
  return res.sendStatus(200)
})

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params
  await User.destroy({ where: { id } })
  res.sendStatus(200)
})

app.listen(3000, () => {
  console.log('server start port 3000')
})