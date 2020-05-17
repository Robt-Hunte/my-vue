import { initState } from './state.js';

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options;
        // 进行一些列的初始化操作 initLifecycle initRender initState...
        initState(vm);
    };
};