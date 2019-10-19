

/*
    The promise resolution procedure is an abstract operation taking as input a promise and a value, which we denote as [[Resolve]](promise, x).
    promise解决程序是一个抽象的操作，将promise和value 作为值输入，我们将其表示为[[Resolve]]（promise，x）
    If x is a thenable,it attempts to make promise adopt the state of x,under the assumption that x behaves at least somewhat like a promise.
    如果x是 thenable ，
    
    Otherwise, it fulfills promise with the value x.This treatm

    1.If promise and x refer to the same object, reject promise with a TypeError as the reason.
    如果x和promise2都是同指一个对象，抛出类型异常
 */

function isObject(instance) {
    return Object.prototype.toString.call(instance) === "[object Object]"
}

function isFunction(instance) {
    return Object.prototype.toString.call(instance) === "[object Function]"
}

function isNull(instance) {
    return instance === null
}

function resolvePromise(promise, x, resolve, reject) {
    let thenCalledOrThrow = false

    if (promise === x) {
        return reject(new TypeError("promise and x not refer to the same object"))
    }

    if (!isNull(x) && (isObject(x) || isFunction(x))) {
        try {
            let then = x.then

            if (isFunction(then)) {
                try {
                    then.call(x, function (y) {
                        if (thenCalledOrThrow) return
                        thenCalledOrThrow = true
                        resolvePromise(promise, y, resolve, reject)
                    }, function (r) {
                        if (thenCalledOrThrow) return
                        thenCalledOrThrow = true
                        reject(r)
                    })

                } catch (e) {
                    if (thenCalledOrThrow) return
                    thenCalledOrThrow = true
                    reject(e)
                }

            } else {
                resolve(x)
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
    
    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallback = []
    this.onRejectedCallback = []


    let resolve = (value) => {
        this.value = value
        this.status = 'fulfilled'
        process.nextTick(() => {
            this.onFulfilledCallback.forEach((cb) => {
                cb(value)
            })
        })
    }

    let reject = (reason) => {

        this.reason = reason
        this.status = 'rejected'
        process.nextTick(() => {
            this.onRejectedCallback.forEach((cb) => {
                cb(reason)
            })
        })

    }

    try {
        resolver(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

PromiseA.prototype.then = function (onFulfilled, onRejected) {

    if (!isFunction(onFulfilled)) onFulfilled = v => v

    if (!isFunction(onRejected)) onRejected = r => { throw r }
    let self = this
    let status = this.status

    if (status === 'fulfilled') {
        var promise2 = new PromiseA(function(resolve, reject) {
            process.nextTick(function() {
                try {
                    let x = onFulfilled(self.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
        return promise2
    }

    if (status === 'rejected') {
        var promise2 = new PromiseA(function(resolve, reject) {
            process.nextTick(function() {
                try {
                    let x = onRejected(self.reason)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {

                    reject(e)
                }
            })
        })
        return promise2
    }

    if (status === 'pending') {

        var promise2 = new PromiseA(function(resolve, reject) {
            self.onFulfilledCallback.push((value) => {
                try {
                    let x = onFulfilled(value)

                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })

            self.onRejectedCallback.push((reason) => {
                try {
                    let x = onRejected(reason)

                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
        return promise2
    }
}

PromiseA.resolve = function (x) {
    var promise = new PromiseA(function(resolve, reject) {
        process.nextTick(() => {
            resolvePromise(promise, x, resolve, reject)
        })
    })
    return promise
}

PromiseA.reject = function (reason) {
    return new PromiseA(function(resolve, reject) {
        reject(reason)
    })
}

PromiseA.prototype.reject = function (onRejected) {
    return this.then(undefined, onRejected)
}

module.exports = {
    resolved: PromiseA.resolve,
    rejected: PromiseA.reject,
    deferred: () => {
        var dfd = {}
        dfd.promise = new PromiseA(function (resolve, reject) {
            dfd.resolve = resolve
            dfd.reject = reject
        })
        return dfd
    }
}