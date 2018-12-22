const fs = require('fs')
const path = require('path')
const handleError = require('../handlers/errorHandler.js')
const colors = require('../config/colors.json')

exports.run = (bot, message, [value]) => {
  const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)
  if (typeof (value) === 'object' && value.length > 1) {
    return handleError(bot, message, `You cannot have spaces in the prefix`, '')
  }
  const guild = message.guild
  let settings = JSON.parse(fs.readFileSync(filepath, 'utf8'))

  settings.prefix = value

  fs.writeFile(filepath, JSON.stringify(settings), err => {
    if (!err) message.channel.send({
      embed: {
        title: `Prefix was successfully set to ${value}`,
        color: parseInt(colors.green)
      }
    })
  })
}
