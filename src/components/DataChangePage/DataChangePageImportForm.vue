<template>
  <section class="fileUploadBox">
    <h2>Загрузить файл</h2>

    <FileUpload
      class="fileUploadBox__button"
      choose-label="Загрузить"
      mode="basic"
      name="demo[]"
      url="/api/upload"
      accept="image/*"
      :max-file-size="1000000"
      @upload=""
    />
  </section>
</template>

<script setup>
  import FileUpload from 'primevue/fileupload';

</script>

<style>
.fileUploadBox {}

.fileUploadBox__button {
	display: flex;
	margin-top: 20px;
}
</style>