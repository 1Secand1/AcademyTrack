<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
	display: flex;
	width: 380px;
	height: 75px;

	padding: 10px;
	align-items: center;
	border-radius: 5px;
	border: solid 1px #2196F3;
}
</style>