function createHaiku(structure, dictionary, adjAdv) {

    var retWords = [];

    structure.forEach(function(el, index) {

        if (typeof el === 'object') {
            createHaiku(el, dictionary, true);
        } else {
            retWords.push(extractRandomWord(dictionary, el, adjAdv).w.replace(/\(\d\)/gi, ''));
        };

        // Force adjective or adverb only for the first word
        if (adjAdv) {
            adjAdv = false;
        };
    });

    // Returns the haiku
    console.log(retWords.join(' '));
};


function extractRandomWord(dictionary, len, adjAdv) {
    var regEx = new RegExp(/(al|ary|ful|ic|ical|ish|less|like|ly|ily|ically)$/gi);
    var _wordsArray = [];
    if (adjAdv) {
        _wordsArray = dictionary.filter(function(element) {
            var match = element.w.match(regEx);
            if ((element.s === len) && (element.w.match(regEx) !== null)) {
                return true;
            };
            return false;
        });
    } else {
        _wordsArray = dictionary.filter(function(element) {
            return element.s === len;
        });
    };
    return _wordsArray[Math.floor(Math.random() * _wordsArray.length)];
};


module.exports = {
    createHaiku: createHaiku,
};
