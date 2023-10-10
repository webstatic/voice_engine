jisho = require("jisho")
const kanji = require('kanji');
var japanese = require('japanese');

const async = require("async")

const Kuroshiro = require("kuroshiro").default
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const kuroshiro = new Kuroshiro();

var hepburn = require("romanize-japanese")
toHepburn = function (params) {
    return hepburn.fromKana(params).replace(/Ā/g, "AA").replace(/Ī/g, "II").replace(/Ū/g, "UU").replace(/Ē/g, "EE").replace(/Ō/g, "OO").replaceAll('（','(').replaceAll('）',')')
}
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


function getData(kanjiInput, cb) {
    jisho(kanjiInput, { examples: false }, function (results) {
        let result = results[0]
        if (result) {
             
   
            // let tree = kanji.kanjiTree(kanjiInput);

            // result.kanji_parts = []
            // for (const key in tree.g) {
            //     if (Object.hasOwnProperty.call(tree.g, key)) {
            //         const element = tree.g[key];
            //         //console.log(element.element, element.g);
            //         result.kanji_parts.push(element.element)
            //     }
            // }

            if (result.kanji_parts) {
                result.kanjiPartArray = []
                // console.log('=>', result.kanji_parts);
                // console.log("");
                async.eachSeries(result.kanji_parts, function (part, callback) {
                    jisho(part, { examples: false }, function (resultsPath) {
                        if (resultsPath[0]) {
                            resultsPath = resultsPath[0]

                            // console.log(resultsPath.kanji, resultsPath.meaning);
                            result.kanjiPartArray.push({kanji:resultsPath.kanji,meaning:resultsPath.meaning})
                        }

                        callback()
                    })
                },function () {
                    if(cb)cb(result)
                })
            }else{
                if(cb)cb(result)
            }

            // console.log();
         //console.log(result);
        } else {
            console.log('no result');
        }
    })
}

 getData('登',function (result) {
    console.log(result.kanji, '->', result.meaning)
    console.log('on:',toHepburn(result.reg_on?result.reg_on:result.onyomi),', ', result.reg_on, 'kun:', toHepburn(result.reg_kun?result.reg_kun:result.kunyomi).toLocaleLowerCase(), result.reg_kun.replaceAll('（','(').replaceAll('）',')'));
    if (result.kanji_parts) {
        console.log('=>', result.kanji_parts);
        console.log(result.kanjiPartArray)
    }
 })

// const wanakana = require('wanakana');
// console.log(wanakana.isKana('登る'));
// console.log(wanakana.isKanji('ヾ'));

// console.log(toHepburn('高たか'));
// kuroshiro.init(new KuromojiAnalyzer())
//     .then(function () {
    
      
//     })
