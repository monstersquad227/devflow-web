const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    devServer: {
        port: 3000,
        proxy: {
            '^/devflow': {
                // target: 'http://192.168.1.87:8080',
                target: 'http://192.168.1.198:8000/',
                changeOrigin: true,
            }
        },
        client: {
            overlay: false
        }
    }
})
