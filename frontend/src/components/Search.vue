<template>
  <div>
    <input
        type="text"
        v-model="searchValue"
        placeholder="Search"
    />
    <button @click="handleSearch">Search</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchValue: '',
    };
  },
  methods: {
    handleSearch() {
      this.$emit('search-click', this.searchValue);
    },
  },
}
</script>

<style scoped>
</style>
