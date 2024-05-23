import { getCookie } from '@utils/cookie.js';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const router = createRouter({
	history: createWebHistory(),
	routes,
});

const publiclyRoutes = ['authorization'];

router.beforeEach(to => {
	const thisUserAuthorized = !!getCookie('token');
	const thisRoutePublic = publiclyRoutes.includes(to.name);

	if (thisUserAuthorized && thisRoutePublic) router.push('/');

	thisUserAuthorized || thisRoutePublic ? true : router.push('authorization');
});

export default router;
