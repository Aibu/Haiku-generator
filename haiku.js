var fs = require('fs');
var hg = require('./haiku_generator');

var filePath = './dictionaries/cmudict.txt';
var customFilePath = './dictionaries/kafka-the-trial.txt';
//var customFilePath = './dictionaries/alice-in-wonderland-lewis-carrol.txt';


// Config

// - book         = Set to true to use customFilePath
// - adjAdv       = Forces the first word to be adjective
//                  or adverb (doesnt really work so well!)
// - structure    = The structure of the Haiku (array or array of arrays)

var book = false;
var adjAdv = true;
var structure = [
    [3, 2],
    [3, 1, 4],
    [3, 2]
];



// Accept arguments from CLI
if (process.argv.indexOf('book') !== -1) {
    book = true;
}
if (process.argv.indexOf('adjAdv') !== -1) {
    adjAdv = true;
}

var haikuDictionary = [];

// Dictionary
var cmudictFile = readCmudictFile(filePath);
var customdictFile = readCmudictFile(customFilePath);


function readCmudictFile(file) {
    return fs.readFileSync(file).toString();
};


function formatData(data) {
    var lines = data.toString().split("\n"),
        lineSplit,
        dictionary = [],
        objDictionary = [];

    lines.forEach(function(line) {
        lineSplit = line.split("  ");
        if (lineSplit[1] !== undefined) {
            var syllabsCount = lineSplit[1].match(/\d+/gi);
        };
        if (syllabsCount !== null && syllabsCount !== undefined) {
            dictionary[lineSplit[0]] = syllabsCount.length;
            objDictionary.push({
                w: lineSplit[0],
                s: syllabsCount.length
            });
        };
    });
    haikuDictionary = objDictionary;
    return dictionary;
};


function extractData(data, dic) {
    var lines = data.toString()
        .replace(/\r?\n|\r|-/gi, ' ')
        .replace(/\?|\!|\,|\.|:|"/gi, '')
        .replace(/^'|'$/gi, '')
        .toUpperCase()
        .split(' '),
        lineSplit,
        dictionary = [],
        objDictionary = [];

    lines.forEach(function(line, index) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(index + ' of ' + lines.length + ' words processed.');
        if (line !== '' && dic[line] !== undefined && dictionary[line] === undefined //avoid duplicates
        ) {
            dictionary[line] = dic[line];
            objDictionary.push({
                w: line,
                s: dictionary[line]
            });
        };
    });

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    haikuDictionary = objDictionary;
    return dictionary;
}


var dic = formatData(cmudictFile, function() {});

// If it is a book, extract syllabs count
if (book) {
    var bookDic = extractData(customdictFile, dic);
}

hg.createHaiku(structure, haikuDictionary, adjAdv);

process.stdout.write("You can also add parameters like:\n");
process.stdout.write("- 'book' to create dramatic haikus from Kafka - The trial\n");
process.stdout.write("- 'adjAdv' - experimental, forces the first word for each line to be an adjective or adverb\n");
process.stdout.write("\n\n");
