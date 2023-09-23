const fs = require("fs")
const path = require("path")
const async = require("async")
let loki = require("lokijs")

require("./EngineTiktokInterface.js")
//require("./jpToEnTranslate.js")
var cmd = require('node-cmd');

//enable swap file
//cmd.runSync(`.\\ffmpeg.exe -i test.mp3 -c copy -metadata title="${title}" -metadata artist="${artist}" output.mp3`);
//cmd.run('sudo /bin/echo 1 > /sys/class/leds/green:internet/brightness'); //open stick


String.prototype.replaceAll = function (search, replacement) {
    // var target = this;
    // return target.replace(new RegExp(search, 'g'), replacement);
    var target = this;
    return target.split(search).join(replacement);
};


let outputPathBase = "./output_withSlow/"//"./outputEn/"
let isCreateEnglishSound = false
let isCreateSlowSound = true

let jpSoundSourcefileStoragePath = './stream_128k'
let jpSoundSourcefileStoragePathSlow = './stream_128k_slow'



// let inputPath = "./stage/state 1/stage 1-4.txt"
let inputPath = "./stage/state 1/"

if (process.argv[2]) {
    inputPath = process.argv[2]
}

var db = new loki('./jpToEnObject.db');
db.loadDatabase({}, function () {

    var JpToEnCollection = db.getCollection('JpToEn');
    if (!JpToEnCollection) {
        JpToEnCollection = db.addCollection('JpToEn')
    }

    function createOutputListFromFile(fileText, outputPath, finishCallback) {
        let fileStr = fs.readFileSync(fileText).toString().split('\r\n')

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true })
        }
        function toString000(int) {
            let intStr = int.toString()
            return ('000' + intStr).substring(intStr.length);
        }

        let soundIds = [
            "en_female_emotional",
            "en_us_001",
            "en_us_002"
        ]

        let count = 0

        async.eachSeries(fileStr, function (text, callback) {
            if (text != '') {
                let meaningManual = text.split("//")[1]
                text = text.split("//")[0]

                if (!text && meaningManual && meaningManual.indexOf("/") == 0) {
                    //title english sound
                    let tes = meaningManual.split("/")[1]
                    console.log("title", tes);
                    callback()
                    return
                }

                let fileTarget = `${jpSoundSourcefileStoragePath}/${text}.mp3`
                //console.log(fileTarget);
                if (fs.existsSync(fileTarget)) {
                    count++
                    let targetFileName = `${outputPath}/${toString000(count)}sp -${text}.mp3`
                    console.log(targetFileName);

                    if (fs.existsSync(targetFileName)) {
                        fs.unlinkSync(targetFileName)
                    }

                    if (meaningManual) {
                        //lyrics description
                        cmd.runSync(`..\\ffmpeg\\ffmpeg.exe -i "${fileTarget}" -c copy -metadata title="${text}" -metadata artist="${meaningManual}" -metadata album="${fileText}" "${targetFileName}"`);

                        if (isCreateSlowSound) {
                            let fileTarget_Slow = `${jpSoundSourcefileStoragePathSlow}/${text}.mp3`
                            let targetFileName_slow = `${outputPath}/${toString000(count)}s -${text}.mp3`
                            cmd.runSync(`..\\ffmpeg\\ffmpeg.exe -i "${fileTarget_Slow}" -c copy -metadata title="${text}" -metadata artist="${meaningManual}" -metadata album="${fileText}" "${targetFileName_slow}"`);
                        }

                        if (isCreateEnglishSound) {
                            let enSoundOutputFile = `${outputPath}/${toString000(count)}.${0}-${meaningManual.replaceAll(":", '.')}.mp3`
                                .replaceAll("?", "？").replace('"', '”').replace('"', '”')
                            if (fs.existsSync(enSoundOutputFile)) {
                                callback()
                            } else {
                                tiktokSynthesis(meaningManual, enSoundOutputFile, function () {
                                    callback()
                                }, soundIds[0])
                            }
                        } else {
                            callback()
                        }
                    }
                    else if (text.indexOf("ーーー") == -1 && text.indexOf("カンバセーション。") != 0 && text.indexOf("stage") != 0) {

                        let meaningObj = JpToEnCollection.findOne({ text: text })
                        if (meaningObj) {
                            //console.log(meaningObj);

                            meaningObj.gg.unshift(meaningObj.ec)
                            let unique = Array.from(new Set(meaningObj.gg))
                            let meaningStr = unique.join(' | ')
                            console.log(meaningStr);

                            for (let index = 0; index < unique.length; index++) {
                                unique[index] = unique[index].replaceAll("mr. ", "mister ").replaceAll("Mr. ", "mister ");
                            }

                            if (!fs.existsSync(targetFileName))
                                cmd.runSync(`.\\ffmpeg.exe -i "${fileTarget}" -c copy -metadata title="${text}" -metadata artist="${meaningStr}" -metadata album="${fileText}" "${targetFileName}"`);

                            if (isCreateEnglishSound) {
                                let meaningNumber = 0

                                async.eachSeries(unique, function (meaning, meaningCallback) {
                                    let enSoundOutputFile = `${outputPath}/${toString000(count)}.${meaningNumber}-${meaning}.mp3`
                                        .replaceAll("?", "？").replace('"', '”').replace('"', '”')
                                    if (fs.existsSync(enSoundOutputFile)) {
                                        meaningNumber++
                                        meaningCallback()
                                    } else {
                                        tiktokSynthesis(meaning, enSoundOutputFile, function () {
                                            meaningNumber++
                                            meaningCallback()
                                        }, soundIds[meaningNumber])
                                    }

                                }, function () {
                                    callback()
                                })
                            } else {
                                callback()
                            }

                        } else {
                            fs.copyFileSync(fileTarget, targetFileName)
                            callback()
                        }
                        // jpToEn(text, function (result) {
                        //     console.log(result);

                        // })
                        //console.log(meaningObj);
                    } else {
                        targetFileName = `${outputPath}/${toString000(count)} -${text}.mp3`
                        fs.copyFileSync(fileTarget, targetFileName)
                        callback()
                    }

                } else {
                    console.log(fileTarget, "don't exit", meaningManual, text.length);
                    //readRecursive()
                }
            } else {
                callback()
            }
        }, function () {
            console.log('finish');
            if (finishCallback) finishCallback()
        })
    }


    // let fileText = "./stage/state 1/stage 1-1.txt"
    // state 1/stage 1-1"

    //createOutputListFromFile(fileText, outputPath)

    if (fs.lstatSync(inputPath).isFile()) {
        console.log('fileText', inputPath);

        let fileNameOnly = path.parse(inputPath).name   //path.basename(wavFilename).replace(".mp3", "")
        let outputPath = outputPathBase + fileNameOnly

        createOutputListFromFile(inputPath, outputPath, function () {
            console.log('finish');
        })
        console.log(fileNameOnly);
    } else {
        let Files = [];

        function ThroughDirectory(Directory) {
            fs.readdirSync(Directory).forEach(File => {
                const Absolute = path.join(Directory, File);
                if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
                else return Files.push(Absolute);
            });
        }
        ThroughDirectory(inputPath);

        async.eachSeries(Files, function (filePath, callback) {
            console.log(filePath);

            let filePathObj = path.parse(filePath)
            let outputContainer = path.join(filePathObj.dir, filePathObj.name).replace(path.normalize(path.dirname(inputPath)), '')
            let outputPath = path.join(outputPathBase, outputContainer)
            console.log('outputPath', outputPath);

            createOutputListFromFile(filePath, outputPath, function () {
                console.log('finish createOutputListFromFile', Files);
                callback()
            })

        })

    }

})