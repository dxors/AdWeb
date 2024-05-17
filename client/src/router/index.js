import { createRouter, createWebHistory } from 'vue-router'
import auth from '../views/auth.vue'
import stock from '../views/stock.vue'
import drivers from '../views/drivers.vue'
import cars from '../views/cars.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: auth
    },
    {
      path: '/stock',
      name: 'stock',
      component: stock
    },
    {
      path: '/drivers',
      name: 'drivers',
      component: drivers
    },
    {
      path: '/cars',
      name: 'cars',
      component: cars
    }
  ]
})

export default router
