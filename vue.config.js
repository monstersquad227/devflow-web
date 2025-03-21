const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    devServer: {
        port: 3000,
        proxy: {
            '^/devflow': {
                // target: 'http://192.168.1.87:8080',
                target: 'http://10.11.11.47:8080',
                changeOrigin: true,
            }
        },
        client: {
            overlay: false
        }
    }
})
