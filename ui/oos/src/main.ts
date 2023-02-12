import { createApp } from 'vue'
import './assets/scss/default.scss'
import App from './App.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Input from './components/Input.vue'
import Message from './components/Message.vue'
import CountryFlag from 'vue-country-flag-next'

const app = createApp(App)
app.component('Header', Header)
app.component('Footer', Footer)
app.component('Input', Input)
app.component('Message', Message)
app.component('CountryFlag', CountryFlag)
app.mount('#app')
