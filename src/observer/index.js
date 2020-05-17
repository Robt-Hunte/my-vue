import { isObject, defNoEnumConfig } from '../util/index.js';
import { arrayMethods } from './array.js';

class Observer {
    constructor(data) {
        // 给每个响应式数据添加 Observer 实例
        // data.__ob = this; // 不通过这种方式，因为 __ob 也会被监听，__ob.walk, observerArray 也会被监听，造成递归栈溢出。
        defNoEnumConfig(data, '__ob', this);
        // 单独处理数组监听。因为如果像对象一样去监听数组，数组的索引也会被监听， 会影响性能。
        if (Array.isArray(data)) {
            // 如果数组每项为对象，再去监听
            this.observerArray(data);

            // 平常开发很少会直接操作数组索引来修改数组，一般都是通过调用数组 API 来操作数
            // 通过重写数组的 API 来实现对数组的监听
            data.__proto__ = arrayMethods;
        } else {
            // 处理对象监听
            this.walk(data);
        }
    }

    walk(data) {
        // 依次对对象的每个属性进行监听
        Object.keys(data).forEach(key => {
            // 定义响应式数据
            defineReactive(data, key, data[key]);
        })
    }

    observerArray(data) {
        data.forEach(item => observer(item));
    }
}

/**
 * @description 使用 Object.defineProperty 重写数据的 get 和 set 来实现响应式
 * @param {*} data 
 * @param {*} key 
 * @param {*} value 
 */
export function defineReactive(data, key, value) {
    // 如果属性值还是对象，递归监听
    observer(value);

    Object.defineProperty(data, key, {
        // 获取值的时候做一些操作， add watcher
        get () {
            return value;
        },
        // 设置值的时候做一些操作， notify update
        set (newValue) {
            if (newValue === value) return;
            // 如果设置的新值是个对象，也需要监听
            observer(newValue);
            console.log('值变化了');
            value = newValue;
        },
        enumerable: true,
        configurable: true
    });
};

export function observer(data) {
    if (!isObject(data)) return;
    
    // 监听数据
    return new Observer(data);
};
