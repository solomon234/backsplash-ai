<template>
  <div class="home-container">
    <h1>Welcome to My Nuxt.js Application</h1>
    <p>This is the home page of the application.</p>
    <div class="links">
      <NuxtLink to="/hello-world" class="link-button">Go to Hello World Page</NuxtLink>
    </div>
  </div>
</template>

<script setup>
// You can add script logic here if needed
</script>

<style scoped>
.home-container {
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
  color: #2c3e50;
}

p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.links {
  margin-top: 20px;
}

.link-button {
  display: inline-block;
  background-color: #41b883; /* Vue.js green */
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.link-button:hover {
  background-color: #34495e;
  text-decoration: none;
}
</style>