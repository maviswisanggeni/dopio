<template>
  <div>
    <div class="row q-col-gutter-sm q-mb-md q-pt-md">
      <div class="col flex items-center q-gutter-sm">
        <q-input class="app-input" v-model="zFromUs" outlined dense mask="##-##-####" style="width: 140px;">
          <template #prepend>
            <q-icon name="mdi-calendar" color="primary" size="18px" />
          </template>
        </q-input>
        <div><hr style="width: 8px" /></div>
        <!-- TODO: from and to should only be from past to future -->
        <q-input class="app-input" v-model="zToUs" outlined dense mask="##-##-####" style="width: 140px;">
          <template #prepend>
            <q-icon name="mdi-calendar" color="primary" size="18px" />
          </template>
        </q-input>
      </div>
    </div>
    <q-separator />
    <div class="row q-col-gutter-lg">
      <div class="col-auto">
        <q-list dense class="q-my-md">
          <q-item clickable :active="activeItemSelection === 'today'" @click="setRange('today')">
            <q-item-section>Today</q-item-section>
          </q-item>
          <q-item clickable :active="activeItemSelection === 'yesterday'" @click="setRange('yesterday')">
            <q-item-section>Yesterday</q-item-section>
          </q-item>
          <q-item clickable :active="activeItemSelection === 'thisWeek'" @click="setRange('thisWeek')">
            <q-item-section>This Week</q-item-section>
          </q-item>
          <q-item clickable :active="activeItemSelection === 'lastWeek'" @click="setRange('lastWeek')">
            <q-item-section>Last Week</q-item-section>
          </q-item>
          <q-item clickable :active="activeItemSelection === 'thisMonth'" @click="setRange('thisMonth')">
            <q-item-section>This Month</q-item-section>
          </q-item>
          <q-item clickable :active="activeItemSelection === 'lastMonth'" @click="setRange('lastMonth')">
            <q-item-section>Last Month</q-item-section>
          </q-item>
          <q-item clickable :active="activeItemSelection === 'thisYear'" @click="setRange('thisYear')">
            <q-item-section>This Year</q-item-section>
          </q-item>
          <q-item clickable :active="activeItemSelection === 'lastYear'" @click="setRange('lastYear')">
            <q-item-section>Last Year</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-auto">
        <q-separator vertical style="height: 100%" />
      </div>
      <div class="col column">
        <div class="row q-col-gutter-md col q-pt-md q-mb-md">
          <div class="col">
            <month-year-chooser :year.sync="cal1Year" :month.sync="cal1Month" class="q-mb-sm" />
            <!-- <q-calendar
              v-model="cal1"
              mini-mode
              short-weekday-label
              animated
              :selected-start-end-dates="startEndDates"
              :day-class="classDay"
              style="background-color: transparent;"
              @click:date="onClickDay"
            /> -->
            <q-calendar
              v-model="cal1"
              view="month"
              locale="en-us"
              mini-mode
              no-active-date
              short-weekday-label
              :min-weeks="6"
              animated
              :selected-start-end-dates="startEndDates"
              style="max-width: 300px; min-width: auto; overflow: hidden"
              @mouseup:day2="onClickDay"
              @click:date="onClickDay"
            />
          </div>
          <div class="col-auto">
            <q-separator vertical style="height: 100%" />
          </div>
          <div class="col">
            <month-year-chooser :year.sync="cal2Year" :month.sync="cal2Month" class="q-mb-sm" />
            <q-calendar
              v-model="cal2"
              view="month"
              locale="en-us"
              mini-mode
              no-active-date
              short-weekday-label
              animated
              :selected-start-end-dates="startEndDates"
              :day-class="classDay"
              @click:date="onClickDay"
            />
          </div>
        </div>
        <q-separator class="q-mb-md" style="margin-left: -24px; margin-right: -24px; width: calc(100% + 40px);" />
        <div class="row items-center q-mb-md q-col-gutter-md">
          <div class="col-auto">Range: {{ range }}</div>
          <div class="col">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mdiClose, mdiCalendar, mdiClockTimeTwelveOutline, mdiClockTimeElevenOutline } from '@quasar/extras/mdi-v5';
import dayjs from 'dayjs';
import isEqual from 'lodash/isEqual';
import { date } from 'quasar';
import QCalendar from '@quasar/quasar-ui-qcalendar';
const todayFrom = dayjs();
const todayTo = dayjs();

