import { getCookie } from '@utils/cookie.js';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { authService } from '@service/auth.js';

const router = createRouter({
	history: createWebHistory(),
	routes
});

const publiclyRoutes = ['login'];

router.beforeEach(async (to) => {
	const isUserAuthorized = await authService.checkAuth();
	const isRoutePublic = publiclyRoutes.includes(to.name);
	const requiresAdmin = to.meta.requiresAdmin;

	if (isUserAuthorized && isRoutePublic) {
		return { name: 'userGroups' };
	}

	if (!isUserAuthorized && !isRoutePublic) {
		return { name: 'login' };
	}

	if (requiresAdmin && !authService.isAdmin()) {
		return { name: 'userGroups' };
	}
});

export default router;
