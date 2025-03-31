import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// ant-design-vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import * as Icons from '@ant-design/icons-vue';

const app = createApp(App);

Object.keys(Icons).forEach((key) => {
	app.component(key, Icons[key]);
});

app.use(store)
app.use(router)
app.use(Antd);
app.mount('#app')
