<template>
  <top-nav />

  <main>
    <router-view />
  </main>

  <nav class="footer-nav px-3 bg-light">
  </nav>

  <footer class="p-2 bg-light text-center">
    <small>Copyright © 2022 Okinawa School of Foreign Languages. All Rights Reserved.</small>
  </footer>
</template>

<script>
import TopNav from './components/TopNav.vue';

export default {
  components: {
    'top-nav': TopNav,
  },
  mounted() {
    this.$store.dispatch('initializeApp')
  }
}
</script>

<style scoped>
main {
  position: relative;
  left: 0;
  top: 0;
  bottom: 0;
}

main>*:first-child {
  flex: 1;
}

footer {
  position: relative;
  z-index: 1;
}

.footer-nav {
  position: relative;
  z-index: 1;
  height: 300px;
}

.custom-bg-success {
  /* animation: successBgBlink 1s infinite; */
  background-color: #83f1a4;
}

@keyframes successBgBlink {
  0% {
    background-color: #b7ffcc;
  }

  25% {
    background-color: #83f1a4;
  }

  50% {
    background-color: #54eb81;
  }

  75% {
    background-color: #26d65b;
  }

  100% {
    background-color: #00bc39;
  }
}

.custom-bg-danger {
  /* animation: dangerBgBlink 1s infinite; */
  background-color: #ff7b7b;
}

@keyframes dangerBgBlink {
  0% {
    background-color: #ffbaba;
  }

  25% {
    background-color: #ff7b7b;
  }

  50% {
    background-color: #ff5252;
  }

  75% {
    background-color: #ff0000;
  }

  100% {
    background-color: #a70000;
  }
}
</style>
