
var adapter = require('./src')

var promise1 = adapter.resolved({}).then(() => {
    console.log('1')
    return promise1
})
promise1.then(null, function (reason) {
    console.log(reason)
});