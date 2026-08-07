import { createRouter, createWebHistory } from 'vue-router'
import ExampleView from '@/views/ExampleView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ExampleView
  },
  {
    path: '/example',
    name: 'Example',
    component: ExampleView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router