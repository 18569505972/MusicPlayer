module.exports = {
	devServer: {
		port: 8082,
        host: 'localhost',
        open: true
	},
    css: {
        loaderOptions: {
            // 给 less-loader 传递选项
            less: {
                // @/ 是 src/ 的别名
                javascriptEnabled: true
            }
        }
    }
}