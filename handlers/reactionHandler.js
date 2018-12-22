const fs = require('fs')
const path = require('path')

exports.run = (message) => {
  const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)
  let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
  let triggerIndex = settings.autoreact.findIndex(react => message.cleanContent.indexOf(react.trigger) > -1)
  if (triggerIndex > -1) {
    let emoji = null
    if (settings.autoreact[triggerIndex].custom) {
      emoji = message.guild.emojis.get(settings.autoreact[triggerIndex].emoji)
    } else {
      emoji = settings.autoreact[triggerIndex].emoji
    }
    message.react(emoji)
  } else return
}