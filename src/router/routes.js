const dashboardRoutes = [
	{
		alias: '',
		path: 'user-groups',
		name: 'userGroups',
		component: () => import('@views/UserGroupsPage.vue'),
	},
	{
		path: 'group-statistics',
		name: 'groupStatistics',
		component: () => import('@views/GroupStatisticsPage.vue'),
	},
	{
		path: 'student-group',
		name: 'studentGroup',
		component: () => import('@views/StudentGroupPage.vue'),
		children: [
			{
				alias: '',
				path: 'selection',
				name: 'groupSelection',
				component: () => import('@views/GroupSelectionPage.vue'),
			},
			{
				path: 'profile',
				name: 'groupProfile',
				component: () => import('@views/GroupProfilePage.vue'),
			},
		],
	},
	{
		path: 'settings-groups',
		name: 'settingsGroups',
		component: () => import('@views/DataChangePage.vue'),
	},
];

export const routes = [
	{
		alias: '/',
		path: '/dashboard',
		name: 'dashboard',
		component: () => import('@views/DashboardPage.vue'),
		children: dashboardRoutes,
	},
	{
		path: '/authorization',
		name: 'authorization',
		component: () => import('@views/AuthorizationPage.vue'),
	},
];
