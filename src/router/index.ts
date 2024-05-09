import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Teimer from '../components/Teimer.vue'
import TeimerChain from '../components/TeimerChain.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/teimer',
      name: 'Single teimer',
      component: Teimer
    },
    {
      path: '/teimer-chain',
      name: 'Teimer Chain',
      component: TeimerChain
    }
  ]
})

export default router
