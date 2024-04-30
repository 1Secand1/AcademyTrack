<template>
	<section class='fileUploadBox'>
		<h2>Загрузить файл</h2>

		<FileUpload
			chooseLabel='Загрузить'
			pt:root:class='fileUploadBox__button'
			mode="basic"
			name="demo[]"
			url="/api/upload"
			accept="image/*"
			:maxFileSize="1000000"
			@upload=""
		/>
	</section>
</template>

<script setup>
import FileUpload from 'primevue/fileupload'

</script>

<style>
.fileUploadBox {}

.fileUploadBox__button {
	display: flex;
}
</style>