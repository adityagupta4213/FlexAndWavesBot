const fs = require('fs')
const path = require('path')
const intro = require('../commands/intro.js')
const colors = require('../config/colors.json')

exports.run = (bot, member) => {
  const filepath = path.normalize(`${__dirname}/../data/${member.guild.id}.json`)
  let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
  const welcomeChannel = member.guild.channels.find('id', settings.welcomeChannel)
  let count = member.guild.memberCount
  // Get the last digit separated and +1 the lastDigit since the actual member lastDigit gets incremented by 1 when a new member joins
  lastDigit = parseInt(count%10 + 1)
  // Determine the superscript for the member lastDigit
  let superscript
  if (count <= 10) {
    switch (lastDigit) {
      case 1:
        superscript = 'st'
        break
      case 2:
        superscript = 'nd'
        break
      case 3:
        superscript = 'rd'
        break
      default:
        superscript = 'th'
        break
    }
  } else {
    superscript = 'th'
  }

  welcomeChannel.send({
    embed: {
      color: parseInt(colors.blue),
      description: `${member.user}, **Welcome to ${member.guild.name}**! You are the ${member.guild.memberCount+ 1}${superscript} member!` + '\n' + settings.welcomeMessage,
      thumbnail: {
        url: member.user.avatarURL
      },
      author: {
        name: 'WELCOME'
      }
    }
  })
  .then(
    welcomeChannel.send({
      embed: {
        title: `New to this world?`,
        description: `Are you new to Discord and would like any help? Click the corresponding icon under this message to reply!`,
        color: parseInt(colors.blue),
        fields: [
          {
            name: 'Yes',
            value: '✅',
            inline: true
          },
          {
            name: 'No',
            value: '❌',
            inline: true
          }
        ]
      }
    })
    .then(message => {
      message.react('✅').then(() => message.react('❌'))
      const filter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === member.user.id
      }
      message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first()
        if (reaction.emoji.name === '✅') {
            message.reply('Check your inbox for further info!')
            .then(() => {
              member.send({
                embed: {
                  title: `Welcome to Discord!`,
                  description: `I'm here to give you a quick intro to what Discord is and how does it work. Click the ✅ button after each module to indicate that you've understood the part. Don't worry if you can't answer now, you have upto 3 days to click that button and if you miss out on that as well, you can use the \`intro\` command in the server I'm in to restart the guide!`,
                  color: parseInt(colors.blue)
                }
              }).then(intro.run(bot, member.user))
            })
        }
        else {
            message.reply('We see you\'re not new to the game! Thank you for your time!')
        }
      })
    })
  ).catch (err => {
    console.log(err)
  })
}