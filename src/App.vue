<script setup>
import { ref } from 'vue';
import { dbMgr } from '@/state/dbInterface';
import { DBManager } from '@/dataGateway/DBManager';
import PageHeader from '@/components/page_sections/pageHeader.vue';
import PageFooter from '@/components/page_sections/pageFooter.vue';
import AllNotes from  '@/components/showAllNotes.vue';

const isDbInitialized = ref(false);

dbMgr.value = new DBManager({dbname: 'DB21022839'});

dbMgr.value.initialise().then(() => {
  isDbInitialized.value = true;
});

// A reactive variable that changes when I want to trigger a reload
const reloadTrigger = ref(0);

const handleReloadRequest = () => {
  // Change the trigger to notify the child component
  reloadTrigger.value++;
};

</script>


<template>

  <header class="sticky top-[0px] w-[100%] z-999">
    <PageHeader />
  </header>

  <main class="w-[100%] mh-[100vh] mx-auto px-[10px] md:mt-[25px] ">

    <article>
      
      <!-- Show app only when the DB is initialized -->
      <div v-if="isDbInitialized" class="mh-[100vh]">
        <AllNotes :reloadTrigger="reloadTrigger" />
      </div>

      <div v-else class="flex justify-center items-center mh-[100vh] mt-[50px]">
        <section id="appLoading">
          <h1>Application initialising, please wait.</h1>
          <img src="@/assets/Spinner-1s-264px.gif" alt="Application loading."/>
        </section>
      </div>

    </article>

  </main>

  <footer class="sticky bottom-[0px] w-[100%] h-[75px] z-999">
    
    <!-- Show footer only when the DB is initialized -->
    <div v-if="isDbInitialized" class="mh-[100vh]">
      <PageFooter @reloadRequest="handleReloadRequest" />
    </div>
    
  </footer>

</template>


<style scoped>

</style>
