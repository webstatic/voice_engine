require("./EngineInterface.js")

let ipList = [
    // "127.0.0.1",
    "192.168.1.21",
    "192.168.1.25",
    "192.168.1.27",
    "192.168.1.28",
    "192.168.1.30",
    "192.168.1.32"
]

let countAll = 0
function start_synthesis(element, count) {

    synthesis(element, "十六歳の俺おれが竜王になって三ヶ月後に取った初めての弟子は小学生の女の子で、", function (result) {
        console.log(element, ++count, result);
        console.log(++countAll);
        //start_synthesis(element, count)
    })
}

for (let index = 0; index < ipList.length; index++) {
    const element = ipList[index];
    start_synthesis(element, 0)
}