import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {  
    path: '/',
    name: 'home',
    // component below is pre-loaded (in imports above):
    component: HomeView,
    props: route => ({ PageName: route.name })
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // if the browser supports scroll behavior
    if ('scrollBehavior' in document.documentElement.style) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ top: 0, behavior: 'smooth' });
        }, 100); // delay the scroll after navigation
      });
    } else {
      // fallback for browsers not supporting smooth scroll
      return { top: 0 };
    }
  },
});

/* eslint-disable no-console */     
router.beforeEach(async(to, from, next) => {    
  if (to.matched.some(record => record.meta.requiresAuth)) {    
    if (await getCurrentUser()) {    
      next();    
    } else {    
      /* alert("You need to be logged in to access this resource."); */
      next("/");    
    }    
  } else {    
    next();    
  }    
});

export default router