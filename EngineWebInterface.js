const fs = require("fs")



webSynthesis = function (postStrUrl, text, cb) {

    console.log('synthesis', postStrUrl, text);
    let timeStart = new Date()
    //key = '&key=899jJ227XQ0X6369&'
    require('request').get({
        url: `https://${postStrUrl}/v3/voicevox/synthesis?text=${encodeURI(text)}&speaker=47`,
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (err, httpResponse, query) {
        let queryObj = JSON.parse(query)
        // queryObj.speedScale = 0.5
        // query = JSON.stringify(queryObj)
        if (err) {
            if (cb) cb(err)
        }
        if (queryObj.success) {
            tryDownload(text, queryObj.audioStatusUrl, queryObj.mp3DownloadUrl, cb, timeStart)
        } else {
            console.log(queryObj);
            if (cb) cb(queryObj)
        }

    });
}

let tryDownload = function (text, statusUrl, downloadUrl, cb, timeStart) {
    require('request').get({
        url: statusUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (err, httpResponse, result) {
        let resultObj = JSON.parse(result)
        if (resultObj.success && resultObj.isAudioReady) {

            require('request').get({
                url: downloadUrl,
                headers: {
                    'accept': 'audio/mp3'
                }

            }, function (err, httpResponse, body) {
                //console.log(JSON.parse(body).data.signal);
                // cb(JSON.parse(body).data.signal)
                // console.log(err);
                //console.log(body);
                if (timeStart) {
                    let timeEnd = new Date()
                    console.log('use time', (timeEnd - timeStart) / 1000);
                }
                if (cb) cb(err)
            })
                .pipe(fs.createWriteStream(`stream/${text}.mp3`));

        } else {
            if (resultObj.success && !resultObj.isAudioReady) {
                //console.log('wait...');
            } else {
                console.log('tryDownload err', resultObj);
                if (cb) cb(err)
                return;
            }

            setTimeout(() => {
                tryDownload(text, statusUrl, downloadUrl, cb, timeStart)
            }, 1000);
        }

    });
}

//synthesis('api.tts.quest', '十六歳の俺が竜王になって三ヶ月後に取った初めての弟子は小学生の女の子で、いろいろあって二人で暮らす事になった。')
// if (!err) {

// } else {
//     if (cb) cb(err)
// }