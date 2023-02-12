<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  textboxValue: string,
  buttonValue: string,
  buttonBehavior: string,
}>()

const count = ref(0)
</script>

<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      globalResponse: {
        secret_id: '',
        recovery_key: '',
        ttl: 0,
      }
    }
  },  
  methods: {
    handleClick() {
      if (this.buttonBehavior === 'shareIt') {
        const payload = {
        secret_value: document.getElementById('secretValue')!.innerText
          };
          axios
          .post('http://localhost:6661/secret/?locale=pt-br', payload)
          .then((response) => {
            if (response.status ==   200){
              this.removeElement('shareItButton');
              this.removeElement('secretValue');
              let urls = this.buildShareableUrls(response.data);
              let messageHeader = 'OK! We already encrypted everything for you.'
              let messageSubheader = 'Copy the link in the preferred language of the person who will get the value.'
              this.$emit("change-message", urls, messageHeader, messageSubheader)
            }
          })
      }else{
        this.copyURL(this.textboxValue);
        this.removeElement('shareItButton');
        this.removeElement('secretValue');
        let messageHeader = 'Secret copied to clipboard!'
        let messageSubheader = 'Never share this secret with anyone. Keep it safe!'
        this.$emit("change-message", null, messageHeader, messageSubheader)
      }
    },
    async copyURL(texToBeCopied: string) {
      try {
        await navigator.clipboard.writeText(texToBeCopied);
      } catch($e) {
        console.log($e)
      }
    },
    removeElement(elementId: string) {
      document.getElementById(elementId)!.remove();
    },
    buildShareableUrls(response: any) {
      const shareableUrls = {
        us: `http://127.0.0.1:5173/?id=${response.secret_id}&locale=en-us&xnxsoss=${response.recovery_key}`,
        br: `http://127.0.0.1:5173/?id=${response.secret_id}&locale=pt-br&xnxsoss=${response.recovery_key}`,
        es: `http://127.0.0.1:5173/?id=${response.secret_id}&locale=es-es&xnxsoss=${response.recovery_key}`
      }
      return shareableUrls;
    }
  },
  mounted() {
    // get gurrent locale from url querysteing
    


  },
}
</script>

<template>
  <div class="input-desktop">
    <div id="secretValue" class="input-textbox-desktop" contenteditable>{{ textboxValue }}</div>
    <div id="shareItButton" class="input-button-desktop" @click="handleClick()">
      <div class="input-button-text-desktop">
        <div>{{buttonValue}}</div>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-desktop,
.input-desktop * {
  box-sizing: border-box;
}



.input-desktop {
  display: flex;
  flex-direction: column;
  gap: 17px;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
}

.input-textbox-desktop {
  -moz-appearance: textfield-multiline;
  -webkit-appearance: textarea;
  font: 400 20px/30px "Arial", sans-serif;
  background: #efefef;
  border-radius: 10px;
  border: solid #d0d0d0;
  border-width: 1px;
  padding: 33px 28px 33px 28px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  width: 800px;
  height: 400px;
  position: relative;
  overflow: hidden;

}

.input-button-desktop {
  background: var(--primary, #4452fe);
  padding: 10px 30px 10px 30px;
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 800px;
  position: relative;
  box-shadow: var(--shadow-box-shadow, 0px 4px 31px 0px rgba(0, 0, 0, 0.15));
  overflow: hidden;
  cursor: pointer;
}

/* input-button-desktop Hover */
.input-button-desktop:hover {
  background: var(--primary-hover, #3a46e0);
}

.input-button-text-desktop {
  padding: 10px 10px 10px 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  color: var(--lighttext, #ffffff);
  text-align: left;
  font: var(--button, 700 17px/25px "Arial", sans-serif);
  position: relative;
}

</style>

