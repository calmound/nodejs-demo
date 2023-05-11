const Koa = require('koa')
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
})
const app = new Koa()

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING
  },
  age: {
    type: DataTypes.NUMBER
  },
})
console.log(User === sequelize.models.User) // true

class Class extends Model { }
Class.init({
  name: {
    type: DataTypes.STRING
  },
  age: {
    type: DataTypes.NUMBER
  },
}, {
  sequelize, // Sequelize的实例
  modelName: 'ClassAndGrade' // Model名字
})

app.listen(3000, () => {
  console.log('start port 3000')
})