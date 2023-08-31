import fetch from "node-fetch";
import fs from "fs"

let serverUrl = "127.0.0.1"
//let serverUrl = "192.168.1.27"

if (process.argv[2]) {
  serverUrl = "192.168.1." + process.argv[2]
}
console.log('at server', serverUrl);

let timeStart = new Date()
// const text = "こんにちは、音声合成の世界へようこそ"
// const text = "十六歳の俺が竜王になって三ヶ月後に取った初めての弟子は小学生の女の子で、いろいろあって二人で暮らす事になった。"
const text = "十六歳"

const res = await fetch(`http://${serverUrl}:50021/audio_query?text=${text}&speaker=47`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  }

})

const query = await res.json()

console.log('start synthesis');

const sound_row = await fetch(`http://${serverUrl}:50021/synthesis?speaker=47&enable_interrogative_upspeak=true`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
    'accept': 'audio/wav',
    'responseType': "stream"
  },
  body: JSON.stringify(query)
})

const dest = fs.createWriteStream("stream.wav");
sound_row.body.pipe(dest)

let timeEnd = new Date()
console.log('use time', (timeEnd - timeStart) / 1000);

