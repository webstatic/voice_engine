const fs = require("fs")
const ffmpeg = require("fluent-ffmpeg")


const path = require("path")

ffmpeg.setFfmpegPath("../ffmpeg/ffmpeg.exe")

let tempFilePath = "../temp"
let fileStoragePath = './stream_128k_slow'
//let fileStoragePath = './stream_128k'


//"name":"ナースロボ＿タイプＴ"
//{"name":"ノーマル","id":47},{"name":"楽々","id":48},
let speakerId = 47

if (!fs.existsSync(tempFilePath)) {
    fs.mkdirSync(tempFilePath, { recursive: true })
}

if (!fs.existsSync(fileStoragePath)) {
    fs.mkdirSync(fileStoragePath, { recursive: true })
}


function isAudioFile(wavFilename) {
    const ext = path.extname(wavFilename);
    return ext === ".wav" || ext === ".mp3";
}

function convertWavToMp3(wavFilename, storePath, cb) {

    return new Promise((resolve, reject) => {
        if (!isAudioFile(wavFilename)) {
            throw new Error(`Not a Audio file`);
        }

        let newFileName = path.basename(wavFilename).replace(".wav", ".mp3")

        const outputFile = path.join(storePath, newFileName)// wavFilename.replace(".wav", ".mp3");

        ffmpeg({
            source: wavFilename,
        }).audioBitrate('128k')
            .on("error", (err) => {
                reject(err);
            }).on("end", () => {
                resolve(outputFile);
                if (cb) cb()
            }).save(outputFile);
    });
}

synthesis = function (postStrUrl, text, cb) {

    console.log('synthesis', postStrUrl, text);

    if (fs.existsSync(`${fileStoragePath}/${text}.mp3`)) {
        console.log('already exit');
        if (cb) cb()
        return;
    }

    let timeStart = new Date()
    require('request').post({
        url: `http://${postStrUrl}:50021/audio_query?text=${encodeURI(text)}&speaker=${speakerId}`,
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (err, httpResponse, query) {
        let queryObj = JSON.parse(query)
        queryObj.speedScale = 0.7
        queryObj.volumeScale = 2.5
        //console.log(queryObj);
        query = JSON.stringify(queryObj)

        if (!err) {
            let outputTempFile = `${tempFilePath}/${text}.wav`
            require('request').post({
                url: `http://${postStrUrl}:50021/synthesis?speaker=${speakerId}&enable_interrogative_upspeak=true`,
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'audio/wav',
                    'responseType': "stream"
                },
                "body": query,

            }, function (err, httpResponse, body) {
                //console.log(JSON.parse(body).data.signal);
                // cb(JSON.parse(body).data.signal)
                // console.log(err);
                //console.log(body);

                let timeEnd = new Date()
                console.log('use time', (timeEnd - timeStart) / 1000);

                if (!err) {
                    convertWavToMp3(outputTempFile, fileStoragePath, function () {
                        fs.unlink(outputTempFile, cb)
                    })
                } else {
                    if (cb) cb(err)
                }
            })
                //.pipe(fs.createWriteStream(`R:\\Temp\\${text}.wav`));
                .pipe(fs.createWriteStream(outputTempFile));

        } else {
            if (cb) cb(err)
        }
    });
}
