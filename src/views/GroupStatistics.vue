<template>
  Группа
  {{ groupCode }}

  <router-link to="/userGroups">Назад</router-link>
</template>

<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const groupCode = ref(route.query.codeGroup)

</script>

<style></style>