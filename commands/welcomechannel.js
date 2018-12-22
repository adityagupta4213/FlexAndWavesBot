const fs = require('fs')
const path = require('path')
const handleError = require('../handlers/errorHandler.js')
exports.run = (bot, message) => {
  let channel = message.mentions.channels.first()
  if (!channel || !message.guild.channels.find('id', channel.id)) return handleError.run(bot, message, `Invalid channel`, `The channel you specified does not exist on this server.`)
  const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)
  let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
  settings.welcomeChannel = channel.id
  fs.writeFileSync(filepath, JSON.stringify(settings), err => {
    if (!err) message.channel.send({
      embed: {
        title: `Welcome channel successfully set to \`${channel.name}\``,
        color: parseInt(colors.green)
      }
    })
  })
}