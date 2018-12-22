const colors = require('../config/colors.json')

exports.run = (bot, message, desc, errorDetails) => {
  message.channel.send({
    embed: {
      color: parseInt(colors.red),
      title: 'An unexpected error occurred',
      description: `${desc}`,
      thumbnail: {
        url: 'https://res.cloudinary.com/daemonad/image/upload/v1536387310/32x32_xizb2s.png'
      },
      fields: [
        {
          name: 'Details',
          value: errorDetails || 'Unavailable'
        }
      ],
      author: {
        iconUrl: bot.user.avatarURL
      }
    }
  })
}
