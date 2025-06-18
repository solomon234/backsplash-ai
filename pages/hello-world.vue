<template>
  <div class="hello-world-container">
    <h1>Hello, World!</h1>
    <p>This is my first Nuxt.js page.</p>
    <NuxtLink to="/">Back to Home</NuxtLink>
  </div>
</template>

<script setup>
// You can add script logic here if needed
</script>

<style scoped>
.hello-world-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #41b883; /* Vue.js green */
}

p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

a {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>