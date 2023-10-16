const fs = require("fs")
const async = require("async")

require("./EngineInterface.js")

let postStrUrl = "127.0.0.1"
//let postStrUrl = "192.168.1.34"
let inputPath = "./stage/state 2/"

// prepare_synthesis({
//     useSlow: false,
//     speakerId: 48,
//     fileStoragePath: './stream_楽々',
//     convertToKana: false
// })


// prepare_synthesis({
//     useSlow: false,
//     speakerId: 47,
//     fileStoragePath: './stream',
//     convertToKana: false
// })

prepare_synthesis({
    useSlow: true,
    speakerId: 47,
    fileStoragePath: './stream_slow_conv',
    convertToKana: true
})



readAndSynthesisRecursive = function (filePath, finishCallBack) {

    let textList = fs.readFileSync(filePath).toString().split('\r\n')

    let count = 0
    let length = textList.length

    async.eachSeries(textList, function (text, callback) {
        count++
        if (text !== undefined) {
            if (text == '') {
                callback()
            } else {
                text = text.split("//")[0]
                if (text != '') {
                    console.log(`${count}/${length}`, text);
                    synthesis(postStrUrl, text, function (err) {
                        callback()
                    })
                } else {
                    callback()
                }

            }
        } else {
            console.log('err something wrong');
            // if (finishCallBack) finishCallBack()
        }
    }, finishCallBack)

}


if (process.argv[2]) {
    inputPath = process.argv[2]
}

if (fs.lstatSync(inputPath).isFile()) {
    console.log('fileText', inputPath);

    readAndSynthesisRecursive(inputPath, function () {
        console.log('finish');
    })
} else {
    const path = require("path");
    let Files = [];

    function ThroughDirectory(Directory) {
        fs.readdirSync(Directory).forEach(File => {
            const Absolute = path.join(Directory, File);
            if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
            else return Files.push(Absolute);
        });
    }

    ThroughDirectory(inputPath);
    console.log(Files);

    async.eachSeries(Files, function (filePath, callback) {
        readAndSynthesisRecursive(filePath, function (err) {
            console.log('finish', filePath);
            callback()
        })
    }, function () {
        console.log('finish All');
    })
}




// //let text = "十六歳"
// let text = "十六歳の俺が竜王になって三ヶ月後に取った初めての弟子は小学生の女の子で、いろいろあって二人で暮らす事になった。"
// //let text = "互いに礼を交わすと、頭を上げるなり待ちきれないといったように駒を持つ。ひらひらと舞い落ちる桜の花びらみたいに、小さな手が盤の上を舞う。"
// console.log('text.length', text.length);

// synthesis(postStrUrl, text, function (err) {
//     console.log(postStrUrl);
// })
