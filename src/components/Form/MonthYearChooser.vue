<template>
  <div class="row items-center">
    <div class="col-auto">
      <q-btn size="sm" dense round flat icon="mdi-chevron-left" @click="modMonth(-1)" />
    </div>
    <div class="col text-center">
      <q-btn flat size="sm" dense :label="monthList[zMonth]">
        <q-menu>
          <div class="row" style="width: 200px">
            <div v-for="(mo, index) in monthList" :key="mo" class="col-4 justify-center">
              <q-btn v-close-popup flat size="sm" dense class="full-width q-py-sm" @click="zMonth = index">
                {{ mo }}
              </q-btn>
            </div>
          </div>
        </q-menu>
      </q-btn>
    </div>
    <div class="col-auto">
      <q-btn size="sm" dense round flat icon="mdi-chevron-right" @click="modMonth(1)" />
    </div>
    <div class="col-auto">
      <q-btn size="sm" dense round flat icon="mdi-chevron-left" @click="zYear -= 1" />
    </div>
    <div class="col-auto">
      <q-btn flat size="sm" dense :label="zYear">
        <q-menu>
          <div class="row items-center q-col-gutter-sm q-px-sm">
            <div class="col-auto">
              <q-btn size="sm" dense round flat icon="mdi-chevron-left" @click="yearPage -= 1" />
            </div>
            <div class="col">
              <div class="row" style="width: 200px">
                <div v-for="yr in years" :key="yr" class="col-3 justify-center">
                  <q-btn v-close-popup flat dense class="full-width q-py-sm" @click="zYear = yr">
                    {{ yr }}
                  </q-btn>
                </div>
              </div>
            </div>
            <div class="col-auto">
              <q-btn size="sm" dense round flat icon="mdi-chevron-right" @click="yearPage += 1" />
            </div>
          </div>
        </q-menu>
      </q-btn>
    </div>
    <div class="col-auto">
      <q-btn size="sm" dense round flat icon="mdi-chevron-right" @click="zYear += 1" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    year: {
      type: [String, Number],
      required: true,
    },
    month: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      zMonth: +this.month,
      zYear: +this.year,
      yearPage: +this.year / 16,
      monthList: Array.from({ length: 12 }, (e, i) => {
        return new Date(null, i + 1, null).toLocaleDateString('en', { month: 'short' });
      }),
    };
  },
  computed: {
    years() {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(n => n + Math.floor(this.yearPage * 16) - 1);
    },
  },
  watch: {
    month() {
      if (this.zMonth !== this.month) this.zMonth = this.month;
    },
    year() {
      if (this.zYear !== this.year) this.zYear = this.year;
    },
    zMonth() {
      if (this.zMonth !== this.month) this.$emit('update:month', this.zMonth);
    },
    zYear() {
      if (this.zYear !== this.year) this.$emit('update:year', this.zYear);
    },
  },
  methods: {
    modMonth(amnt) {
      if (this.zMonth === 11 && amnt > 0) return (this.zMonth = 0);
      if (this.zMonth === 0 && amnt < 0) return (this.zMonth = 11);
      this.zMonth += amnt;
    },
  },
};
</script>

<style lang="scss" scoped></style>
