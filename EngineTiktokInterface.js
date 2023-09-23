const fs = require("fs")
const ffmpeg = require("fluent-ffmpeg")
const path = require("path")

let tempFilePath =  "../temp"
let fileStoragePath = './streamEn'

if (!fs.existsSync(tempFilePath)) {
    fs.mkdirSync(tempFilePath, { recursive: true })
}
if (!fs.existsSync(fileStoragePath)) {
    fs.mkdirSync(fileStoragePath, { recursive: true })
}


String.prototype.replaceAll = function (search, replacement) {
    // var target = this;
    // return target.replace(new RegExp(search, 'g'), replacement);
    var target = this;
    return target.split(search).join(replacement);
};


tiktokSynthesis = function (text, outputName, cb, voice) {

    console.log('tiktokSynthesis',text, outputName, voice);
    console.log('count', text.split(' ').join('').length); // no more then 245 char
    //let voice = "en_us_001"
    voice = voice ? voice : "en_female_emotional"
    //let voice = "jp_001"
    //let voice = "en_female_ht_f08_wonderful_world"
    //let voice = "en_female_f08_salut_damour"
    //let voice = "en_female_f08_warmy_breeze"
    //let voice = "en_female_ht_f08_glorious"

    let bodyObj = {
        text: (text),
        voice: voice
    }
    require('request').post({
        url: `https://tiktoktts.com/api/tiktok-tts`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyObj)
    }, function (err, httpResponse, query) {

        //console.log(query);
        if (query && query.indexOf("<") != 0) {

            var Readable = require('stream').Readable

            const imgBuffer = Buffer.from(JSON.parse(query).base64, 'base64')

            var s = new Readable()

            s.push(imgBuffer)
            s.push(null)

            s.pipe(fs.createWriteStream(outputName));
            if (cb) cb()

        } else {
            console.log('retry tiktok');
            setTimeout(() => {
                tiktokSynthesis(text, outputName, cb)
            }, 3000);
        }
    })
    //.pipe(fs.createWriteStream(`./data`));
}
