<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  textboxValue: string;
  buttonValue: string;
  buttonBehavior: string;
  shareableUrl: string;
  locale: string;
  disableTextBox: boolean;
}>();

const count = ref(0);
</script>

<script lang="ts">
import axios from "axios";

export default {
  data() {
    return {
      globalResponse: {
        secret_id: "",
        recovery_key: "",
        ttl: 0,
      },
    };
  },
  methods: {
    handleClick() {
      if (this.buttonBehavior === "shareIt") {
        const payload = {
          secret_value: document.getElementById("secretValue")!.innerText,
        };
        let url = `http://localhost:6661/secret/?locale=${this.locale}`;
        axios
          .post(url, payload)
          .then((response) => {
            if (response.status == 200) {
              //this.removeElement("shareItButton");
              //this.removeElement("secretValue");
              this.maskTextBox("secretValue");
              console.log(response);
              let shareableLink = `http://localhost:5173/?id=${response.data.secret_id}&locale=${this.locale}&xnxsoss=${response.data.recovery_key}`
              this.$emit(
                "change-message",
                shareableLink,
                this.$t("main_page.message_header_encrypted"),
                this.$t("main_page.message_subheader_encrypted"),
                this.$t("main_page.message_click_to_copy")
              );

            }
          });
      } else if (this.buttonBehavior === "copyUrl") {
        this.copyURL(this.shareableUrl, this.$t("main_page.link_copied"));
      } else {
        this.copyURL(this.textboxValue, this.$t("retrieval_page.message_copied"));
        this.removeElement("shareItButton");
        this.removeElement("secretValue");
        this.$emit(
          "change-message",
          null,
          this.$t("retrieval_page.message_header_copied"),
          this.$t("retrieval_page.message_subheader_copied")
        );
      }
    },
    async copyURL(texToBeCopied: string, sucessMessage: string) {
      try {
        await navigator.clipboard.writeText(texToBeCopied);
        alert(sucessMessage);
      } catch ($e) {
        console.log($e);
      }
    },
    removeElement(elementId: string) {
      document.getElementById(elementId)!.remove();
    },
    maskTextBox(elementId: string) {
      let inputObj = document.getElementById(elementId);
      let maskedValue = inputObj!.innerText.replace(/./g, "*");
      inputObj!.innerText = maskedValue;
      this.disableElement(elementId);
      
    },
    disableElement(elementId: string) {
      document.getElementById(elementId)!.setAttribute("contenteditable", "false");
    },
  },
  mounted() {
    if(this.disableTextBox){
      this.disableElement("secretValue");
    };
  },
};
</script>

<template>
  <div class="input-desktop">
    <div id="secretValue" class="input-textbox-desktop" contenteditable>
      {{ textboxValue }}
    </div>
    <div id="shareItButton" class="input-button-desktop" @click="handleClick()">
      <div class="input-button-text-desktop">
        <div>{{ buttonValue }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-desktop,
.input-desktop * {
  box-sizing: border-box;
}
@media only screen and (max-width: 768px) {
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
    width: 400px;
    height: 200px;
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
    width: 400px;
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
}

@media only screen and (min-width: 769px) {
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
    width: 700px;
    height: 300px;
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
    width: 700px;
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
}

</style>
