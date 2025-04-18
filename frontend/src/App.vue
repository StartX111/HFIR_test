
<template>
  <div >
    <nav>
      <router-link to="/">Patients</router-link> |
      <router-link to="/patient">Patient</router-link>
    </nav>
    <router-view></router-view>
  </div>

</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const isLoading = ref(false);
    const router = useRouter();

    router.beforeEach((to, from, next) => {
      isLoading.value = true;
      next();
    });

    router.afterEach(() => {
      isLoading.value = false;
    });

    return { isLoading };
  },
};
</script>

<style scoped>
.spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5em;
  color: #555;
}
</style>
