
var adapter = require('./src')

const p = adapter.deferred()

// console.log(p.resolved)

console.log(adapter.resolved({}))

// setTimeout(() => {
//     console.log(p.promise.then(1,1))
// })