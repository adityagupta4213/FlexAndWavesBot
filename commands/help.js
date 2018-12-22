const helpArray = require('../config/help.json')
const colors = require('../config/colors.json')

exports.run = (bot, message, helpFor) => {
  helpFor = helpFor.join(' ').toLowerCase()
  if (helpFor) {
    let helpIndex = helpArray.findIndex(help => help.command === helpFor)

    if (helpIndex > -1) {
      message.channel.send({
        embed: {
          color: parseInt(colors.blue),
          description: `${helpArray[helpIndex].description}`,
          author: {
            name: `${helpArray[helpIndex].name}`
          },
          fields: [
            {
              'name': '__Syntax__',
              'value': `\`\`\`${helpArray[helpIndex].syntax}\`\`\``
            },
            {
              'name': '__Example__',
              'value': `\`\`\`${helpArray[helpIndex].example}\`\`\``
            }
          ]
        }
      })
    }
  } else {
    let fields = []
    for (let help of helpArray) {
      fields.push({
        name: `[${help.name}]`,
        value: `${help.description}
                \n__Syntax__: \`\`\`${help.syntax}\`\`\` __Example__: \`\`\`${help.example}\`\`\`
               `
      })
    }
    message.author.send({
      embed: {
        color: parseInt(colors.blue),
        description: `Here's the command guide\n\n`,
        author: {
          name: `COMMAND GUIDE`
        },
        fields: fields
      }
    }).then(
        message.channel.send({
          embed: {
            color: parseInt(colors.blue),
            description: `${message.author}, have a look at your inbox.`
          }
        })
      ).catch(e => { return message.reply(`Couldn't complete the operation due to ${e}`) })
  }
  
}
