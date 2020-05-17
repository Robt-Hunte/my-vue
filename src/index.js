import { initMixin } from './init.js';

// 只做 Vue 声明
export default function Vue(options) {
    // 进行初始化操作
    this._init(options);
};

// 给 Vue 原型对象上添加方法
initMixin(Vue);