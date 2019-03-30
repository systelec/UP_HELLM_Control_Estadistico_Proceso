<template>
  <div id="GraficoTendencia"></div>
</template>

<style scoped>
#GraficoTendencia {
  width: 100%;
  height: 50vh;
}
</style>


<script>
import moment from 'moment'
import echarts from 'echarts'
import ecStat from 'echarts-stat'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import mathjs from 'mathjs'
import _ from 'lodash'
import axios from '@/plugins/axios'
import jStat from 'jStat'

export default {
  props: {
    datas: Array,
    valuesPV: Array,
    valuesSP: Array,
    limite: Object
  },

  data: () => ({
    chart: null
  }),

  methods: {
    graficarTendencias() {
      if (!this.chart) {
        this.chart = echarts.init(
          document.getElementById('GraficoTendenciaTiempoReal')
        )
      }

      // Calcula max y min segun grafico por limite
      let max = mathjs.round(this.limite.usl + 1, 2)
      let min = mathjs.round(this.limite.lsl - 1, 2)

      // Calcula intervalos para cada tipo de grafico
      let intervalyAxis = mathjs.round((max - min) / 10, 2)

      // Setea el grafico
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        xAxis: {
          type: 'category',
          data: this.data,
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          }
        },
        yAxis: {
          type: 'value',
          max: max,
          min: min,
          boundaryGap: ['1%', '1%'],
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          }
        },
        series: [
          {
            name: 'PV',
            data: this.valuesPV,
            smooth: false,
            type: 'line',
            symbolSize: 0,
            xAxisIndex: 0,
            yAxisIndex: 0,
            lineStyle: {
              normal: {
                width: 2,
                color: 'blue'
              }
            },
            markLine: {
              symbol: '',
              data: [
                {
                  name: 'Media',
                  yAxis: this.limite.media,
                  lineStyle: {
                    normal: {
                      type: '',
                      width: 2,
                      color: 'rgba(0, 0, 0, 1)'
                    }
                  }
                },
                {
                  name: 'USL',
                  yAxis: this.limite.usl,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      width: 2,
                      color: 'rgba(255, 34, 34, 1)'
                    }
                  }
                },
                {
                  name: 'LSL',
                  yAxis: lsl,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      width: 2,
                      color: 'rgba(255, 34, 34, 1)'
                    }
                  }
                },
                {
                  name: '1sigma+',
                  yAxis: this.limite.lh_1sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(21, 235, 0, 1)'
                    }
                  }
                },
                {
                  name: '1sigma-',
                  yAxis: this.limite.ll_1sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(21, 235, 0, 1)'
                    }
                  }
                },
                {
                  name: '2sigma+',
                  yAxis: this.limite.lh_2sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(250, 243, 30, 1)'
                    }
                  }
                },
                {
                  name: '2sigma-',
                  yAxis: this.limite.ll_2sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(250, 243, 30, 1)'
                    }
                  }
                },
                {
                  name: '3sigma+',
                  yAxis: this.limite.lh_3sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(255, 0, 0, 1)'
                    }
                  }
                },
                {
                  name: '3sigma-',
                  yAxis: this.limite.ll_3sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(255, 0, 0, 1)'
                    }
                  }
                }
              ]
            },
            markArea: {
              silent: true,
              data: [
                [
                  {
                    yAxis: this.limite.ll_1sigma,
                    itemStyle: {
                      normal: {
                        color: 'rgba(21, 235, 0, 0.5)'
                      }
                    }
                  },
                  {
                    yAxis: this.limite.lh_1sigma
                  }
                ],
                [
                  {
                    yAxis: this.limite.lh_1sigma,
                    itemStyle: {
                      normal: {
                        color: 'rgba(250, 243, 30, 0.5)'
                      }
                    }
                  },
                  {
                    yAxis: this.limite.lh_2sigma
                  }
                ],
                [
                  {
                    yAxis: this.limite.lh_2sigma,
                    itemStyle: {
                      normal: {
                        color: 'rgba(250, 243, 30, 0.5)'
                      }
                    }
                  },
                  {
                    yAxis: this.limite.ll_1sigma
                  }
                ],
                [
                  {
                    yAxis: this.limite.lh_2sigma,
                    itemStyle: {
                      normal: {
                        color: 'rgba(255, 0, 0, 0.5)'
                      }
                    }
                  },
                  {
                    yAxis: this.limite.lh_3sigma
                  }
                ],
                [
                  {
                    yAxis: this.limite.lh_3sigma,
                    itemStyle: {
                      normal: {
                        color: 'rgba(255, 0, 0, 0.5)'
                      }
                    }
                  },
                  {
                    yAxis: this.limite.ll_2sigma
                  }
                ]
              ]
            }
          },
          {
            name: 'SP',
            data: this.valuesSP,
            type: 'line',
            smooth: false,
            type: 'line',
            symbolSize: 0,
            xAxisIndex: 0,
            yAxisIndex: 0,
            lineStyle: {
              normal: {
                width: 2,
                color: 'purple'
              }
            }
          }
        ]
      }

      this.chart.setOption(option)
    }
  }
}
</script>