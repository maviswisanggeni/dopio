<template>
  <q-card class="gross-income-card" flat>
    <q-card-section class="q-pb-none">
      <div class="text-subtitle">Pendapatan</div>
    </q-card-section>
    <q-card-section>
      <div class="row items-center">
        <q-icon size="28px" color="blue" name="bar_chart"></q-icon>
        <div class="q-ml-sm column">
          <div class="income-text">Pendapatan bulan ini</div>
          <div class="value-income-text">Rp {{ currentIncome | numeric }}</div>
        </div>
      </div>
      <apexchart style="font-family: Proxima-Nova-Alt" height="400" type="area" :options="chartOptions" :series="series"></apexchart>
    </q-card-section>
  </q-card>
</template>

<script>
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export default {
  name: 'GrossIncomeChart',

  data() {
    return {
      series: [
        {
          type: 'area',
          name: 'Pendapatan',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chartOptions: {
        grid: {},
        chart: {
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        yaxis: {
          axisBorder: {
            show: true,
          },
          labels: {
            show: true,
            style: {
              fontFamily: 'Proxima-Nova-Alt',
            },
            formatter: value => {
              if (value <= 1_000) return value.toLocaleString('id');
              const number = value / 1_000;
              return number.toLocaleString('id') + 'K';
            },
          },
        },
        xaxis: {
          tooltip: {
            enabled: false,
          },
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
          labels: {
            style: {
              fontFamily: 'Proxima-Nova-Alt',
            },
          },
        },
        stroke: {
          width: 2,
          curve: 'smooth',
        },
        fill: {
          type: 'solid',
          colors: '#b3e5fc32',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 100, 100],
          },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          enabled: true,
        },
        tooltip: {
          enabled: true,
          marker: {
            show: false,
          },
          style: {
            fontFamily: 'Proxima-Nova-Alt',
          },
          y: {
            formatter: value => {
              return value.toLocaleString('id');
            },
          },
        },
      },
    };
  },

  computed: {
    currentIncome() {
      const month = new Date().getMonth();
      return this.series[0].data[month];
    },
  },

  created() {
    this.getProfitByMonth();
  },

  methods: {
    async getProfitByMonth() {
      const res = await this.$axios.get('/dashboard/profit-by-month');
      const seriesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (const profit of res.data) {
        seriesData[profit.month - 1] = profit.totalGrossIncome;
      }
      this.series = [{ type: 'area', name: 'Pendapatan', data: seriesData }];
    },
  },
};
</script>

<style lang="scss" scoped>
.gross-income-card {
  font-family: Proxima-Nova-Alt;
  border-radius: 1rem;
  height: 500px;
}

.income-text {
  font-size: 10px;
  color: $grey-7;
}

.value-income-text {
  font-size: 16px;
  font-weight: 800;
}
</style>
