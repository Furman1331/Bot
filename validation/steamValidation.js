module.exports = (str) => {
    if(str === undefined) return false;

    if(str.search('steam:') === -1) return false;

    if(str.length !== 21) return false;

    if(str.substring(6, 10) !== '1100') return false;

    return true
}