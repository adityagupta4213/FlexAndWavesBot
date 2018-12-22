exports.run = (bot) => {
  console.log('Online!')
  bot.user.setPresence({ game: { name: `!!help for help`, type: 0 } })
}
