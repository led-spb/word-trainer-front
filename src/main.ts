import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuestic } from 'vuestic-ui'
import "vuestic-ui/css"
import "material-design-icons-iconfont/dist/material-design-icons.min.css";


import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)

app.use(createPinia())
app.use(createVuestic())
app.use(router)

app.mount('#app')
