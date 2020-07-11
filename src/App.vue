<template>
  <div id="app">
    <nav class="teal">
      <a class="brand-logo center">Logo</a>
    </nav>
    <div class="container">
      <EventList></EventList>
    </div>
  </div>
</template>

<script>
import EventList from './components/EventList.vue'

export default {
  name: 'App',
  components: {
    EventList
  }
}
</script>

<style scoped>
  nav{
    margin-bottom: 20px;
  }
</style>
