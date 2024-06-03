<script setup>
import ShowAllNotes from '@/components/showAllNotes.vue';
</script>


<template>

  <main>
    <ShowAllNotes :key="$route.fullPath" />
  </main>

</template>


<style scoped>

</style>