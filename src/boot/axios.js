import Vue from 'vue';
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.SERVER_URL
});

Vue.prototype.$axios = instance;
