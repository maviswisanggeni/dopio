import Vue from 'vue';
import { date } from 'quasar';
import _ from 'lodash';

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

Vue.filter('time', function(value) {
  if (!value) return '';
  return date.formatDate(value, 'HH:mm');
});

Vue.filter('capitalize', function(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('phoneNumber', function(value) {
  if (!value) return '';
  const phone = value.replace('+62', '0');
  return phone.replace(/[^0-9]/g, '').replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 ');
});

Vue.filter('limit', function(value, limitChar = 50) {
  if (!value) return '';
  if (value.length < limitChar) {
    return value;
  }
  return value.substr(0, limitChar) + ' ...';
});

Vue.filter('isoDateToLocale', function(value) {
  if (!value) return '';
  const timestamp = new Date(value);
  const day = timestamp
    .getDate()
    .toString()
    .padStart(2, '0');
  const monthName = months[timestamp.getMonth()];
  const year = timestamp.getFullYear();
  return `${day} ${monthName} ${year}`;
});

Vue.filter('dateTime', function(value) {
  if (!value) return;
  return Vue.filter('isoDateToLocale')(value) + ', ' + Vue.filter('time')(value);
});

Vue.filter('timeago', function(value) {
  const date = new Date(value);
  const month = shortMonths[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const dayIndex = date.getDay();

  const now = new Date();
  const dayName = dayNames[dayIndex];
  if (now.getYear() != date.getYear() || now.getMonth() != date.getMonth()) return `${dayName}, ${day} ${month} ${hour}:${minutes}`;
  if (now.getDate() - 1 == date.getDate()) return `Kemarin, ${hour}:${minutes}`;
  if (now.getDate() == date.getDate()) return `Hari ini, ${hour}:${minutes}`;
  return `${dayName}, ${day} ${month} ${hour}:${minutes}`;
});

Vue.filter('numeric', function(value) {
  if (!value) return '0';
  const number = _.round(value, 2);
  var parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
});

Vue.filter('avatar', function(value) {
  if (!value) return '';
  const word = value.toString().split(' ');
  const firstLetter = word[0].charAt(0).toUpperCase();
  const secondLetter = word.length == 1 ? word[0].charAt(1) : word[1].charAt(0).toUpperCase();
  return firstLetter + secondLetter;
});
