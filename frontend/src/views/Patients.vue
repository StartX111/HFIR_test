<template>
  <div>
    <h1>Patients</h1>
    <div class="searchWrap">
      <span>{{originalUrl}}</span>
      <Search
          :search="search"
          @search-click="onSearchClick"
      />
    </div>
    <div v-if="isLoading" class="loader-container">
      <SvgIcon type="mdi" :path="mdiLoading" class="loading-icon"></SvgIcon>
    </div>
    <table v-else>
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
        <td @click="navigateToDetail(item?.resource?.id)">{{ nameFormating(item?.resource?.name) || 'N/A' }}</td>
        <td @click="navigateToDetail(item?.resource?.id)">{{ familyFormating(item?.resource?.name) || 'N/A' }}</td>
        <td>{{ item?.resource?.gender || 'N/A' }}</td>
        <td>{{ (item?.resource?.birthDate && dateFormater(item?.resource?.birthDate)) || 'N/A' }}</td>
        <td>{{ item?.resource?.meta?.lastUpdated && dateFormater(item?.resource?.meta?.lastUpdated) || 'N/A' }}</td>
      </tr>
      </tbody>
    </table>
    <select id="number-select" v-model="selectedNumber" @change="fetchData()">
      <option v-for="number in numbers" :key="number" :value="number">
        {{ number }}
      </option>
    </select>
    <p v-if="errorMessage" style="color: red;">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import formatters from '../utils/formatters.js'
import Search from "../components/Search.vue";
import search from "../components/Search.vue";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLoading } from '@mdi/js';

export default {
  name: 'Patients',
  components: {
    Search,
    SvgIcon
  },
  data() {
    return {
      data: [],
      originalUrl: '',
      search: search,
      errorMessage: '',
      numbers: [10, 20, 30, 40],
      selectedNumber: 10,
      isLoading: false,
      mdiLoading,
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
      if (searchValue.length < 3) {
        return;
      }

      this.isLoading = true;
      try {
        const params = {};
        if (/^[a-zA-Z0-9]+([-][a-zA-Z0-9]+)+$/.test(searchValue)) {
          params.id = searchValue;
        } else {
          params.name = searchValue;
        }
        const queryString = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join(',');

        const response = await fetch(`/api/patients/search${queryString ? '?' + queryString : ''}`, {
          method: 'GET',
          cache: 'no-cache',
        });

        const responseData = await response.json();
        this.originalUrl = responseData?.originalUrl || undefined;
        this.data = responseData?.entry || [];
      } catch (e) {
        console.log('No parameters found in the URL!');
      } finally {
        this.isLoading = false;
      }
    },
    async fetchData() {
      this.isLoading = true;
      try {
        let query = '';
        if (this.selectedNumber > 10) {
          query = `?limit=${this.selectedNumber}`;
        }
        const response = await fetch(`/api/patients${query}`, {
          method: 'GET',
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(
              'Error in get information from server: ' + response.statusText
          );
        }
        const responseData = await response.json();
        this.originalUrl = responseData?.originalUrl || undefined;
        this.data = responseData?.entry || [];
      } catch (error) {
        this.errorMessage = 'Error loading data!';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.searchWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
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
td:nth-child(2), td:nth-child(3), td:nth-child(4) {
  cursor: pointer;
}
td:nth-child(2):hover, td:nth-child(3):hover, td:nth-child(4):hover  {
  background-color: #4735e0;
}
select {
  margin: 1rem;
}
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
.loading-icon {
  width: 40px;
  height: 40px;
  color: #3498db;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>