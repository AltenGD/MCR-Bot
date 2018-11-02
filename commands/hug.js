exports.run = (client, message, args) => {
    if (args[0]) {
      message.channel.send(`<:huggin:476469165675249674> ${args[0]}`)
    } else {
      message.channel.send(`<:huggin:476469165675249674> ${message.author}`)
    }
}

exports.help = {
    name: "Hug",
    desc: "Hugs the selected user (or yourself)",
    usage: `${process.env.prefix}hug [@user]`,
    hidden: false,
}
