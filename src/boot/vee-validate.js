import { required, confirmed, email, max_value, min_value } from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';

extend('required', {
  ...required,
  message: `{_field_} wajib di isi`,
});

extend('email', {
  ...email,
  message: '{_field_} harus berupa email yang valid.',
});

extend('confirmed', {
  ...confirmed,
  message: "'Konfirmasi {_field_} tidak cocok.",
});

extend('max', {
  validate(value, args) {
    return value.length >= args.min;
  },
  params: ['max'],
  message: `{_field_} harus maksimal {min} karakter`,
});

extend('min', {
  validate(value, args) {
    return value.length >= args.min;
  },
  params: ['min'],
  message: `{_field_} harus minimal {min} karakter`,
});

extend('minValue', {
  validate(value, args) {
    return value >= args;
  },
  message: '{_field_} minimal bernilai {min}',
});

extend('maxValue', {
  ...max_value,
  message: `{_field_} maksimal bernilai {max}`,
});

extend('phoneNumber', {
  validate(value) {
    return {
      required: true,
      valid: value.substr(0, 2) == '08' && value.length >= 10,
    };
  },
  computesRequired: true,
  message: `Nomor Handphone tidak valid`,
});
