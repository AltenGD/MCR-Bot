const Discord = require('discord.js');
const fs = require('fs');
const gdclient = require('node-geometry-dash');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const GD = new gdclient();

fs.readdir('./commands/', (err, files) => {
  if(err) console.error(err);

  let cmds = files.filter(f => f.split('.').pop() === 'js');
  
  if(cmds.lenght <= 0) {
    return console.log('No command files found...');
  }

  console.log(`Loading ${files.length} commands...`);

  cmds.forEach((f, i) => {
    const command = require(`./commands/${f}`);
    console.log(`${i + 1}: ${f} loaded!`);
    client.commands.set(command.help.name, command);
  }); 
});

client.on('ready', () => {
    console.log(`Ready! logged in as ${client.user.tag}`);
    client.user.setActivity(`${client.guilds.get('440491741783523348').memberCount} People building`, {
        type: 'WATCHING'
    })
});

client.on('guildMemberAdd', () => {
    client.user.setActivity(`${client.guilds.get('440491741783523348').memberCount} People building`, {
        type: 'WATCHING'
    })
})

client.on('guildMemberRemove', () => {
    client.user.setActivity(`${client.guilds.get('440491741783523348').memberCount} People building`, {
        type: 'WATCHING'
    })
})

client.on('message', message => {
    let args = message.content.slice(process.env.prefix.length).trim().split(' ');
    let cmd = args.shift().toLowerCase();

    if (message.channel.id === "431522258452742191" || message.channel.id === "445538420945584148") {
        message.react("445539693954727953").then(mesg => {
            message.react("445539694957035530")
        });
    }

    if (message.author.bot) return;

    let entrylevel = message.content.split('\n');
    // Suggestion / vote channel
    if (message.channel.id === "451869794401255454" || message.channel.id === "466408542862180352") {
        if (!message.content.startsWith("<:blobcouncil:445538308483842048>")) {
            message.delete();
            message.reply("Please start with your message with <:blobcouncil:445538308483842048>").then(msg => {
                msg.delete(5000)
            });
            return;
        }
    
        message.react("445539693954727953").then(mesg => {
            message.react("445539694957035530")
        });
    }

    // Entries channel
    if (message.channel.id === "490545711797108776" || message.channel.id === "486773034490003457") {
        if (message.author.bot) return;

        if (!isNaN(entrylevel[1])) {
            let lvlID = entrylevel[1];
            console.log(lvlID);

            GD.levels(lvlID).then(level => {
                console.log(level);
                let embed = new Discord.RichEmbed()
                    .addField(`**${level[0].name} - ${level[0].author.name}**`, `${level[0].description}`)
                    .setFooter(`${level[0].id}, ${level[0].coins} coins, ${level[0].length}, ${level[0].downloads} downloads, ${level[0].likes} likes`, message.author.avatarURL);

                client.channels.get("445538420945584148").send(embed)
            })
            return;
        } else {
            return;
        }
    }

    if (!message.content.startsWith(process.env.prefix)) return;
  
    try {
        delete require.cache[require.resolve(`./commands/${cmd}.js`)]

        let commandFile = require(`./commands/${cmd}.js`);
        commandFile.run(client, message, args);
    } catch (e) {
        if (!fs.existsSync(`./commands/${cmd}.js`)) {
            message.channel.send(`${cmd} is not a valid command, please use ${process.env.prefix}help for a list of commands`)
            return
        }

        message.channel.send(`Sorry, there has been an error with ${cmd}, The owner of this bot has been notified of this error and will be fixing it later`);
        console.log(e.stack);

        let clonto = message.channel.client;
        let Alten = clonto.fetchUser('184061887212814336')
        .then(Alten => {
            Alten.send(`a \n\`\`\`js\n${e.stack}\`\`\``)
        })
    }
})

client.login(process.env.token);
