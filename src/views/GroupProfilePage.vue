<template>
	<p>Профиль группы {{ groupCode }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()
const groupCode = ref(route.query.codeGroup)

</script>