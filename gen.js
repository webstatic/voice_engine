require("./EngineInterface.js")
require("./EngineWebInterface.js")
let postStrUrl = "127.0.0.1"
//let serverUrl = "192.168.1.27"

if (process.argv[2]) {
  postStrUrl = "192.168.1." + process.argv[2]
}

//let text = "十六歳"
let text = "十六歳の俺が竜王になって三ヶ月後に取った初めての弟子は小学生の女の子で、いろいろあって二人で暮らす事になった4。"
//let text = "互いに礼を交わすと、頭を上げるなり待ちきれないといったように駒を持つ。ひらひらと舞い落ちる桜の花びらみたいに、小さな手が盤の上を舞う。"
console.log('text.length', text.length);
//synthesis(postStrUrl, "十六歳")
synthesis(postStrUrl, text, function (err) {
  console.log(postStrUrl);
})



webSynthesis('api.tts.quest', text, function (err) {
  console.log('api.tts.quest');
})