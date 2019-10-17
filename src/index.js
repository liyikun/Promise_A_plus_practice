

/*
    The promise resolution procedure is an abstract operation taking as input a promise and a value, which we denote as [[Resolve]](promise, x).
    promise解决程序是一个抽象的操作，将promise和value 作为值输入，我们将其表示为[[Resolve]]（promise，x）
    If x is a thenable,it attempts to make promise adopt the state of x,under the assumption that x behaves at least somewhat like a promise.
    如果x是 thenable ，
    
    Otherwise, it fulfills promise with the value x.This treatm

    1.If promise and x refer to the same object, reject promise with a TypeError as the reason.
    如果x和promise2都是同指一个对象，抛出类型异常
 */
function resolvePromise(promise, x, resolve, reject) {

    if (promise === x) {
        return reject(new TypeError("promise and x not refer to the same object"))
    }

    if (x instanceof PromiseA) {
        if (x.status === 'pending') {
            x.then((value) => {
                resolvePromise(promise, value, resolve, reject)
            }, reject)
        } else {
            x.then(resolve, reject)
        }

        return
    }

    let type = Object.prototype.toString.call(x)

    if (type !== null && (type === "[object Object]" || type === "[object Function]")) {
        try {
            let then = x.then

            if (Object.prototype.toString(then) === "[object Function]") {
                try {
                    then.call(x, function (y) {

                        resolvePromise(promise, y, resolve, reject)
                    }, function (r) {
                        reject(r)
                    })
                } catch (e) {
                    reject(e)
                }
            }


        } catch (e) {
            reject(e)
        }

    } else {
        resolve(x)
    }

}

function PromiseA(resolver) {
    if (!Object.prototype.toString.call(resolver)) {
        throw new Error('Promise resolver  is not a function')
    }
    this.status = 'pengding'
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallback = []
    this.onRejectedCallback = []


    let resolve = (value) => {
        this.value = value
        this.state = 'fulfilled'
        this.onFulfilledCallback.forEach((cb) => {
            cb(value)
        })
    }

    let reject = (reason) => {
        this.reason = reason
        this.state = 'rejected'
        this.onRejectedCallback.forEach((cb) => {
            cb(value)
        })
    }

    try {
        resolver(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

PromiseA.prototype.then = function (onFulfilled, onRejected) {

    if (Object.prototype.toString.call(onFulfilled) !== "[object Function]") onFulfilled = function() {}

    if (Object.prototype.toString.call(onRejected) === "[object Function]") onRejected = function() {}

    if(this.status === 'fulfilled') {
        this.onFulfilledCallback.push((value) => {
            return promise2 = new PromiseA((resolve, reject) => {
                try {
                    let x = onFulfilled(value)
                    if(x instanceof PromiseA) {
                        x.then(resolve, reject)
                    }
                    resolve(x)
                } catch(e) {
                    reject(e)   
                }
            })
        })
    }

    if(this.status === 'rejected') {
        this.onRejectedCallback.push((reason) => {
            return promise2 = new PromiseA((resolve, reject) => {
                try {
                    let x = onRejected(reason)
                    if(x instanceof PromiseA) {
                        x.then(resolve, reject)
                    }
                    resolve(x)
                } catch(e) {
                    reject(e)   
                }
            })
        })
    }

    if(this.status === 'pending') {
        
        return promise2 = new PromiseA((resolve, reject) => {

            this.onFulfilledCallback((value) => {
                try {
                    let x = onFulfilled(value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch(e) {
                    reject(e)
                }
            })

            this.onRejectedCallback((reason) => {
                try {
                    let x = onRejected(reason)
                    resolvePromise(promise2, x, resolve, reject)
                } catch(e) {
                    reject(e)
                }
            })
        })
    }
}

PromiseA.resolve = function(x) {
    return promise2 = new PromiseA((resolve, reject) => {
        resolvePromise(promise2, x, resolve, reject)
    })
}

PromiseA.reject = function(reason) {
    return new PromiseA((resolve, reject) => {
        reject(reason)
    })
}



PromiseA.prototype.reject = function(onRejected) {
    return this.then(null,onRejected)
}


module.exports = {
    resolved: PromiseA.resolve,
    rejected: PromiseA.reject,
    deferred: () =>  { 
        var dfd = {}
        dfd.promise = new Promise(function(resolve, reject) {
            dfd.resolve = resolve
            dfd.reject = reject
        })
        return dfd
    }
}