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
	console.log('[Router] Navigation started:', {
		to: to.path,
		from: from.path,
		requiresAuth: to.meta.requiresAuth,
		requiresAdmin: to.meta.requiresAdmin
	});
	
	try {
		// Проверяем, требует ли маршрут аутентификации
		if (to.meta.requiresAuth) {
			console.log('[Router] Route requires auth');
			const isAuthenticated = await authService.checkAuth();
			console.log('[Router] Auth check result:', isAuthenticated);
			
			if (!isAuthenticated) {
				console.log('[Router] User not authenticated, redirecting to login');
				return next({ name: 'login', query: { redirect: to.fullPath } });
			}

			// Проверяем, требует ли маршрут прав администратора
			if (to.meta.requiresAdmin) {
				console.log('[Router] Route requires admin');
				const isAdmin = authService.isAdmin();
				console.log('[Router] Admin check result:', isAdmin);
				
				if (!isAdmin) {
					console.log('[Router] User is not admin, redirecting to home');
					return next({ name: 'home' });
				}
			}
		}

		// Если пользователь аутентифицирован и пытается попасть на страницу логина
		if (to.name === 'login' && authService.isAuthenticated()) {
			console.log('[Router] Authenticated user trying to access login, redirecting to home');
			return next({ name: 'home' });
		}

		console.log('[Router] Navigation allowed');
		next();
	} catch (error) {
		console.error('[Router] Navigation error:', {
			error: error.message,
			stack: error.stack,
			to: to.path,
			from: from.path
		});
		next({ name: 'login' });
	}
});

router.afterEach((to, from) => {
	console.log('[Router] Navigation completed:', {
		to: to.path,
		from: from.path,
		params: to.params,
		query: to.query
	});
});

router.onError((error) => {
	console.error('[Router] Global navigation error:', {
		error: error.message,
		stack: error.stack
	});
});

export default router;
