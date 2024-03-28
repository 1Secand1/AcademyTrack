import { createRouter, createWebHistory } from 'vue-router'
import { getCookie, setCookie } from '../utils/cookie.js'

const routes = [
  {
    alias: '/',
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        alias: '',
        path: 'userGroups',
        name: 'userGroups',
        component: () => import('../views/UserGroups.vue')
      },
      {
        path: 'groupStatistics',
        name: 'groupStatistics',
        component: () => import('../views/GroupStatistics.vue')
      }
    ]
  },
  {
    path: '/authorization',
    name: 'authorization',
    component: () => import('../views/Authorization.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const publiclyRoutes = ['authorization']

router.beforeEach((to) => {
  const thisUserAuthorized = !!getCookie('token')
  const thisRoutePublic = publiclyRoutes.includes(to.name)

  if (thisUserAuthorized && thisRoutePublic) router.push('/')

  thisUserAuthorized || thisRoutePublic ? true : router.push('authorization')
})

export default router
