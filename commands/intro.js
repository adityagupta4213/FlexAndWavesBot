const colors = require('../config/colors.json')
const docs = require('../config/documentation.json')
let docsArrayIndex = 0

exports.run = function sendIntro (bot, author) {  
  author.send({
    embed: {
      title: docs[docsArrayIndex].name,
      description: docs[docsArrayIndex].content,
      color: parseInt(colors.blue),
      thumbnail: {
        url: docs[docsArrayIndex].image
      }
    }
  }).then(message => {
    message.react('✅')
    const filter = (reaction, user) => {
      return ['✅'].includes(reaction.emoji.name) && user.id !== bot.user.id
    }
    message.awaitReactions(filter, { max: 1, time: 60000*60*24*3, errors: ['time'] })
    .then(collected => {
      const reaction = collected.first()
      if (reaction.emoji.name === '✅') {
        sendIntro(bot, author)
        docsArrayIndex++
      }
    })
  })
}
