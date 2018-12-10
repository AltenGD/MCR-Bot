const request = require('request'), database = 'http://boomlings.com/database'

class getLevel {
    /**
     * Gets information on a level
     * @param {string} str
     * @param {number} diff
     * @param {number} len
     * @param {number} page
     * @param {number} total
     * @param {number} uncompleted
     * @param {number} completed
     * @param {number} featured
     * @param {number} original
     * @param {number} twoPlayer
     * @param {number} coins
     * @param {number} epic
     * @param {number} star
     * @param {number} type
     * @example Levels('Emit', '2', '1')
     * @returns JSON
     */
    levels(str, diff, len, page, total, uncompleted, completed, featured, original, twoPlayer, coins, epic, star, type) {
        return new Promise((res, rej) => {
            request.post({
                url: `${database}/getGJLevels21.php`,
                form: {
                    gameVersion: '21',
                    binaryVersion: '35',
                    str: str || '',
                    diff: diff || '-',
                    len: len || '-',
                    page: page || '0',
                    total: total || '0',
                    type: type || '0',
                    uncompleted: uncompleted || '0',
                    completed: completed || '0',
                    featured: featured || '0',
                    original: original || '0',
                    twoPlayer: twoPlayer || '0',
                    coins: coins || '0',
                    epic: epic || '0',
                    star: star || '0',
                    secret: 'Wmfd2893gb7'
                }
            }, (e, r, b) => {
                if (b == '-1') {
                    rej()
                } else {

                    let [levels, author, songs] = b.split('#'), lvlarr = [],
                    diffArr = ['N/A', 'Easy', 'Normal', 'Hard', 'Harder', 'Insane', 'Demon', 'Easy Demon', 'Medium Demon', 'Hard Demon', 'Insane Demon', 'Extreme Demon']

                    author = author.split('|').map(a => a.split(':'))
                    songs = songs.split(':').map(s => s.split('~|~'))

                    for (let lvl of levels.split('|')) {
                        const lvlData = lvl.split(':'), lengtharr = ['Tiny', 'Short', 'Medium', 'Long', 'XL'],
                        parsedData = {
                            name: lvlData[3],
                            id: lvlData[1],
                            author: {
                                name: '',
                                id: lvlData[7]
                            },
                            difficulty: lvlData[25] ? 'Auto' : diffArr[lvlData[11] / 10 + (lvlData[21] ? 6 : 0)],
                            downloads: lvlData[13],
                            likes: lvlData[19],
                            stars: lvlData[27],
                            demon: !!lvlData[21],
                            rating: +lvlData[31] ? 'Epic' : +lvlData[29] ? 'Featured' : '',
                            description: new Buffer(lvlData[35].toString(), 'base64').toString(),
                            coins: lvlData[43],
                            version: lvlData[5],
                            verifiedCoins: lvlData[43] == 1,
                            requestedStars: lvlData[45],
                            length: lengtharr[lvlData[37]]
                        }

                        for (let a of author) {
                            if (a[0] == lvlData[7]) {
                                parsedData.author.name = a[1]
                            }
                        }

                        if (lvlData[53] != '0') {
                            for (let song of songs) {
                                if (song[1] == lvlData[53]) {
                                    parsedData.song = {
                                        name: song[3],
                                        author: song[7],
                                        id: song[1],
                                        size: song[9] + 'MB',
                                        url: decodeURIComponent(song[13])
                                    }
                                }
                            }
                        } else {
                            let mainSongs = [
                                ['Stereo Madness', 'ForeverBound'],
                                ['Back On Track', 'DJVI'],
                                ['Polargeist', 'Step'],
                                ['Dry Out', 'DJVI'],
                                ['Base After Base', 'DJVI'],
                                ['Cant Let Go', 'DJVI'],
                                ['Jumper', 'Waterflame'],
                                ['Time Machine', 'Waterflame'],
                                ['Cycles', 'DJVI'],
                                ['xStep', 'DJVI'],
                                ['Clutterfunk', 'Waterflame'],
                                ['Theory of Everything', 'DJ-Nate'],
                                ['Electroman Adventures', 'Waterflame'],
                                ['Clubstep', 'DJ-Nate'],
                                ['Electrodynamix', 'DJ-Nate'],
                                ['Hexagon Force', 'Waterflame'],
                                ['Blast Processing', 'Waterflame'],
                                ['Theory of Everything 2', 'DJ-Nate'],
                                ['Geometrical Dominator', 'Waterflame'],
                                ['Deadlocked', 'F-777'],
                                ['Fingerbang', 'MDK']
                            ],
                            song = mainSongs[lvlData[15]]
                            parsedData.song = {
                                name: song[0],
                                author: song[1],
                                id: lvlData[15],
                                size: null,
                                url: null
                            }
                        }
                        lvlarr.push(parsedData)
                    }
                    res(lvlarr)
                }
            })
        })
    }

    /**
     * Gets information on a user | NOT DONE YET
     * @param {string} str
     * @param {number} total
     * @param {number} page - Currently not working because of the state of the server currently
     * @example Users('Optical', '2', '1')
     * @returns JSON
     */
    Users(str, total, page) {
        return new Promise((res, rej) => {
            request.post({
                url: `${database}/getGJUsers20.php`,
                form: {
                    gameVersion: '21',
                    binaryVersion: '35',
                    str: str || '',
                    page: page || '0',
                    total: total || '0',
                    secret: 'Wmfd2893gb7'
                }
            }, (e, r, b) => {
                if (b == '-1') rej()
                else {
                    let users = b.split('#')[0].split('|').map(u => u.split(':')), userarr = []
                    for (let user of users) {
                        userarr.push({
                            username: user[1],
                            id: user[3],
                            coins: user[5],
                            userCoins: user[7],
                            stars: user[23],
                            demons: user[27],
                            creatorPoints: user[25],
                            extID: user[21]
                        })
                    }
                    res(userarr)
                }
            })
        })
    }
}

module.exports = getLevel