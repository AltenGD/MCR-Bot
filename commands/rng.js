module.exports.run = async(client, message, args) => {
    let rng

    if (args.length > 1) {
        let min = parseInt(args[0]), 
            max = parseInt(args[1])

        rng = Math.floor(Math.random() * (max - min + 1) ) + min;
    } else if (args[0]) {
        rng = Math.round(Math.random() * args[0])
    } else {
        rng = Math.round(Math.random().toString())
    }

    message.channel.send(rng)
}

module.exports.help = {
    name: "rng",
    desc: "Generates a random number",
    usage: "!RNG [min number] <max number>",
    hidden: false,
    mod: false
}