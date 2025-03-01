import { getCookie } from '@utils/cookie.js';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const router = createRouter({
	history: createWebHistory(),
	routes,
});

const publiclyRoutes = ['authorization'];

// router.beforeEach(to => {
//   const isUserAuthorized = !!getCookie('token');
//   const isRoutePublic = publiclyRoutes.includes(to.name);
//
//  if (isUserAuthorized && isRoutePublic) {
// 		router.push({ name:'userGroups' });
//  }
//
//  if (!isUserAuthorized && !isRoutePublic) {
// 	router.push({ name:'authorization' });
//  }
// });

export default router;
