
/*
    The promise resolution procedure is an abstract operation taking as input a promise and a value, which we denote as [[Resolve]](promise, x).
    promise解决程序是一个抽象的操作，将promise和value 作为值输入，我们将其表示为[[Resolve]]（promise，x）
    If x is a thenable,it attempts to make promise adopt the state of x,under the assumption that x behaves at least somewhat like a promise.
    如果x是 thenable ，
    
    Otherwise, it fulfills promise with the value x.This treatm

    1.If promise and x refer to the same object, reject promise with a TypeError as the reason.
    如果x和promise2都是同指一个对象，抛出类型异常
 */
function resolutionProcedure(p, x, resolve, reject) {

    if(p === x) {
        return reject(new TypeError("promise and x not refer to the same object"))
    }

    if(x instanceof PromiseA) {
        if(x.status === 'pending') {
            x.then((value) => {
                resolutionProcedure(p, value, resolve, reject)   
            }, reject)
        } else {
            x.then(resolve, reject)
        }

        return
    }

    let type = Object.prototype.toString.call(x)
    
    if(type === "[object Object]" || type === "[object Function]") {
        
    }

}

function PromiseA(resolver) {
    if(!Object.prototype.toString.call(resolver)) {
        throw new Error('Promise resolver  is not a function')
    }
    this.status = 'pengding'
    this.value = undefined
    this.reason = undefined   
    this.onFulfilledCallback = []
    this.onRejectedCallback = []


    function resolve(value) {
        this.value = value
        this.state = 'fulfilled'
        this.onFulfilledCallback.forEach((cb) => {
            cb(value)
        })
    }

    function reject(reason) {
        this.reason = reason
        this.state = 'rejected'
        this.onRejectedCallback.forEach((cb) => {
            cb(value)
        })
    }

    try {
        resolver(resolve, reject)
    } catch(e) {
        reject(e)
    }
}

PromiseA.prototype.then = function(onFulfilled, onRejected) {
    
    if(Object.prototype.toString.call(onFulfilled) === "[object Function]") {

    }

    if(Object.prototype.toString.call(onRejected) === "[object Function]") {

    }

}