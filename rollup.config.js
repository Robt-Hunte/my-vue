import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input: './src/index.js', // 入口
    output: {
        file: 'dist/umd/vue.js', // 出口
        name: 'Vue', // 指定打包后全局变量的名字
        format: 'umd', // 统一模块规范
        sourceMap: true 
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        process.env.ENV === 'development' ? serve({
            open: true,
            openPage: '/public/index.html', // 默认打开的路径
            port: 9000,
            contentBase: ''
        }) : null
    ]
}