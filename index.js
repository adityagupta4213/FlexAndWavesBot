const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')
const intro = require('./commands/intro.js')
const handleError = require('./handlers/errorHandler.js')
const reactionHandler = require('./handlers/reactionHandler.js')
const settingsTemplate = require('./config/settingsTemplate.json')
const colors = require('./config/colors.json')
require('dotenv').config()

const bot = new Discord.Client({
  autoReconnect: true
})

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`)
    let eventName = file.split('.')[0]
    bot.on(eventName, (...args) => eventFunction.run(bot, ...args))
  })
})

bot.on('message', message => {
  if (message.author.bot) return

  let prefix = process.env.PREFIX
  if (message.guild) {
    let folderpath = `${__dirname}/data/`
    let filename = `${message.guild.id}.json`
    let filepath = folderpath + filename
    try {
      let settings = JSON.parse(fs.readFileSync(filepath, 'utf8'))
      prefix = settings.prefix
    } catch (e) {
    if (!fs.existsSync(folderpath)) fs.mkdirSync(folderpath)
      fs.writeFileSync(filepath, JSON.stringify(settingsTemplate))
      handleError.run(bot, message, `The bot prefix has been reset to \`${process.env.PREFIX}\` due to an internal error`, `The required server configuration data could not be found`)
      console.log(e)
    }
  } else if (!message.guild && message.content === 'intro') return intro.run(bot, message.author)

  if (!message.content.startsWith(prefix)) return

  let args = message.content.slice(prefix.length).trim().split(/ +/g)
  let command = args.shift().toLowerCase()

  for (let i in args) {
    if (args[i].startsWith(prefix)) {
      args = 0
      command = 0
      return handleError.run(bot, message, `Incorrect Syntax for the command`, `You supplied the bot prefix as a parameter to the command. Please type \`${prefix}help\` to get the command guide delivered to your inbox.`)
    }
  }
  try {
    let commandFile = require(`./commands/${command}.js`)
    commandFile.run(bot, message, args)
  } catch (e) {
    console.log(e)
    handleError.run(bot, message, `Command not found`, `Please type \`${prefix}help\` to get the command guide delivered to your inbox.`)
  }
})

bot.login(process.env.TOKEN)
