import { createRouter, createWebHistory } from 'vue-router';
import Patient from '../views/Patient.vue';
import Patients from '../views/Patients.vue';

const routes = [
  {
    path: '/',
    name: 'Patients',
    component: Patients,
  },
  {
    path: '/patient',
    name: 'Patient',
    component: Patient,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;