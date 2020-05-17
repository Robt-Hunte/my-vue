(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  }

  function defNoEnumConfig(data, key, value) {
    Object.defineProperty(data, key, {
      value: value,
      enumerable: false,
      configurable: false
    });
  }

  // 重写数组的 api ： push splice unshift shift pop reverse sort 
  var methods = ['push', 'splice', 'unshift', 'shift', 'pop', 'reverse', 'sort'];
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  methods.forEach(function (method) {
    // 重写数组方法 AOP思想
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); // 对于新增的项，如果是对象也得监听
      // push unshift 都是一个参数， splice 是三个参数， 最后一个参数才是新增的项

      var addItem = ''; // 当前新增的项

      switch (method) {
        case 'push':
        case 'unshift':
          addItem = args;
          break;

        case 'splice':
          addItem = args.slice(2);
          break;
      }

      if (addItem) this.__ob.observerArray(addItem); // 将新增属性继续监听

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 给每个响应式数据添加 Observer 实例
      // data.__ob = this; // 不通过这种方式，因为 __ob 也会被监听，__ob.walk, observerArray 也会被监听，造成递归栈溢出。
      defNoEnumConfig(data, '__ob', this); // 单独处理数组监听。因为如果像对象一样去监听数组，数组的索引也会被监听， 会影响性能。

      if (Array.isArray(data)) {
        // 如果数组每项为对象，再去监听
        this.observerArray(data); // 平常开发很少会直接操作数组索引来修改数组，一般都是通过调用数组 API 来操作数
        // 通过重写数组的 API 来实现对数组的监听

        data.__proto__ = arrayMethods;
      } else {
        // 处理对象监听
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 依次对对象的每个属性进行监听
        Object.keys(data).forEach(function (key) {
          // 定义响应式数据
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observerArray",
      value: function observerArray(data) {
        data.forEach(function (item) {
          return observer(item);
        });
      }
    }]);

    return Observer;
  }();
  /**
   * @description 使用 Object.defineProperty 重写数据的 get 和 set 来实现响应式
   * @param {*} data 
   * @param {*} key 
   * @param {*} value 
   */


  function defineReactive(data, key, value) {
    // 如果属性值还是对象，递归监听
    observer(value);
    Object.defineProperty(data, key, {
      // 获取值的时候做一些操作， add watcher
      get: function get() {
        return value;
      },
      // 设置值的时候做一些操作， notify update
      set: function set(newValue) {
        if (newValue === value) return; // 如果设置的新值是个对象，也需要监听

        observer(newValue);
        console.log('值变化了');
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  }
  function observer(data) {
    if (!isObject(data)) return; // 监听数据

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;
    var data = opts.data; // 处理 data 是 function 类型的情况， 注意函数内部 this 指向

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 监听数据

    observer(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 进行一些列的初始化操作 initLifecycle initRender initState...

      initState(vm);
    };
  }

  function Vue(options) {
    // 进行初始化操作
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
