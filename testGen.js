require("./EngineInterface.js")

let ipList = [
    "127.0.0.1",
    // "192.168.1.21",
    // "192.168.1.25",
    // "192.168.1.27",
    // "192.168.1.28",
    // "192.168.1.30",
    // "192.168.1.32"
]

let countAll = 0




function start_synthesis(element, count) {

    synthesis(element,
        //"十六歳の俺おれが竜王になって三ヶ月後に取った初めての弟子は小学生の女の子で、"
        "お昼ご飯を(食べ)に家に帰りました。"
        , function (result) {
            console.log(element, ++count, result);
            console.log(++countAll);
            //start_synthesis(element, count)
        })
}

// for (let index = 0; index < ipList.length; index++) {
//     const element = ipList[index];
//     start_synthesis(element, 0)
// }




const Kuroshiro = require("kuroshiro").default
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const kuroshiro = new Kuroshiro();

let text = "お昼ご飯を食べに家に帰りました。"
kuroshiro.init(new KuromojiAnalyzer())
    .then(function () {

        // kuroshiro.convert(text,{mode:"normal", to:"katakana"}).then(function (result) {
        //     console.log(result);

        
        // });

        synthesis("127.0.0.1",
        //"十六歳の俺おれが竜王になって三ヶ月後に取った初めての弟子は小学生の女の子で、"
        text
        //"お昼ご飯をたべに家に帰りました。"
        , function (result) {

            //start_synthesis(element, count)
        })

    })
