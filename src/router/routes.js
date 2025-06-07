import HomePage from '@views/HomePage.vue';
import AuthorizationPage from '@views/AuthorizationPage.vue';
import RegistrationPage from '@views/RegistrationPage.vue';
import UserGroupsPage from '@views/UserGroupsPage.vue';
import DataChangePage from '@views/DataChangePage.vue';
import TeachingAssignmentsPage from '@views/TeachingAssignmentsPage.vue';
import GroupProfilePage from '@views/GroupProfilePage.vue';
import SchedulePlanningPage from '@views/SchedulePlanningPage.vue';
import SubjectsPage from '@views/SubjectsPage.vue';
import ScheduleManagementPage from '@views/ScheduleManagementPage.vue';
import MenuPage from '@views/MenuPage.vue';
import GroupStatisticsPage from '@views/GroupStatisticsPage.vue';
import AllGroupsPage from '@views/AllGroupsPage.vue';

export const routes = [
	{
		path: '/',
		name: 'home',
		component: HomePage,
		meta: { requiresAuth: true },
	},
	{
		path: '/login',
		name: 'login',
		component: AuthorizationPage,
		meta: { requiresAuth: false },
	},
	{
		path: '/register',
		name: 'register',
		component: RegistrationPage,
		meta: { requiresAuth: true, requiresAdmin: true },
	},
	{
		path: '/user-groups',
		name: 'userGroups',
		component: AllGroupsPage,
		meta: { requiresAuth: true },
	},
	{
		path: '/data-change',
		name: 'dataChange',
		component: DataChangePage,
		meta: { requiresAuth: true, requiresAdmin: true },
	},
	{
		path: '/teaching-assignments',
		name: 'teachingAssignments',
		component: TeachingAssignmentsPage,
		meta: { requiresAuth: true, requiresAdmin: true },
	},
	{
		path: '/group/:groupId',
		name: 'groupProfile',
		component: GroupProfilePage,
		meta: { requiresAuth: true },
	},
	{
		path: '/schedule-planning',
		name: 'schedulePlanning',
		component: SchedulePlanningPage,
		meta: { requiresAuth: true, requiresAdmin: true },
	},
	{
		path: '/subjects',
		name: 'subjects',
		component: SubjectsPage,
		meta: { requiresAuth: true, requiresAdmin: true },
	},
	{
		path: '/schedule-management',
		name: 'scheduleManagement',
		component: ScheduleManagementPage,
		meta: { requiresAuth: true, requiresAdmin: true },
	},
	{
		path: '/menu',
		name: 'menu',
		component: MenuPage,
		meta: { requiresAuth: true },
	},
	{
		path: '/group-attendance',
		name: 'group-attendance',
		component: UserGroupsPage,
		meta: { requiresAuth: true },
	},
	{
		path: '/group-statistics/:teachingAssignmentId/:groupId',
		name: 'group-statistics',
		component: GroupStatisticsPage,
		props: true,
		meta: { requiresAuth: true },
	},
];
