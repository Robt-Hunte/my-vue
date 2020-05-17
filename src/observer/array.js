// 重写数组的 api ： push splice unshift shift pop reverse sort 

let methods = ['push', 'splice', 'unshift', 'shift', 'pop', 'reverse', 'sort']
let oldArrayMethods = Array.prototype;
let arrayMethods = Object.create(oldArrayMethods);

methods.forEach(method => {
    // 重写数组方法 AOP思想
    arrayMethods[method] = function(...args) {
        let result = oldArrayMethods[method].apply(this, args);
        // 对于新增的项，如果是对象也得监听
        // push unshift 都是一个参数， splice 是三个参数， 最后一个参数才是新增的项
        let addItem = ''; // 当前新增的项
        switch(method) {
            case 'push':
            case 'unshift':
                addItem = args;
                break;
            case 'splice':
                addItem = args.slice(2);
                break;
            default:
                break;

        }
        if (addItem) this.__ob.observerArray(addItem); // 将新增属性继续监听
        return result;
    }
})

export { arrayMethods };
