
<template>
  <div class="patientWrapper">
    <h1>Patient</h1>

    <div class="PatientInfoWrapper" v-if="patientData">
      <InfoBlock title="Id" :content="patientData?.id"/>
      <template v-if="patientData?.active">
        <InfoBlock title="Active" :content="patientData?.active"/>
      </template>
      <template v-if="patientData?.name">
        <InfoBlock title="Name" :content="formattersName(patientData?.name) + ' ' + formattersFamily(patientData?.name)"/>
      </template>
      <InfoBlock title="Birth Date" :content="patientData?.birthDate"/>
      <template v-if="patientData?.gender">
        <InfoBlock title="Gender" :content="patientData?.gender" :isHtmlContent="true" :icon="patientData.gender === 'male' ? mdiHumanMale : mdiHumanFemale"/>
      </template>
      <template v-if="patientData?.meta?.lastUpdated">
        <InfoBlock title="Gender" :content="formattersDate(patientData?.meta?.lastUpdated)" :isHtmlContent="true" :icon="patientData.gender === 'male' ? mdiHumanMale : mdiHumanFemale"/>
      </template>
      <InfoBlock title="Sumary info" :content="patientData?.text?.div" :isHtmlContent="true"/>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHumanMale, mdiHumanFemale } from '@mdi/js';
import Search from '../components/Search.vue'
import InfoBlock from '../components/InfoBlock.vue'
import formatters from '../utils/formatters.js'
import search from "../components/Search.vue";

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
      required: true,
    },
  },
  data() {
    return {
      patientData: { },
      mdiHumanMale,
      mdiHumanFemale,
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

    async checkParamsAndFetch() {
      const route = useRoute();
      const query = route.query;

      if (query && query.id) {
        const patientId = query.id;

        const response = await fetch(`http://localhost:3000/api/patients/${patientId}`, {
          method: 'GET',
          cache: 'no-cache',
        })

        const resul = await response.json();
console.log(resul)
        this.patientData = resul
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
</style>
