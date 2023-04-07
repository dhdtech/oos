import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

import './assets/scss/default.scss'
import App from './App.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Input from './components/Input.vue'
import Message from './components/Message.vue'
import CountryFlag from 'vue-country-flag-next'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  availableLocales: ["en", "es", "pt"],
  messages: messages,
});

const app = createApp(App)

const urlParams = new URLSearchParams(window.location.search);

let locale = 'en-us'

if (urlParams.get('locale') === null) {
    window.history.pushState({}, '', window.location.href + `?locale=${locale}`);
  }else{
    locale = urlParams.get('locale')!;
  }

app.component('Header', Header)
app.component('Footer', Footer)
app.component('Input', Input)
app.component('Message', Message)
app.component('CountryFlag', CountryFlag)
app.config.globalProperties.locale = locale
app.use(createPinia())
app.use(i18n)
app.mount('#app')


