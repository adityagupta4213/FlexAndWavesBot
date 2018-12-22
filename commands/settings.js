const fs = require('fs')
const path = require('path')
const colors = require('../config/colors.json')

function convertChannelModeToName (mode) {
  if (mode === 1) {return 'Text only'} 
  else if (mode === 2) {return 'Attachments only'}
}

exports.run = (bot, message) => {
  const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)
  let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
  let channelModes = []
  let autoReacts = []
  for (let channel of settings.activatedChannels) {
    let channelData = message.guild.channels.find('id', channel.id)
    channelModes.push(`__${channelData.name}__ -> ${channel.mode}\n\n`)
  }
  for (let react of settings.autoreact) {
    let emoji = null
    if (react.custom) {
      emojiData = message.guild.emojis.get(react.emoji)
      emoji = emojiData.toString()
    } else {
      emoji = react.emoji
    }
    autoReacts.push(`__${react.trigger}__ -> ${emoji}\n\n`)
  }
  if (channelModes.length <= 0) channelModes.push('No channel modes set')
  if (autoReacts.length <= 0) autoReacts.push('No automatic reactions set')
  return message.channel.send({
    embed: {
      title: `Settings`,
      description: `Here are my settings for your server`,
      color: parseInt(colors.blue),
      fields: [
        {
          name: 'Prefix',
          value: settings.prefix
        },
        {
          name: 'Channel Modes',
          value: `${channelModes}`,
          inline: true
        },
        {
          name: 'Automatic Reactions',
          value: `${autoReacts}`,
          inline: true
        }
      ]
    }
  })
}