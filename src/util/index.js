export function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
};

// 设置对象的属性不可枚举不可配置
export function defNoEnumConfig(data, key, value) {
    Object.defineProperty(data, key, {
        value,
        enumerable: false,
        configurable: false
    });
};
