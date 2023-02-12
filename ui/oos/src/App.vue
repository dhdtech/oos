<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      response: {
        secret_value: ''
      },
      messageHeader: '',
      messageSubheader: '',
      urls: null,
      secret_id: '',
      recovery_key: '',
      locale: '',
      buttonValue: '',
      buttonBehavior: '',
      translations: {}
    }
  },  
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.secret_id = urlParams.get('id')!;
    this.recovery_key = urlParams.get('xnxsoss')!;
    
    if (urlParams.get('locale') === null) {
      this.locale = 'en-us'
      let current_url = window.location.href
      current_url = current_url + `?locale=${this.locale}`
      window.history.pushState({}, '', current_url);
    }else{
      this.locale = urlParams.get('locale')!;
    }

    // Get translations from the server
    axios
      .get(`http://localhost:6661/locale/${this.locale}`)
      .then((response) => {
        console.log(response.data)
        this.translations = response.data
        console.log(this.translations)
      })



    if (this.secret_id && this.recovery_key) {
      axios
        .get(`http://localhost:6661/secret/${this.secret_id}?locale=${this.locale}&xnxsoss=${this.recovery_key}`)
        .then((response) => {
          this.response = response.data
          this.messageHeader = 'Here is your secret!'
          this.messageSubheader = 'This is the only time you will see it. Keep it safe!'
          this.buttonValue = 'Copy Secret!'
          this.buttonBehavior = 'copyURL'
        })
    }else{
      this.messageHeader = 'Only once share!'
      this.messageSubheader = 'Share securely and only with one person, once.'
      this.buttonValue = 'Share It!'
      this.buttonBehavior = 'shareIt'
    }
  },
  methods: {
    handleMessageChange(urls: null, messageHeader: string, messageSubheader: string) {
      this.urls = urls;
      this.messageHeader = messageHeader;
      this.messageSubheader = messageSubheader;
    }
  }
}
</script>

<template>
  <div class="body-desktop" onclick="">
    <div class="body-ct-header-desktop">
      <Header />
    </div>

    <div class="body-ct-message-desktop">
      <Message
      :header="messageHeader"
      :subheader="messageSubheader"
      :urls="urls"
      @change-message="handleMessageChange"
      />
    </div>

    <div class="body-ct-input-desktop">
      <Input 
      :textboxValue="response.secret_value" 
      :buttonValue="buttonValue" 
      :buttonBehavior="buttonBehavior"
      @change-message="handleMessageChange"
      />
    </div>

    <div class="body-ct-footer-desktop">
      <Footer poweredBy="Powered by DHD Tech Solutions" message="https://dhdtech.io" />
    </div>
  </div>
</template>

<style>
body {
  background: #181818;
  margin: 0px;
}
</style>

<style scoped>
.body-desktop,
.body-desktop * {
  box-sizing: border-box;
}

.body-desktop {
  background: var(--darkbackground, #181818);
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.body-ct-header-desktop {
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.body-ct-message-desktop {
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.body-ct-input-desktop {
  padding: 38px 0px 38px 0px;
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  flex: 1;
  position: relative;
}

.body-ct-footer-desktop {
  background: var(--darkbackground, #181818);
  padding: 50px 0px 50px 0px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
