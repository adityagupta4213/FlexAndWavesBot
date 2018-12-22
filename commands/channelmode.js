const fs = require('fs')
const path = require('path')
const handleError = require('../handlers/errorHandler.js')
const colors = require('../config/colors.json')
const modes = [0, 1, 2]

exports.run = (bot, message, [mode]) => {
  const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)

  if (!message.member.hasPermission(['ADMINISTRATOR'])) return handleError.run(bot, message, `You do not have the permissions to alter my configuration`, `Contact your server owner/administrator to obtain an "Administrator" level permission`)

  mode = parseInt(mode)
  if (modes.indexOf(mode) > -1) {
    let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
    if (mode === 0) {
      let activatedChannelIndex = settings.activatedChannels.findIndex(channel => channel.id === message.channel.id)
      
      if (activatedChannelIndex > -1) {
        settings.activatedChannels.splice(activatedChannelIndex, 1)
      }
    } else {
      let activatedChannelIndex = settings.activatedChannels.findIndex(channel => channel.id === message.channel.id)
      
      if (activatedChannelIndex > -1) {
        settings.activatedChannels[activatedChannelIndex].mode = mode
      } else {
        settings.activatedChannels.push({
          id: message.channel.id,
          mode: mode
        })
      }
    }
    fs.writeFile(filepath, JSON.stringify(settings), (e) => {
      if (e) {
        handleError.run(bot, message, `An error occured while trying to save the settings.`, `No details available`)
        console.log(e)
      } else {
        message.channel.send({
          embed: {
            color: parseInt(colors.green),
            title: 'Mode set successfully',
            description: `The channel mode was successfully set to "${modes[mode]}"`,
            author: {
              iconUrl: bot.user.avatarURL
            }
          }
        })
      }
    }) 
  } else return handleError.run(bot, message, `Incorrect parameter supplied`, `Please use one of the options listed below as the channel mode\n0 = No mode (no restrictions)\n1 = Text only\n2 = Attachments only`)
}