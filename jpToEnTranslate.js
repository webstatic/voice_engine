let loki = require("lokijs")
// jpToEnObject = require("./jpToEnObject.json")

// saveData = function () {
//     const fs = require("fs")
//     console.log('save data');
//     fs.writeFileSync("./jpToEnObject.json", JSON.stringify(jpToEnObject))
// }

jpToEnExcelApi = function (text, cb) {
    let url = `https://api.excelapi.org/translate/jaen?text=`
    //let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q="
    require('request').get({
        url: url + encodeURI(text),
    }, function (err, httpResponse, body) {

        // if (body && body.indexOf("[") == 0) {
        //     if (cb) cb(JSON.parse(body)[0][0][0])
        if (body && body.indexOf("<") != 0) {
            if (cb) cb(body)

        } else {
            console.log('retry exel', text);
            setTimeout(() => {
                jpToEnExcelApi(text, cb)
            }, 3000);
        }
    })
}

jpToEnGoogleApi = function (text, cb) {

    let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&otf=1&ssel=0&tsel=0&&dt=t&dt=at&dt=md&q="
    require('request').get({
        url: url + encodeURI(text),
    }, function (err, httpResponse, body) {

        if (body && body.indexOf("[") == 0) {
            let bodyObj = JSON.parse(body);
            // console.log(bodyObj[5][0][2][0][0]);
            // console.log(bodyObj[5][0][2][1][0]);
            //if (cb) cb(JSON.parse(body)[0][0][0])
            if (cb) cb([bodyObj[5][0][2][0][0], bodyObj[5][0][2][1][0]])
        } else {
            console.log('retry google', text);
            setTimeout(() => {
                jpToEnGoogleApi(text, cb)
            }, 3000);
        }
    })
}

//jpToEnGoogleApi("授業は何時に始まりますか。")
loadTranslateOfFileName = function (inputPath) {
    const fs = require("fs")
    const Path = require("path");
    const async = require("async")
    let Files = [];

    function ThroughDirectory(Directory) {
        fs.readdirSync(Directory).forEach(File => {
            const Absolute = Path.join(Directory, File);
            if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
            else return Files.push(Absolute);
        });
    }

    var db = new loki('./jpToEnObject.db');
    db.loadDatabase({}, function () {
        var JpToEnCollection = db.getCollection('JpToEn');
        if (!JpToEnCollection) {
            JpToEnCollection = db.addCollection('JpToEn')
        }
        //JpToEnCollection.removeDataOnly()


        ThroughDirectory(inputPath);

        let count = 0
        async.eachSeries(Files, function (filePath, callback) {
            console.log(++count, Files.length);
            let fileName = Path.basename(filePath).replace(".mp3", "").replace(".wav", "")

            var results = JpToEnCollection.findOne({ text: fileName });
            if (results) {
                //results.gg = "newww"
                //JpToEnCollection.update(results)
                console.log('already exit', results);
                callback()
                return
            }
            let insertObj = {
                text: fileName,
            }

            // if (!Object.hasOwnProperty.call(jpToEnObject, fileName)) {
            //     jpToEnObject[fileName] = {}
            // } else {
            //     console.log('already exit', fileName, jpToEnObject[fileName].ec, jpToEnObject[fileName].gg);
            //     callback()
            //     return
            // }

            async.parallel([function (paCallback) {
                jpToEnExcelApi(fileName, function (meaning) {
                    insertObj.ec = meaning
                    paCallback()
                })
            }, function (paCallback) {
                jpToEnGoogleApi(fileName, function (meaning) {
                    insertObj.gg = meaning
                    paCallback()
                })
            }], function () {
                //console.log(fileName, jpToEnObject[fileName].ec, jpToEnObject[fileName].gg);
                console.log(insertObj);
                JpToEnCollection.insert(insertObj);
                db.saveDatabase()
                callback()
            })
        }, function () {
            console.log('finish All');
            //saveData()
        })
    })

}

loadTranslateOfFileName("./stream")
// let text = "ずんだもんさんは日本語につどう思いますか。"
// jpToEn(text, function (result) {
//     console.log(result);
// })



