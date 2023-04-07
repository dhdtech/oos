<template>
  <div class="body-desktop" onclick="">
    <div class="body-ct-header-desktop">
      <Header />
    </div>

    <div class="body-ct-message-desktop">
      <Message :header="messageHeader" :subheader="messageSubheader"
        @change-message="handleMessageChange" />
    </div>

    <div class="body-ct-input-desktop">
      <Input :textboxValue="response.secret_value"
        :buttonValue="buttonValue"
        :buttonBehavior="buttonBehavior"
        :locale="locale"
        :shareableUrl="shareableUrl"
        :disableTextBox="disableTextBox"
        @change-message="handleMessageChange" />
    </div>

    <div class="body-ct-footer-desktop">
      <Footer :poweredBy="$t('commom.powered_by')" :message="$t('commom.powered_by_link')" />
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
      shareableUrl: null,
      secret_id: '',
      recovery_key: '',
      buttonValue: '',
      buttonBehavior: '',
      locale: 'en',
      disableTextBox: false
    }
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);

    this.locale = urlParams.get('locale')!;
    this.secret_id = urlParams.get('id')!;
    this.recovery_key = urlParams.get('xnxsoss')!;
    
    this.$i18n.locale = this.locale;

    if (this.secret_id && this.recovery_key) {
      axios
        .get(`http://localhost:6661/secret/${this.secret_id}?locale=${this.locale}&xnxsoss=${this.recovery_key}`)
        .then((response) => {
          this.response = response.data
          this.messageHeader = this.$t("retrieval_page.message_header");
          this.messageSubheader = this.$t("retrieval_page.message_subheader");
          this.buttonValue = this.$t("retrieval_page.button_value");
          this.buttonBehavior = 'copyURL';
          this.disableTextBox = true;
        }).catch((error) => {
          if (error.response.status === 404) {
            
            alert(this.$t('secret_expired'));
            const currentHost = window.location.host;
            const currentLocale = urlParams.get('locale')!;
            window.location.href = `http://${currentHost}/?locale=${currentLocale}`;

            
          }
        })
    } else {
      this.messageHeader = this.$t("main_page.message_header");
      this.messageSubheader = this.$t("main_page.message_subheader");
      this.buttonValue = this.$t("main_page.button_value");
      this.buttonBehavior = 'shareIt'
    }
  },
  methods: {
    handleMessageChange(shareableUrl: null, messageHeader: string, messageSubheader: string, buttonValue: string, disableTextBox: boolean) {
      this.buttonBehavior = 'copyUrl'
      this.shareableUrl = shareableUrl;
      this.messageHeader = messageHeader;
      this.messageSubheader = messageSubheader;
      this.buttonValue = buttonValue;
      this.disableTextBox = disableTextBox;
    },
  },
}
</script>