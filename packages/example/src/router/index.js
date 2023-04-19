import Vue from 'vue'
import VueRouter from 'vue-router'

const HelloWorld = () => import('@/components/HelloWorld.vue')
const List = () => import('@/views/list.vue')

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
    meta: {
      keppAlive: true
    }
  },
  {
    path: '/list',
    name: 'List',
    component: List,
    meta: {
      keppAlive: true
    }
  },
  {
    path: '/mRouterPage1',
    name: 'mRouterPage1',
    component: () => import('@/views/mRouterPage1.vue'),
    meta: {
      keppAlive: true
    }
  },
  {
    path: '/mRouterPage2',
    name: 'mRouterPage2',
    component: () => import('@/views/mRouterPage2.vue'),
    meta: {
      keppAlive: true
    }
  }
  
]
Vue.use(VueRouter)
const router = new VueRouter({
  routes: routes
})

export default router