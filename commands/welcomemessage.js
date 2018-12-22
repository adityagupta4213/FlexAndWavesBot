const fs = require('fs')
const path = require('path')
const handleError = require('../handlers/errorHandler.js')
exports.run = (bot, message, [...content]) => {
  if (!content) return handleError.run(bot, message, `Empty message`, `No welcome message provided.`)
  const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)
  let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
  if (!settings.welcomeChannel) return handleError.run(bot, message, `No welcome channel`, `You haven't set a welcome channel for me to send the messages!`)
  settings.welcomeMessage = content
  fs.writeFileSync(filepath, JSON.stringify(settings), err => {
    if (!err) message.channel.send({
      embed: {
        title: `Welcome channel successfully set to \`${channel.name}\``,
        color: parseInt(colors.green)
      }
    })
  })
}