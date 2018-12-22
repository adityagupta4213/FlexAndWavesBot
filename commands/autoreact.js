const fs = require('fs')
const path = require('path')
const handleError = require('../handlers/errorHandler.js')
const colors = require('../config/colors.json')

exports.run = (bot, message, [trigger, savedTrigger]) => {
  if (!message.member.hasPermission(['ADMINISTRATOR'])) return handleError.run(bot, message, `You do not have the permissions to alter my configuration`, `Contact your server owner/administrator to obtain an "Administrator" level permission`)

  if (typeof trigger !== 'string') return handleError.run(bot, message, `Incorrect parameter`, `Please provide a valid trigger keyword`)

  if (trigger === 'remove') {
    if (!savedTrigger) return handleError.run(bot, message, `No trigger word provided`, `Please provide a keyword that has already been set to remove it.`)

    const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)
    let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
    let triggerIndex = settings.autoreact.findIndex(react => react.trigger === savedTrigger)      

    if (triggerIndex > -1) {
      settings.autoreact.splice(triggerIndex, 1)
      return fs.writeFile(filepath, JSON.stringify(settings), (e) => {
        if (e) {
          handleError(bot, message, 'An error occurred', 'A critical error occurred while saving the settings. Please try executing the command again')
          console.log(e)
        } else {
          message.channel.send({
            embed: {
              color: parseInt(colors.green),
              title: 'Reaction removed successfully',
              description: `Reaction successfully removed from ${savedTrigger}`,
              author: {
                iconUrl: bot.user.avatarURL
              }
            }
          })
        }
      })
    } else return handleError.run(bot, message, `Reaction doesn't exist`, `Reaction to the given trigger was not found.`)
  } 

  const messageAuthorID = message.author.id

  message.channel.send({
    embed: {
      title: `Autoreact`,
      description: `React to this message with an emoji to set it for the trigger word`,
      color: parseInt(colors.blue),
      fields: [
        {
          name: 'Trigger',
          value: trigger
        },
        {
          name: 'Emoji',
          value: 'None'
        }
      ]
    }
  }).then((message)=> {
    message.awaitReactions((reaction, user) => {
      return user.id === messageAuthorID
    }, { max: 1, time: 60000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first()
        console.log(reaction)
        const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)
        let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
        let triggerIndex = settings.autoreact.findIndex(react => react.trigger === trigger)
        console.log(reaction)
        if (triggerIndex > -1) {
          // Custom emojis have an id while default ones return null for some weird reason
          settings.autoreact[triggerIndex].custom = reaction.emoji.id ? true : false
          settings.autoreact[triggerIndex].emoji = reaction.emoji.id || reaction.emoji.name          
        } else {
          settings.autoreact.push({
            trigger, 
            emoji: reaction.emoji.id || reaction.emoji.name,
            custom: reaction.emoji.id ? true : false
          })
        }
        fs.writeFile(filepath, JSON.stringify(settings), (e) => {
          if (e) {
            handleError(bot, message, 'An error occurred', 'A critical error occurred while saving the settings. Please try executing the command again')
            console.log(e)
          } else {
            message.edit({
              embed: {
                title: `Autoreact set successfully`,
                description: `I will react with ${message.guild.emojis.get(reaction.emoji.id)} on "${trigger}"`,
                color: parseInt(colors.green),
                fields: [
                  {
                    name: 'Trigger',
                    value: trigger
                  },
                  {
                    name: 'Emoji',
                    value: reaction.emoji.toString()
                  }
                ]
              }
            })
          }
        })
    })
    .catch(collected => {
        message.reply(`Timeout for adding a reaction.`);
    })
  })

}