export default {
  components: {
    monthYearChooser: () => import('components/Form/MonthYearChooser'),
  },
  props: {
    value: {
      default: () => [dayjs().toISOString(), dayjs().toISOString()],
      validator(input) {
        if (input) return Array.isArray(input) && input.length === 2;
        return true;
      },
    },
  },
  data() {
    return {
      selectedDate1: '',
      zStartPicker: '00:00',
      zEndPicker: '00:00',
      zFrom: dayjs(this.value[0]).format('YYYY-MM-DD'),
      zTo: dayjs(this.value[1]).format('YYYY-MM-DD'),
      zStart: dayjs(this.value[0]).format('hh:mm A'),
      zEnd: dayjs(this.value[1]).format('hh:mm A'),
      clicked: false,
      cal1: dayjs()
        .subtract(1, 'month')
        .format('YYYY-MM-DD'),
      cal2: dayjs().format('YYYY-MM-DD'),
      timeFrames: {
        today: { from: todayFrom, to: todayTo },
        yesterday: { from: todayFrom.add(-1, 'day'), to: todayTo.add(-1, 'day') },
        thisWeek: { from: todayFrom.startOf('w'), to: todayTo },
        lastWeek: { from: todayFrom.add(-1, 'w').startOf('w'), to: todayTo.add(-1, 'w').endOf('w') },
        thisMonth: { from: todayFrom.startOf('M'), to: todayTo },
        lastMonth: { from: todayFrom.add(-1, 'M').startOf('M'), to: todayTo.add(-1, 'M').endOf('M') },
        thisYear: { from: todayFrom.startOf('y'), to: todayTo },
        lastYear: { from: todayFrom.add(-1, 'y').startOf('y'), to: todayTo.add(-1, 'y').endOf('y') },
      },
    };
  },

  beforeMount() {
    this.selectedDate1 = QCalendar.today();
    let tm = QCalendar.parseTimestamp(this.selectedDate1);
    tm = QCalendar.addToDate(tm, { month: 1 });
    this.selectedDate2 = tm.date;
  },

  computed: {
    activeItemSelection() {
      const from = dayjs(this.zFrom, 'YYYY-MM-DD');
      const to = dayjs(this.zTo, 'YYYY-MM-DD');
      let active = '';
      ['lastYear', 'thisYear', 'lastMonth', 'thisMonth', 'lastWeek', 'thisWeek', 'yesterday', 'today'].forEach(name => {
        if (to.isSame(this.timeFrames[name].to, 'date') && from.isSame(this.timeFrames[name].from, 'date')) active = name;
      });
      return active;
    },
    range() {
      const days = Math.abs(dayjs(this.zFrom, 'YYYY-MM-DD').diff(this.zTo, 'day')) + 1;
      return days + days > 1 ? 'Days' : 'Day';
    },
    cal1Month: {
      get() {
        return +dayjs(this.cal1, 'YYYY-MM-DD').format('MM') - 1;
      },
      set(month) {
        const newDate = dayjs(this.cal1).month(month);
        if (newDate.isValid()) this.cal1 = newDate.format('YYYY-MM-DD');
      },
    },
    cal1Year: {
      get() {
        return dayjs(this.cal1, 'YYYY-MM-DD').format('YYYY');
      },
      set(year) {
        const newDate = dayjs(this.cal1).year(year);
        if (newDate.isValid()) this.cal1 = newDate.format('YYYY-MM-DD');
      },
    },
    cal2Month: {
      get() {
        return +dayjs(this.cal2, 'YYYY-MM-DD').format('MM') - 1;
      },
      set(month) {
        const newDate = dayjs(this.cal2, 'YYYY-MM-DD').month(month);
        if (newDate.isValid()) this.cal2 = newDate.format('YYYY-MM-DD');
      },
    },
    cal2Year: {
      get() {
        return dayjs(this.cal2, 'YYYY-MM-DD').format('YYYY');
      },
      set(year) {
        const newDate = dayjs(this.cal2, 'YYYY-MM-DD').year(year);
        if (newDate.isValid()) this.cal2 = newDate.format('YYYY-MM-DD');
      },
    },
    zFromUs: {
      get() {
        return dayjs(this.zFrom, 'YYYY-MM-DD').format('MM-DD-YYYY');
      },
      set(date) {
        if (dayjs(date, 'MM-DD-YYYY').isValid()) this.zFrom = dayjs(date).format('YYYY-MM-DD');
        this.cal1 = this.zFrom;
        if (dayjs(this.zFrom, 'YYYY-MM-DD').isSame(dayjs(this.zTo, 'YYYY-MM-DD'), 'M')) {
          this.cal1 = dayjs(this.zFrom, 'YYYY-MM-DD')
            .add(-1, 'M')
            .format('YYYY-MM-DD');
        }
      },
    },
    zToUs: {
      get() {
        return dayjs(this.zTo, 'YYYY-MM-DD').format('MM-DD-YYYY');
      },
      set(date) {
        if (dayjs(date, 'MM-DD-YYYY').isValid()) this.zTo = dayjs(date).format('YYYY-MM-DD');
        this.cal2 = this.zTo;
        if (dayjs(this.zFrom, 'YYYY-MM-DD').isSame(dayjs(this.zTo, 'YYYY-MM-DD'), 'M')) {
          this.cal1 = dayjs(this.zFrom, 'YYYY-MM-DD')
            .add(-1, 'M')
            .format('YYYY-MM-DD');
        }
      },
    },
    startEndDates() {
      const dates = [];
      if (this.zFromUnix !== false && this.zToUnix !== false) {
        if (this.zFromUnix <= this.zToUnix) {
          dates.push(this.zFrom, this.zTo);
        } else {
          dates.push(this.zTo, this.zFrom);
        }
      }
      return dates;
    },
    zFromUnix() {
      if (this.zFrom !== '') {
        return dayjs(this.zFrom, 'YYYY-MM-DD').unix();
      }
      return false;
    },
    zToUnix() {
      if (this.zTo !== '') {
        return dayjs(this.zTo, 'YYYY-MM-DD').unix();
      }
      return false;
    },
  },
  watch: {
    startEndDates() {
      this.runUpdate();
    },
    zStart() {
      this.runUpdate();
    },
    zEnd() {
      this.runUpdate();
    },
    value() {
      if (
        isEqual(
          this.value.map(d => dayjs(d).format('YYYY-MM-DD')),
          this.startEndDates,
        )
      )
        return;
      this.zFrom = dayjs(this.value[0]).format('YYYY-MM-DD');
      this.zTo = dayjs(this.value[1]).format('YYYY-MM-DD');
    },
  },
  created() {
    this.cal1 = this.zFrom;
    this.cal2 = this.zTo;
    if (dayjs(this.zFrom, 'YYYY-MM-DD').isSame(dayjs(this.zTo, 'YYYY-MM-DD'), 'M')) {
      this.cal1 = dayjs(this.zFrom, 'YYYY-MM-DD')
        .add(-1, 'M')
        .format('YYYY-MM-DD');
    }
  },
  methods: {
    runUpdate() {
      const startEndISO = [
        dayjs(`${this.startEndDates[0]} ${this.zStart}`, 'YYYY-MM-DD hh:mm A').toISOString(),
        dayjs(`${this.startEndDates[1]} ${this.zEnd}`, 'YYYY-MM-DD hh:mm A').toISOString(),
      ];
      if (isEqual(this.value, startEndISO)) return;
      this.$emit('input', startEndISO);
    },
    saveTime(model) {
      this[model] = this[`${model}Picker`];
    },
    classDay(timestamp) {
      if (this.zFromUnix !== false && this.zToUnix !== false) {
        return this.getBetween(timestamp);
      }
    },
    getBetween({ date }) {
      const nowIdentifier = dayjs(date, 'YYYY-MM-DD').unix();
      const lower = Math.min(this.zFromUnix, this.zToUnix);
      const higher = Math.max(this.zFromUnix, this.zToUnix);
      return {
        'q-selected-day-first': lower === nowIdentifier,
        'q-selected-day': lower <= nowIdentifier && higher >= nowIdentifier,
        'q-selected-day-last': higher === nowIdentifier,
      };
    },
    onClickDay({ date }) {
      console.log('click day');
      if (this.clicked === false) {
        this.zFrom = date;
        this.zTo = date;
        this.clicked = true;
        return;
      }
      // mouse is down, start selection and capture current
      this.clicked = false;
      this.zTo = date;
    },
    setRange(when) {
      const doWhen = this.timeFrames[when];
      this.zFrom = doWhen.from.format('YYYY-MM-DD');
      this.zTo = doWhen.to.format('YYYY-MM-DD');
      this.cal1 = this.zFrom;
      this.cal2 = this.zTo;
      if (dayjs(this.zFrom, 'YYYY-MM-DD').isSame(dayjs(this.zTo, 'YYYY-MM-DD'), 'M')) {
        this.cal1 = dayjs(this.zFrom, 'YYYY-MM-DD')
          .add(-1, 'M')
          .format('YYYY-MM-DD');
      }
    },
  },

  onMouseDownDay({ scope, event }) {
    if (leftClick(event)) {
      if (
        this.mobile === true &&
        this.anchorTimestamp !== null &&
        this.otherTimestamp !== null &&
        this.anchorTimestamp.date === this.otherTimestamp.date
      ) {
        this.otherTimestamp = scope.timestamp;
        this.mouseDown = false;
        return;
      }
      // mouse is down, start selection and capture current
      this.mouseDown = true;
      this.anchorTimestamp = scope.timestamp;
      this.otherTimestamp = scope.timestamp;
    }
  },

  onMouseUpDay({ scope, event }) {
    if (leftClick(event)) {
      // mouse is up, capture last and cancel selection
      this.otherTimestamp = scope.timestamp;
      this.mouseDown = false;
    }
  },

  onMouseMoveDay({ scope, event }) {
    if (this.mouseDown === true && scope.outside !== true) {
      this.otherTimestamp = scope.timestamp;
    }
  },
};
</script>

<style lang="scss" scoped></style>
