const fs = require('fs');

let packageJSON = fs.readFileSync(__dirname + '/package.json', {encoding: 'utf-8'});
packageJSON = JSON.parse(packageJSON);

const currentVersion = packageJSON.version;
const copyright = 'i-components v${version} | (c) 2021, author sshuzhong@outlook.com'.replace('${version}', currentVersion);

module.exports = copyright;
