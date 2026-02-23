import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

import AppButton from './components/ui/AppButton.vue'

const app = createApp(App)

app.component('AppButton', AppButton)

app.use(createPinia())
app.use(router)
app.mount('#app')
