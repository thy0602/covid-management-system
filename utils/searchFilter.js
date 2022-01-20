const stringSimilarity = require("string-similarity");

exports.filterBySimilarity = (objects, searchStr, name='name', threshold=0.2) => {
    let filteredObjects = [];
    searchStr = searchStr.toLowerCase();

    for (const object of objects) {
        let similarity = stringSimilarity.compareTwoStrings(searchStr, object[name].toLowerCase());
        if (similarity > 0.5) {
            object['similarity'] = similarity;
            filteredObjects.push(object);
        }
    }
    filteredObjects.sort((a, b) => (a.similarity < b.similarity) ? 1 : -1);  // sort ascending
    return filteredObjects;
}

exports.filter = (objects, searchStr, name='name') => {
    let filteredObjects = [];
    searchStr = searchStr.toLowerCase();
    let words = searchStr.split(' ');

    for (const object of objects) {
        for (const word of words) {
            if (object[name].toLowerCase().includes(word)) {
                filteredObjects.push(object);
                break;
            }
        }
    }
    return filteredObjects;
}