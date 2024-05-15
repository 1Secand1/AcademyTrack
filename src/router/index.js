import { getCookie } from '@utils/cookie.js'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		alias: '/',
		path: '/dashboard',
		name: 'dashboard',
		component: () => import('@views/DashboardPage.vue'),
		children: [
			{
				alias: '',
				path: 'userGroups',
				name: 'userGroups',
				component: () => import('@views/UserGroupsPage.vue'),
			},
			{
				path: 'groupStatistics',
				name: 'groupStatistics',
				component: () => import('@views/GroupStatisticsPage.vue'),
			},
			{
				path: 'studentGroup',
				name: 'studentGroup',
				component: () => import('@views/StudentGroupPage.vue'),
			},
			{
				path: 'settingsGroups',
				name: 'settingsGroups',
				component: () => import('@views/DataChangePage.vue'),
			},
		],
	},
	{
		path: '/authorization',
		name: 'authorization',
		component: () => import('@views/AuthorizationPage.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

const publiclyRoutes = ['authorization']

router.beforeEach(to => {
	const thisUserAuthorized = !!getCookie('token')
	const thisRoutePublic = publiclyRoutes.includes(to.name)

	if (thisUserAuthorized && thisRoutePublic) router.push('/')

	thisUserAuthorized || thisRoutePublic ? true : router.push('authorization')
})

export default router
