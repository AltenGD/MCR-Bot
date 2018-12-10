const GDClient = require('../GD/GD.js'), GD = new GDClient(), Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    const embed = new Discord.RichEmbed()

    let j = 1
    args = args.join(' ')

    GD.levels(args).then(levels => {
        if (isNaN(args)) {
            embed.setTitle(`<:info:453605020529721356> Found ${levels.length} different levels`)
            for (let lvl of levels) embed.addField(`${j++}. **${lvl.name} - ${lvl.author.name}** (${lvl.id})`, lvl.description || '(No description provided)')
        } else {
            let lvl = levels[0]

            embed.addField(`**${lvl.name} - ${lvl.author.name}** (${lvl.id})`, lvl.description || '(No description provided)')
            embed.setFooter(`${lvl.coins} coins, ${lvl.length}, ${lvl.downloads} downloads, ${lvl.likes} likes${lvl.rating ? `, ${lvl.rating}!` : ''}`)
            embed.setThumbnail(`https://raw.githubusercontent.com/AltenGD/MCR-Bot/master/Faces/${lvl.rating || 'Nonfeatured'}/${(lvl.demon ? 'Demon/' : '') + encodeURIComponent(lvl.difficulty.replace('/', ''))}.png`)
        }
        message.channel.send(embed)
    }).catch(error => message.reply('Sorry that was in invalid level.'))

}

module.exports.help = {
    name: 'Level',
    desc: 'Gets information on a level',
    usage: '!level <ID or Name>',
    hidden: false,
    mod: false
}