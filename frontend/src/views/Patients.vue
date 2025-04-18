
<template>
  <div>
    <h1>Patients</h1>
    <Search
        :search="search"
        @search-click="onSearchClick"
    />
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Text</th>
          <th>Name</th>
          <th>Second name</th>
          <th>Gender</th>
          <th>Birthday</th>
          <th>Updated</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td>
            <a :href='item?.fullUrl' target="_blank">
              {{ item?.resource?.id || 'N/A' }}
            </a>
          </td>
          <td
            v-html="item?.resource?.text?.div || 'N/A'"
            @click="navigateToDetail(item?.resource?.id)"
          >
          </td>

          <td>{{ nameFormating(item?.resource?.name) || 'N/A' }}</td>
          <td>{{ familyFormating(item?.resource?.name) || 'N/A' }}</td>
          <td>{{ item?.resource?.gender || 'N/A' }}</td>
          <td>{{ (item?.resource?.birthDate && dateFormater(item?.resource?.birthDate)) || 'N/A' }}</td>
          <td>{{ item?.resource?.meta?.lastUpdated && dateFormater(item?.resource?.meta?.lastUpdated) || 'N/A' }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="errorMessage" style="color: red;">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import formatters from '../utils/formatters.js'
import Search from "../components/Search.vue";
import {useRoute} from "vue-router";
import search from "../components/Search.vue";

export default {
  name: 'Patients',
  components: {Search},
  data() {
    return {
      data: [],
      search: search,
      errorMessage: '',
    };
  },

  methods: {
    dateFormater(date) {
      return formatters.dateFormater(date);
    },
    navigateToDetail(id) {
      this.$router.push({
        name: 'Patient',
        query: { id },
      });
    },
    nameFormating(name) {
      if (
          Array.isArray(name) &&
          name.length &&
          name[0].given &&
          Array.isArray(name[0].given)
      ) {
        return name[0].given[0];
      }
      return null;
    },
    familyFormating(name) {
      if (Array.isArray(name)) {
        return name[0].family;
      }
      return undefined;
    },
    async onSearchClick(searchValue) {
      console.log(searchValue);

      if (searchValue.length < 3) {
        return;
      }

      const params = {};

      if (/^[\d-]+$/.test(searchValue)) {
        params.id = searchValue;
      } else {
        params.name = searchValue;
      }

      try {
        const response = await fetch('http://localhost:3000/api/patients/search', {
          method: 'GET',
          cache: 'no-cache',
        });

        console.log('response ', response)
      } catch (e) {
        console.log('No parameters found in the URL!')
      }
    },
    async fetchData() {
      try {
        const response = await fetch('http://localhost:3000/api/patients', {
          method: 'GET',
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(
              'Ошибка ответа от сервера: ' + response.statusText
          );
        }

        const responseData = await response.json();
        this.data = responseData?.entry || [];
      } catch (error) {
        this.errorMessage = 'Произошла ошибка при загрузке данных!';
        console.error(error);
      }
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  text-align: left;
}
th, td {
  border: 1px solid #ddd;
}
td:nth-child(2) {
  cursor: pointer;
}
td:nth-child(2):hover {
  background-color: #4735e0;
}
</style>
