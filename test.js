var promisesAplusTests = require("promises-aplus-tests")
var adapter = require('./src')

promisesAplusTests(adapter, function (err) {

    console.log(err)
    // All done; output is in the console. Or check `err` for number of failures.
});