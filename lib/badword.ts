export function detectBadWord(message:string) {
    const list = require("./json/badword-list.json").words,
        cleanMsg = message.toLowerCase().replace(/[^a-zA-Z0-9\s]/gi, "").replace(/[\n\r]/gi, ""),
        badword = {
            bool: false,
            word: [""]
        },
        animalword = {
            bool: false,
            word: [""]
        };
    for (let i = 0; i < list.wordlist.length; i++) {
        if (cleanMsg.match(new RegExp(list.wordlist[i], "gi"))) {
            badword.bool = true;
            badword.word = cleanMsg.match(new RegExp(list.wordlist[i], "gi"))
        }
    }
    for (let i = 0; i < list.animalword.length; i++) {
        if (cleanMsg.match(new RegExp(list.animalword[i], "gi"))) {
            animalword.bool = true;
            animalword.word = cleanMsg.match(new RegExp(list.animalword[i], "gi"))
        }
    }
    if (badword.bool) return {bool:true,output:badword.word.join(", ")}
    if (animalword.bool || cleanMsg.includes("hewan")) return {bool:true,output:animalword.word.join(", ")}
    return {bool:false,output:null}
};