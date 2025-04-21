<template>
  <div class="patientWrapper">
    <h1>Patient</h1>
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
    <div class="PatientInfoWrapper" v-else-if="patientData">
      <template v-if="patientData?.id">
        <InfoBlock title="Id" :content="patientData?.id"/>
      </template>
      <template v-if="patientData?.active">
        <InfoBlock title="Active" :content="patientData?.active"/>
      </template>
      <template v-if="patientData?.name">
        <InfoBlock title="Name" :content="formattersName(patientData?.name) + ' ' + formattersFamily(patientData?.name)"/>
      </template>
      <template v-if="patientData?.birthDate">
        <InfoBlock title="Birth Date" :content="patientData?.birthDate"/>
      </template>
      <template v-if="patientData?.gender">
        <InfoBlock title="Gender" :content="patientData?.gender" :isHtmlContent="true" :icon="patientData.gender === 'male' ? mdiHumanMale : mdiHumanFemale"/>
      </template>
      <template v-if="patientData?.meta?.lastUpdated">
        <InfoBlock title="Gender" :content="formattersDate(patientData?.meta?.lastUpdated)" :isHtmlContent="true" :icon="patientData.gender === 'male' ? mdiHumanMale : mdiHumanFemale"/>
      </template>
      <template v-if="patientData?.text?.div">
        <InfoBlock title="Sumary info" :content="patientData?.text?.div" :isHtmlContent="true"/>
      </template>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHumanMale, mdiHumanFemale, mdiLoading } from '@mdi/js';
import Search from '../components/Search.vue'
import InfoBlock from '../components/InfoBlock.vue'
import formatters from '../utils/formatters.js'

export default {
  name: "my-component",
  components: {
    Search,
    InfoBlock,
    SvgIcon,
  },
  props: {
    msg: {
      type: String,
      required: false,
      default: '',
    },

  },
  data() {
    return {
      patientData: { },
      mdiHumanMale,
      mdiHumanFemale,
      mdiLoading,
      search: '',
      originalUrl: '',
      isLoading: false,
    }
  },
  methods: {
    formattersDate(date) {
      return formatters.dateFormater(date)
    },
    formattersName(name) {
      return formatters.nameFormater(name)
    },
    formattersFamily(name) {
      return formatters.familyFormater(name)
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

        const response = await fetch(`http://localhost:3000/api/patients/search${queryString ? '?' + queryString : ''}`, {
          method: 'GET',
          cache: 'no-cache',
        });

        const responseData = await response.json();
        this.originalUrl = responseData?.originalUrl || undefined;
        console.log(responseData.entry[0].resource.id)

        if (responseData?.entry.length && responseData?.entry[0]?.resource?.id) {
          this.$router.push({
            query: {
              ...this.$route.query,
              id: responseData.entry[0].resource.id
            }
          }).then(() => {
            this.checkParamsAndFetch();
          });
        }
      } catch (e) {
        console.log('No parameters found in the URL!', e)
      } finally {
        this.isLoading = false;
      }
    },

    async checkParamsAndFetch() {
      const query = this.$route.query;

      if (query && query.id) {
        const patientId = query.id;

        this.isLoading = true;
        try {
          const response = await fetch(`http://localhost:3000/api/patients/${patientId}`, {
            method: 'GET',
            cache: 'no-cache',
          })

          const resul = await response.json();
          this.originalUrl = resul?.originalUrl || undefined;
          this.patientData = resul
        } catch (e) {
          console.error(e);
        } finally {
          this.isLoading = false;
        }
      } else {
        console.log('No parameters found in the URL!')
      }
    },
  },
  mounted() {
    this.checkParamsAndFetch()
  },
}
</script>

<style scoped>
.patientWrapper {
  width: 1000px;
}
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
.PatientInfoWrapper {
  width: 1000px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: rgba(19, 3, 119, 0.38);
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