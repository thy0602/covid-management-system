exports.moneyFormatter = (x) => {
    var moneyFormatter  = new Intl.NumberFormat();
    // return moneyFormatter.format(x).replace(',', '.');
    return moneyFormatter.format(x);
}
