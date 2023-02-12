<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  poweredBy: string,
  message: string,
}>()

const count = ref(0)
</script>
<template>
    <div class="footer-desktop-container">
        <div class="footer-desktop-row">
            <div class="footer-desktop-block">
                <div class="footer-desktop-content">
                    <div class="footer-desktop-text">
                        {{ poweredBy }}<br />
                        {{ message }}
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.footer-desktop-container,
.footer-desktop-container * {
    box-sizing: border-box;
}

.footer-desktop-container {
    display: flex;
    flex-direction: row;
    gap: 199px;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.footer-desktop-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    justify-content: flex-start;
    flex-shrink: 0;
    width: 1579px;
    position: relative;
    overflow: hidden;
}

.footer-desktop-block {
    display: flex;
    flex-direction: row;
    gap: 0px;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
}

.footer-desktop-content {
    padding: 0px 8px 0px 8px;
    display: flex;
    flex-direction: row;
    gap: 0px;
    align-items: center;
    justify-content: center;
    flex: 1;
    position: relative;
    overflow: hidden;
}

.footer-desktop-text {
    color: var(--lighttext, #ffffff);
    text-align: center;
    font: var(--link, 700 16px/24px "Arial", sans-serif);
    position: relative;
}
</style>