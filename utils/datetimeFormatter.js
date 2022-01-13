exports.getDayMonthYear = (time) => {
    return time.getDay().toString() + '/' +
        (time.getMonth() + 1).toString() + '/' +
        time.getFullYear().toString();
}

exports.getFull = (time) => {
    return String(time.getHours()).padStart(2, '0') + ":" + 
        String(time.getMinutes()).padStart(2, '0') + ':' +
        String(time.getSeconds()).padStart(2, '0') + ' ' +
        time.getDay().toString() + '/' +
        (time.getMonth() + 1).toString() + '/' +
        time.getFullYear().toString();
}
