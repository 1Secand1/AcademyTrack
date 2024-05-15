<template>
	<div class="dashboard-content">
		<menu class="sidebar-menu">
			<h2 class="sidebar-menu__title">AcademyTrack</h2>

			<ul class="sidebar-menu__list">
				<li class="sidebar-menu__item sidebar-menu__item--title-category">
					Категория
				</li>
				<li class="sidebar-menu__item">
					<span class="pi pi-users"></span>
					<router-link :to="{ name: 'userGroups' }">
						Ваши группы
					</router-link>
				</li>
				<li class="sidebar-menu__item">
					<span class="pi pi-users"></span>
					<router-link :to="{ name: 'studentGroup' }">
						Группы
					</router-link>
				</li>
				<li class="sidebar-menu__item sidebar-menu__item--title-category">
					Администрирование
				</li>
				<li class="sidebar-menu__item sidebar-menu__item--title-category">
					<span class="pi pi-credit-card"></span>
					<router-link :to="{ name: 'settingsGroups' }">
						Управление
					</router-link>
				</li>
			</ul>

			<Button
				class="logOut-button"
				label="Выйти"
				severity="danger"
				@click="logOut"
			/>
		</menu>
		<main class="main">
			<router-view />
		</main>
	</div>
</template>

<script setup>
import Button from 'primevue/button'

import router from '@router/index.js'
import { setCookie } from '@utils/cookie.js'

function logOut() {
	setCookie('token', 0)
	router.push({ path: '/authorization' })
}
</script>

<style>
.dashboard-content {
	display: flex;
	background: #f8fafc;
}

.main {
	width: 100%;
	padding: 0 20px;
}

.sidebar-menu {
	display: flex;
	flex-direction: column;

	max-width: 200px;
	height: 100svh;
	border-radius: 5px;
	border-right: 2px solid #e2e8f0;
	background: #ffffff;

	margin: 0;
	padding: 10px;
}

.sidebar-menu__title {
	margin: 0;
}

.sidebar-menu__list {
	display: grid;
	list-style-type: none;

	margin: 0;
	margin-top: 20px;
	padding: 0;
}

.sidebar-menu__item {
	display: flex;
	align-items: center;

	border-radius: 5px;

	padding: 5px;
	gap: 10px;

	transition: all 0.3s ease-in-out;
}

.sidebar-menu__item--title-category {
	font-weight: 600;
}

.sidebar-menu__item:hover {
	background: #f1f5f9;
	cursor: pointer;
}

.logOut-button {
	margin-top: auto;
}
</style>
