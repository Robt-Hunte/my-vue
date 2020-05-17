import { observer } from './observer/index.js';

export function initState(vm) {
    let opts = vm.$options;
    let data = opts.data;
    // 处理 data 是 function 类型的情况， 注意函数内部 this 指向
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;

    // 监听数据
    observer(data);
};
