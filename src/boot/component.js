import Vue from 'vue';

import _ from 'lodash';
Vue.prototype.$_ = _;

import { ValidationProvider } from 'vee-validate';
Vue.component(ValidationProvider);

import PortalVue from 'portal-vue';
Vue.use(PortalVue);

import money from 'v-money';
Vue.use(money);

import { Cropper } from 'vue-advanced-cropper';
import VueCropper from 'vue-cropperjs';
import 'vue-advanced-cropper/dist/style.css';
Vue.component(Cropper);
Vue.component(VueCropper);

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);

import vueEasyPrint from 'vue-easy-print';
import VueHtmlToPaper from 'vue-html-to-paper';
const vueHtmlToPaperOptions = {
  name: '_blank',
  specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
  styles: ['https://stackpath.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css', 'https://unpkg.com/kidlat-css/css/kidlat.css'],
};
Vue.use(VueHtmlToPaper, vueHtmlToPaperOptions);
Vue.component('vueEasyPrint', vueEasyPrint);

import VueApexCharts from 'vue-apexcharts';
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

import Plugin from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/dist/index.css';
Vue.use(Plugin);

// Form
Vue.component('BaseForm', () => import('components/Form/BaseForm'));
Vue.component('BaseDateInput', () => import('components/Form/BaseDateInput'));
Vue.component('BaseTextInput', () => import('components/Form/BaseTextInput'));
Vue.component('BaseTextPassword', () => import('components/Form/BaseTextPassword'));
Vue.component('BaseTextArea', () => import('components/Form/BaseTextArea'));
Vue.component('BaseMoneyInput', () => import('components/Form/BaseMoneyInput'));
Vue.component('BaseDecimalInput', () => import('components/Form/BaseDecimalInput'));
Vue.component('BaseSelectInput', () => import('components/Form/BaseSelectInput'));
Vue.component('BaseDateRangePicker', () => import('components/Form/BaseDateRangePicker'));
Vue.component('FileUpload', () => import('components/Form/FileUpload'));
Vue.component('ImageUpload', () => import('components/Form/ImageUpload'));
Vue.component('ImageCropUpload', () => import('components/Form/ImageCropUpload'));

// Button
Vue.component('NewSaveBtn', () => import('components/Button/NewSaveBtn'));

// Dialog
Vue.component('DialogConfirm', () => import('components/dialog/DialogConfirm'));
