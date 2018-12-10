const cfg = require('../config.json')

exports.run = (client, message, args) => {
    let start = Date.now()

    message.channel.send(`Pong!`).then(function(newMsg) {
        let end = Date.now()
        
        newMsg.edit(`Pong! ${end - start}ms`)
    })
}

exports.help = {
    name: "Ping",
    desc: "Shows latency of the bot",
    usage: `${cfg.prefix}ping`,
    hidden: false,
    mod: false
}