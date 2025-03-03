import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// ant-design-vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import {
	MenuUnfoldOutlined, MenuFoldOutlined, SettingOutlined, DashboardOutlined, HomeOutlined, InfoCircleOutlined,
	DownOutlined, SmileOutlined, UserOutlined, LockOutlined, VideoCameraOutlined, ProjectOutlined, ApartmentOutlined,
	DatabaseOutlined, PlusOutlined, UndoOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined,
	EyeOutlined, ReloadOutlined, UploadOutlined
} from '@ant-design/icons-vue'

const app = createApp(App);

app.use(store)
app.use(router)
app.use(Antd);

// 单独注册每个图标
app.component('MenuUnfoldOutlined', MenuUnfoldOutlined)
app.component('MenuFoldOutlined', MenuFoldOutlined)
app.component('SettingOutlined', SettingOutlined)
app.component('DashboardOutlined', DashboardOutlined)
app.component('HomeOutlined', HomeOutlined)
app.component('InfoCircleOutlined', InfoCircleOutlined)
app.component('DownOutlined', DownOutlined)
app.component('SmileOutlined', SmileOutlined)
app.component('UserOutlined', UserOutlined)
app.component('LockOutlined', LockOutlined)
app.component('VideoCameraOutlined', VideoCameraOutlined)
app.component('ProjectOutlined', ProjectOutlined)
app.component('ApartmentOutlined', ApartmentOutlined)
app.component('DatabaseOutlined', DatabaseOutlined)
app.component('PlusOutlined', PlusOutlined)
app.component('UndoOutlined', UndoOutlined)
app.component('EditOutlined', EditOutlined)
app.component('DeleteOutlined', DeleteOutlined)
app.component('ExclamationCircleOutlined', ExclamationCircleOutlined)
app.component('SearchOutlined', SearchOutlined)
app.component('EyeOutlined', EyeOutlined)
app.component('ReloadOutlined', ReloadOutlined)
app.component('UploadOutlined', UploadOutlined)

app.mount('#app')
