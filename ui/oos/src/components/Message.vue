<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  header: string,
  subheader: string,
}>()
</script>

<script lang="ts">

export default {
    methods: {
      removeElement(elementId: string) {
      document.getElementById(elementId)!.remove();
    },      
      async copyURL(texToBeCopied: string) {
      try {
        await navigator.clipboard.writeText(texToBeCopied);
        this.$emit("change-message", null, this.$t("main_page.message_header_copied"), this.$t("main_page.message_subheader_copied"))
        this.removeElement('subheaderLinks');
      } catch($e) {
        console.log($e)
      }
    }
  }
}

</script>

<template>
  <div class="message-desktop">
    <div class="message-header-desktop">
      <div class="message-header-text-desktop">{{ header }}</div>
    </div>
    <div class="message-subheader-desktop">
      <div class="message-subheader-text-desktop">
        {{ subheader }}
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: var(--lighttext, #ffffff);
  text-decoration: none;
}

.message-desktop,
.message-desktop * {
  box-sizing: border-box;
}

@media only screen and (max-width: 768px) {
  .message-desktop {
    display: flex;
    flex-direction: column;
    gap: 17px;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    overflow: hidden;
  }

  .message-header-desktop {
    padding: 10px 10px 10px 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  .message-header-text-desktop {
    color: var(--lighttext, #ffffff);
    text-align: center;
    font: var(--headline, 700 40px/44px "Arial", sans-serif);
    position: relative;
  }

  .message-subheader-desktop {
    padding: 10px 10px 10px 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  .message-subheader-text-desktop {
    color: var(--lighttext, #ffffff);
    text-align: center;
    font: 400 16px/20px "Arial", sans-serif;
    position: relative;
  }
}

@media only screen and (min-width: 769px) {
  .message-desktop {
    display: flex;
    flex-direction: column;
    gap: 17px;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    overflow: hidden;
  }

  .message-header-desktop {
    padding: 10px 10px 10px 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  .message-header-text-desktop {
    color: var(--lighttext, #ffffff);
    text-align: center;
    font: var(--headline, 700 80px/88px "Arial", sans-serif);
    position: relative;
  }

  .message-subheader-desktop {
    padding: 10px 10px 10px 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  .message-subheader-text-desktop {
    color: var(--lighttext, #ffffff);
    text-align: center;
    font: 400 20px/30px "Arial", sans-serif;
    position: relative;
  }  
}

</style>