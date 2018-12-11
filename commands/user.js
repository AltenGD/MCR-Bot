const GDclient = require('node-geometry-dash');
const IC = require('../icons/colours.json');
const jimp = require('jimp');
const GD = new GDclient();
const fs = require('fs');

module.exports.run = async(client, message, args) => {
    let daUser = args[0];
    if(args[1]) {
        for(i = 1; i < args.length; i++) {
            daUser = daUser + " " + args[i];
        }
    }

    GD.users(daUser).then(usr => {
        GD.user(usr[0].extID).then(user => { 
            console.log(user)
            message.channel.send('Creating image...')
            .then(msg => {
                msg.delete(3000)
              })

            var img = ['./imgs/bg.png', './imgs/bg1.png', './imgs/overlay.png']
            let jimps = [];
            
            fs.readdir('./icons/icons/', (err, files) => {
                files.forEach(file => {
                    let fileName = file.slice(0, -4)

                    if (fileName == user.icons.cube) {
                        img.push(`${file}`);
                        img.push(`.${fileName}secondary.png`);
                    }
                })
            })

            setTimeout (function() {
                for (var i in img) {
                    jimps.push(jimp.read(img[i]))
                }

                Promise.all(jimps).then(data => {
                    return Promise.all(jimps);
                }).then(data => {
                    data[0].color([ 
                        { apply: 'mix', params: [`#${IC.colour[user.colors.secondary]}`] }
                    ])

                    data[1].color([
                        { apply: 'mix', params: [`#${IC.colour[user.colors.primary]}`] }
                    ])

                    //shits broken dont uncomment
                    // data[3].color([ 
                    //     { apply: 'mix', params: [`#${IC.colour[user.colors.primary]}`] }
                    // ])

                    // data[4].color([
                    //     { apply: 'mix', params: [`#${IC.colour[user.colors.secondary]}`] }
                    // ])

                    data[0].composite(data[1], 0, 0)
                    //data[0].blur(20)
                    data[0].composite(data[2], 0, 0)
                    //same thing for this
                    // data[0].composite(data[3], 693, 10)
                    // data[0].composite(data[4], 693, 10)
                    
                    data[0].write(`imgs/img.png`);
                })
            }, 1000)

            setTimeout (function() {
                jimp.read('./imgs/img.png')
                .then(image => {
                    loadedImage = image;
                    return jimp.loadFont('./commands/font/font500.fnt');
                })
                .then(font => {
                    loadedImage.print(font, 10, 5, `${user.username}`)
                    .write('imgs/img.png');
                })
                .catch(function (err) {
                    console.error(err);
                });
            }, 2800)

            setTimeout (function() {
                jimp.read('./imgs/img.png')
                .then(image => {
                    loadedImage = image;
                    return jimp.loadFont('./commands/font/font700.fnt');
                })
                .then(font => {
                    loadedImage.print(font, 10, 211, `${user.demons} Demons, ${user.coins} Official coins, ${user.userCoins} User coins`)
                    loadedImage.print(font, 10, 240, `${user.diamonds} diamonds, ${user.stars} Stars, ${user.creatorPoints} CP`)
                    .write('imgs/img.png');
                })
                .catch(function (err) {
                    console.error(err);
                });

                jimp.read('./imgs/img.png')
                .then(image => {
                    loadedImage = image;
                    return jimp.loadFont('./commands/font/font300.fnt');
                })
                .then(font => {
                    loadedImage.print(font, 10, 450, `keep in mind that this is still under development and that more will be added in the near future`)
                    .write('imgs/img.png');
                })
                .catch(function (err) {
                    console.error(err);
                });
            }, 2800)

            setTimeout (() => {
                message.channel.send({
                    file: './imgs/img.png'
                })
                console.log("Sent message");
            }, 3500)

        })
    }).catch(() => message.reply(`Invalid user, please provide a valid user`))
}

module.exports.help = {
    name: "User",
    desc: "Gets information about a user",
    usage: `!user <ID or Name>`,
    hidden: false,
    mod: false
}
