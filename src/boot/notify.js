import { Notify } from 'quasar';

Notify.registerType('success', {
  color: 'dark',
  textColor: 'white',
  position: 'bottom',
  icon: 'sentiment_satisfied_alt',
  message: 'Sukses',
  timeout: 1500
});

Notify.registerType('error', {
  color: 'dark',
  textColor: 'white',
  position: 'bottom',
  message: 'Oops...',
  icon: 'sentiment_dissatisfied',
  timeout: 1500
});
