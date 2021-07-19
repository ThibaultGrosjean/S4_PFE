<template>
  <v-overlay :value="loading" :opacity="0" class="margin-correct-bar">
    <v-progress-circular
        indeterminate
        size="64"
        color="primary"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: "ProgressOverlay",
  props: ['loading'],
}
</script>

<style scoped>
.margin-correct-bar {
  margin-left: 67px !important;
}
</style>