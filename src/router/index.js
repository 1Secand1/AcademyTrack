import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { authService } from '@service/auth.js';

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { top: 0 };
		}
	}
});

router.beforeEach(async (to, from, next) => {
	try {
		const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
		const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
		const isAuthenticated = authService.isAuthenticated();
		const isAdmin = authService.isAdmin();

		if (requiresAuth && !isAuthenticated) {
			next({ name: 'login' });
			return;
		}

		if (requiresAdmin && !isAdmin) {
			next({ name: 'home' });
			return;
		}

		if (to.name === 'login' && isAuthenticated) {
			next({ name: 'home' });
			return;
		}

		next();
	} catch (error) {
		console.error('Navigation error:', error);
		next({ name: 'login' });
	}
});

router.afterEach((to, from) => {
	window.scrollTo(0, 0);
});

router.onError((error) => {
	console.error('[Router] Global navigation error:', {
		error: error.message,
		stack: error.stack
	});
});

export default router;
