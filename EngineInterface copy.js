const fs = require("fs")
const ffmpeg = require("fluent-ffmpeg")


const path = require("path")

ffmpeg.setFfmpegPath("../ffmpeg/ffmpeg.exe")

//"name":"ナースロボ＿タイプＴ"
//{"name":"ノーマル","id":47},{"name":"楽々","id":48 },
let speakerId = 47

let tempFilePath = "../temp"

let useSlow = false

let fileStoragePath = './stream'
if (useSlow) {
    fileStoragePath = './stream_slow'
}


let isPrepared = false

let configOption = {}
prepare_synthesis = function (option, cb) {

    if (option) {
        if (option.useSlow) {
            useSlow = option.useSlow
            fileStoragePath = './stream_slow'
        }

        if (option.fileStoragePath) {
            fileStoragePath = option.fileStoragePath
        }

        if (option.speakerId) {
            speakerId = option.speakerId
        }
    }

    if (!fs.existsSync(tempFilePath)) {
        fs.mkdirSync(tempFilePath, { recursive: true })
    }

    if (!fs.existsSync(fileStoragePath)) {
        fs.mkdirSync(fileStoragePath, { recursive: true })
    }
    isPrepared = true
    configOption = option
    if (cb) cb()
}

prepare_synthesis()

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
        }).audioBitrate('512k')
            .on("error", (err) => {
                reject(err);
            }).on("end", () => {
                resolve(outputFile);
                if (cb) cb()
            }).save(outputFile);
    });
}


function request_audio_query(postStrUrl, speakerId, text, cb) {
    require('request').post({
        url: `http://${postStrUrl}:50021/audio_query?text=${encodeURI(text)}&speaker=${speakerId}`,
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (err, httpResponse, body) {
        cb(err, httpResponse, body)
    })
}


const Kuroshiro = require("kuroshiro").default
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const kuroshiro = new Kuroshiro();

let isKuroshroInited = false

function initKuroshro(cb) {
    kuroshiro.init(new KuromojiAnalyzer())
        .then(function () {
            isKuroshroInited = true
            if (cb) cb()
        })

}

//fix problem of wrong interpret kanji from voicevox
//compare kana with own lib
//if it same then noting wrong
//  if it different then
//  1.easy way is just use own lib but accent_phrases may be wrong
//  2.compare witch part is different and just change that one

function recheckKana(text, kana, cb) {

    if (isKuroshroInited) {
        kuroshiro.convert(text, { mode: "normal", to: "katakana" }).then(function (result) {
            console.log('result == kana', result, kana);
            if (result == kana) {
                cb()
            } else {
                kuroshiro.convert(text, { mode: "normal", to: "hiragana" }).then(function (result) {
                    cb(result)
                })
            }
        })
    } else {
        initKuroshro(function (params) {
            recheckKana(text, kana, cb)
        })
    }

}


function convertToKana(text, cb, isPass) {
    if (isPass) {
        cb(text)
        return
    }

    if (isKuroshroInited) {
        kuroshiro.convert(text, { mode: "normal", to: "hiragana" }).then(function (result) {
            console.log('convertToKana', text, result);
            cb(result)
        })
    } else {
        initKuroshro(function () {
            convertToKana(text, cb)
        })
    }
}
function request_synthesis(postStrUrl, speakerId, query, outputTempFile, cb) {

    require('request').post({
        url: `http://${postStrUrl}:50021/synthesis?speaker=${speakerId}&enable_interrogative_upspeak=true`,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'audio/wav',
            'responseType': "stream"
        },
        "body": query,

    }, function (err, httpResponse, body) {
        if (cb) cb(err, httpResponse, body)
    }).pipe(fs.createWriteStream(outputTempFile));

}

function startSynthesis(postStrUrl, queryObj, text, timeStart, cb) {

    if (useSlow) {
        queryObj.speedScale = 0.7
    }

    queryObj.volumeScale = 2.5

    //queryObj.outputSamplingRate = 24000*2
    //console.log(queryObj.outputSamplingRate);
    //console.log(queryObj);
    query = JSON.stringify(queryObj)


    let outputTempFile = `${tempFilePath}/${text}.wav`

    request_synthesis(postStrUrl, speakerId, query, outputTempFile, function (err, httpResponse, body) {
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
}

synthesis = function (postStrUrl, text, cb) {

    console.log('synthesis', postStrUrl, text);

    if (fs.existsSync(`${fileStoragePath}/${text}.mp3`)) {
        console.log('already exit');
        if (cb) cb()
        return;
    }

    convertToKana(text, function (newText) {
        let timeStart = new Date()
        request_audio_query(postStrUrl, speakerId, newText, function (err, httpResponse, query) {
            if (!err) {
                let queryObj = JSON.parse(query)

                //console.log(queryObj.kana);
                // if (newText) {
                startSynthesis(postStrUrl, queryObj, text, timeStart, cb)
                // } else {
                //     recheckKana(text, queryObj.kana, function (newText) {
                //         if (!newText) {
                //             console.log('same');
                //             startSynthesis(postStrUrl, queryObj, text, timeStart, cb)
                //         } else {
                //             console.log('recur synthesis', text, newText);
                //             synthesis(postStrUrl, text, cb, newText)
                //         }
                //     })
                // }


            } else {
                if (cb) cb(err)
            }
        });
    }, !configOption.convertToKana)

}
