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
    <div class="PatientInfoWrapper" v-else-if="patientData && patientData.id">
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
        <InfoBlock title="Last Updated" :content="formattersDate(patientData?.meta?.lastUpdated)" :isHtmlContent="true"/>
      </template>
      <template v-if="patientData?.text?.div">
        <InfoBlock title="Sumary info" :content="patientData?.text?.div" :isHtmlContent="true"/>
      </template>
    </div>
    <template v-if="weightData.length">
      <div class="chart-container">
        <h3>Weight patient</h3>
        <apexchart
            type="line"
            height="350"
            :options="chartOptions"
            :series="series"
        ></apexchart>
      </div>
    </template>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHumanMale, mdiHumanFemale, mdiLoading } from '@mdi/js';
import Search from '../components/Search.vue'
import InfoBlock from '../components/InfoBlock.vue'
import formatters from '../utils/formatters.js'
import { defineComponent, ref, onMounted, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: "my-component",
  components: {
    Search,
    InfoBlock,
    SvgIcon,
    apexchart: VueApexCharts,
  },
  props: {
    msg: {
      type: String,
      required: false,
      default: '',
    }
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
      observationInfo: { },
      weightData: [ ],
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

        if (responseData?.entry?.length && responseData?.entry[0]?.resource?.id) {
          console.log(responseData.entry[0].resource.id);
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
      this.getObservationData();
    },

    async getObservationData() {
      const query = this.$route.query;

      if (query && query.id) {
        const patientId = query.id;

        this.isLoading = true;
        try {
          const response = await fetch(`http://localhost:3000/api/patients/${patientId}/observations`, {
            method: 'GET',
            cache: 'no-cache',
          })

          const resul = await response.json();

          this.observationInfo = resul;

          if (resul && resul?.entry && resul?.entry?.length > 0) {
            this.weightData = resul.entry
              .filter(entry => entry?.resource?.code?.text === 'Body weigth')
              .map(entry => ({
                date: entry?.resource?.effectiveDateTime.split('T')[0],
                value: entry?.resource?.valueQuantity?.value
              }))
              .sort((a, b) => new Date(a.date) - new Date(b.date));

            this.updateChartData();
          }

        } catch (e) {
          console.error(e);
        } finally {
          this.isLoading = false;
        }
      } else {
        console.log('No parameters found in the URL!')
      }
    },

    updateChartData() {
      this.series[0].data = this.weightData.map(item => ({
        x: new Date(item.date).getTime(),
        y: item.value
      }));
    }
  },
  mounted() {
    this.checkParamsAndFetch();

    this.$nextTick(() => {
      this.updateChartData();
    });
  },
  setup() {
    const series = ref([{
      name: 'weight',
      data: []
    }]);

    const chartOptions = ref({
      chart: {
        type: 'line',
        zoom: { enabled: false },
        toolbar: {
          show: true
        },
        background: '#fff'
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#3498db']
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'dd MMM yyyy',
          style: {
            colors: '#333'
          }
        },
        title: {
          text: 'Date'
        }
      },
      yaxis: {
        title: {
          text: 'Weight (kg)',
          style: {
            color: '#333'
          }
        },
        labels: {
          style: {
            colors: '#333'
          }
        }
      },
      tooltip: {
        x: { format: 'dd MMM yyyy' },
        y: {
          formatter: function(value) {
            return value + ' кг';
          }
        }
      },
      grid: {
        borderColor: '#e0e0e0',
        row: {
          colors: ['#f8f8f8', 'transparent'],
          opacity: 0.5
        }
      },
      markers: {
        size: 5,
        colors: ['#3498db'],
        strokeWidth: 2,
        hover: {
          size: 7
        }
      }
    });

    return {
      series,
      chartOptions
    };
  }
};
</script>

<style scoped>
.patientWrapper {
  width: 1000px;
  margin: 0 auto;
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
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
}
.chart-container {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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