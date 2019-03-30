<template>
  <div>
    <v-layout row wrap pa-1 class="historico">
      <v-flex xs12 text-xs-center>
        <h2 v-if="tendenciaSeleccionada" class="titulo-tendencia">{{ tendenciaSeleccionada.tag }}</h2>
      </v-flex>
      <v-flex xs12>
        <div id="GraficoTendenciaTiempoReal"></div>
      </v-flex>
    </v-layout>
  </div>
</template>

<style scoped>
#GraficoTendenciaTiempoReal {
  width: 100%;
  height: 140vh;
}
.titulo {
  position: relative;
  top: 40vh;
  left: 40vw;
  margin-bottom: 0px;
  color: rgba(109, 117, 138, 0.884);
}
.titulo-tendencia {
  margin-bottom: 0px;
  color: rgba(109, 117, 138, 0.884);
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
  data: () => ({
    chart: null,
    datosTendencia: null,
    historicosAcumulados: null,
    codigoProductoSelecionado: 'Todos',
    productosHistoricoFiltrado: [],
    limite: {
      lh_1sigma: 0,
      ll_1sigma: 0,
      lh_2sigma: 0,
      ll_2sigma: 0,
      lh_3sigma: 0,
      ll_3sigma: 0,
      usl: 0,
      lsl: 0,
      usl_rango: 0,
      lsl_rango: 0,
      media_historica: 0,
      media_rango_historica: 0,
      codigo_producto: null
    }
  }),

  computed: {
    ...mapGetters([
      'tendenciaSeleccionada',
      'datosSocket',
      'datosAcumuladosSocket',
      'historicos',
      'aplicarFiltroTendencia',
      'modoTiempoReal'
    ])
  },

  watch: {
    datosSocket() {
      if (
        this.tendenciaSeleccionada &&
        this.historicosAcumulados &&
        this.modoTiempoReal
      ) {
        this.datosTendencia = this.datosSocket.find(item => {
          if (
            parseInt(this.tendenciaSeleccionada.id) ===
            parseInt(item.tendencia.id)
          ) {
            return true
          }
        })

        this.historicosAcumulados.hasta = this.datosTendencia.hasta
        this.historicosAcumulados.producto = this.datosTendencia.producto
        this.historicosAcumulados.tendencia = this.datosTendencia.tendencia

        this.datosTendencia.historicos.map(historico => {
          this.historicosAcumulados.historicos.push(historico)
        })
        this.datosTendencia.limites.map(limite => {
          this.historicosAcumulados.limites.push(limite)
        })
        this.agruparProductosHistoricos()
        this.graficarTendencias()
      }
    },
    async aplicarFiltroTendencia() {
      if (this.tendenciaSeleccionada) {
        this.codigoProductoSelecionado = 'Todos'

        // Busco tendencia seleccionada de datos del socket
        this.datosTendencia = this.datosSocket.find(item => {
          if (
            parseInt(this.tendenciaSeleccionada.id) ===
            parseInt(item.tendencia.id)
          ) {
            return true
          }
        })

        // Concateno historicos con los historicos del socket
        this.historicosAcumulados = this.historicos

        if (this.historicosAcumulados) {
          this.limite =
            this.historicosAcumulados.limites.length > 0
              ? this.historicosAcumulados.limites[
                  this.historicosAcumulados.limites.length - 1
                ]
              : {
                  lh_1sigma: 0,
                  ll_1sigma: 0,
                  lh_2sigma: 0,
                  ll_2sigma: 0,
                  lh_3sigma: 0,
                  ll_3sigma: 0,
                  usl: 0,
                  lsl: 0,
                  usl_rango: 0,
                  lsl_rango: 0,
                  media_historica: 0,
                  media_rango_historica: 0,
                  codigo_producto: null
                }
        }

        this.agruparProductosHistoricos()
        this.graficarTendencias()
      }
    },
    codigoProductoSelecionado() {
      this.graficarTendencias()
    }
  },

  destroyed() {
    this.SET_TENDENCIA_SELECCIONADA(null)
    this.SET_HISTORICOS_FILTRADOS_POR_PRODUCTO([])
    this.SET_LIMITE_FILTRADO_POR_PRODUCTO(null)
  },

  methods: {
    ...mapMutations([
      'SET_PAYLOAD_HISTORICOS',
      'SET_HISTORICOS_FILTRADOS_POR_PRODUCTO',
      'SET_LIMITE_FILTRADO_POR_PRODUCTO',
      'SET_TENDENCIA_SELECCIONADA'
    ]),
    ...mapActions(['getAllHistoricos', 'getAllLimites']),
    graficarTendencias() {
      if (!this.chart) {
        this.chart = echarts.init(
          document.getElementById('GraficoTendenciaTiempoReal')
        )
      }

      let historicos = this.historicosAcumulados.historicos

      if (historicos.length > 0) {
        const limite = this.historicosAcumulados.limites
          .sort((a, b) => {
            if (a.created_at < b.created_at) {
              return 1
            }
            if (a.created_at > b.created_at) {
              return -1
            }
            return 0
          })
          .find(limite => {
            const fechaLimite = moment(limite.created_at).add(-3, 'hours')
            const fechaHistorico = moment(
              historicos[historicos.length - 1].fecha
            ).add(3, 'hours')

            const diff = fechaLimite.diff(fechaHistorico, 'seconds')

            if (diff <= 0) {
              return true
            }
          })

        if (limite) {
          this.limite = limite
        }
      }
      this.SET_HISTORICOS_FILTRADOS_POR_PRODUCTO(historicos)
      this.SET_LIMITE_FILTRADO_POR_PRODUCTO(this.limite)

      let media = this.limite.media_historica
      let mediaR = this.limite.media_rango_historica
      let lsl = this.limite.lsl
      let usl = this.limite.usl
      let lslR = this.limite.lsl_rango
      let uslR = this.limite.usl_rango

      let LH1Sigma = this.limite.lh_1sigma
      let LL1Sigma = this.limite.ll_1sigma
      let LH2Sigma = this.limite.lh_2sigma
      let LL2Sigma = this.limite.ll_2sigma
      let LH3Sigma = this.limite.lh_3sigma
      let LL3Sigma = this.limite.ll_3sigma

      // Calcula max y min segun grafico por limite
      let max = mathjs.round(this.limite.usl + 1, 2)
      let min = mathjs.round(this.limite.lsl - 1, 2)

      let maxR = mathjs.round(this.limite.usl_rango * 1.01, 2)
      let minR = mathjs.round(this.limite.lsl_rango * 0.99, 2)

      // Calcula intervalos para cada tipo de grafico
      let intervalyAxis = mathjs.round((max - min) / 10, 2)
      let intervalyAxisR = mathjs.round((maxR - minR) / 10, 2)

      // Filtra fechas
      let data = historicos.map(historico => {
        return moment(historico.fecha).format('YYYY-MM-DD HH:mm:ss')
      })

      // Filtra valores PV
      let valuesPV = historicos.map(historico => {
        if (historico.pv) {
          return mathjs.round(historico.pv, 2)
        }
        return 0
      })

      // Filtra valor SP
      let valuesSP = historicos.map(historico => {
        if (historico.sp) {
          return mathjs.round(historico.sp, 2)
        }
        return 0
      })

      // Filtra valores rango
      let valuesRangos = valuesPV.map((item, i) => {
        if (i < valuesPV.length - 1) {
          return mathjs.round(Math.abs(valuesPV[i + 1] - valuesPV[i]), 2)
        }
      })

      // Filtra valores promedios
      let dataPromedios = []
      let valoresAcumulados = 0
      let cantidadPromedios = 6
      let cantidadRecorridos = 0
      let valuesPromedios = valuesPV
        .map((pv, i) => {
          if (cantidadRecorridos === 6) {
            const acumulado = mathjs.round(
              valoresAcumulados / cantidadPromedios,
              2
            )
            cantidadRecorridos = 0
            valoresAcumulados = 0

            dataPromedios.push(data[i - 6])
            return acumulado
          }
          valoresAcumulados = valoresAcumulados + pv
          cantidadRecorridos = cantidadRecorridos + 1
        })
        .filter(pv => {
          if (pv) {
            return true
          }
        })

      // Filtra diferencias PV - SP
      let valuesDiffPvSp = historicos.map(historico => {
        return mathjs.round(historico.pv - historico.sp, 2)
      })

      // Filtra productos
      let valuesProductos = historicos.map(historico => {
        return historico.codigo_producto
      })

      // Filtra histograma
      let histogramaCategory = []
      let histogramaValues = []
      let interaciones = this.numeroClase(valuesPV.length)
      let intervaloCategorias = (max - min) / interaciones
      let j = 0
      let categoria = min
      let cantidad

      for (j; j < interaciones; j++) {
        cantidad = valuesPV.filter(item => {
          if (item > categoria && item < categoria + intervaloCategorias) {
            return true
          }
          return false
        })

        histogramaCategory.push(mathjs.round(categoria, 2))
        histogramaValues.push(cantidad.length)

        categoria = categoria + intervaloCategorias
      }

      // Filtra distribucion normal
      var mean = jStat.mean(valuesPV)
      var stdev = jStat.stdev(valuesPV)
      var min_ = jStat.min(valuesPV)
      var max_ = jStat.max(valuesPV)

      var normData = jStat.seq(min, max, interaciones, x => {
        return jStat.normal.pdf(x, mean, stdev)
      })

      // Test de calcula de distribucion normal
      normData = this.generateData(stdev, min, max)
      console.log(normData)

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
        grid: [
          {
            left: '2%',
            top: '2%',
            height: '30%',
            width: '74%',
            containLabel: true
          },
          {
            left: '78%',
            top: '2%',
            height: '30%',
            width: '20%',
            rotate: 90,
            containLabel: true
          },
          {
            left: '2%',
            top: '33%',
            height: '20%',
            width: '74%',
            containLabel: true
          },
          {
            left: '2%',
            top: '56%',
            height: '20%',
            width: '74%',
            containLabel: true
          },
          {
            left: '2%',
            top: '79%',
            height: '20%',
            width: '74%',
            containLabel: true
          }
        ],
        xAxis: [
          {
            gridIndex: 0,
            type: 'category',
            data: data,
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          },
          {
            gridIndex: 1,
            type: 'value',
            scale: false,
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          },
          {
            gridIndex: 1,
            type: 'value',
            scale: false,
            show: false,
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          },
          {
            gridIndex: 2,
            type: 'category',
            data: data,
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          },
          {
            gridIndex: 3,
            type: 'category',
            data: data,
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          },
          {
            gridIndex: 4,
            type: 'category',
            data: dataPromedios,
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          }
        ],
        yAxis: [
          {
            gridIndex: 0,
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
          {
            gridIndex: 1,
            type: 'category',
            data: histogramaCategory,
            show: false
          },
          {
            gridIndex: 2,
            type: 'value',
            boundaryGap: ['1%', '1%'],
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          },
          {
            gridIndex: 3,
            type: 'value',
            boundaryGap: ['1%', '1%'],
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          },
          {
            gridIndex: 4,
            type: 'value',
            boundaryGap: ['1%', '1%'],
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          }
        ],
        series: [
          {
            name: 'PV',
            data: valuesPV,
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
                  yAxis: media,
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
                  yAxis: usl,
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
                  yAxis: LH1Sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(21, 235, 0, 1)'
                    }
                  }
                },
                {
                  name: '1sigma-',
                  yAxis: LL1Sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(21, 235, 0, 1)'
                    }
                  }
                },
                {
                  name: '2sigma+',
                  yAxis: LH2Sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(250, 243, 30, 1)'
                    }
                  }
                },
                {
                  name: '2sigma-',
                  yAxis: LL2Sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(250, 243, 30, 1)'
                    }
                  }
                },
                {
                  name: '3sigma+',
                  yAxis: LH3Sigma,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(255, 0, 0, 1)'
                    }
                  }
                },
                {
                  name: '3sigma-',
                  yAxis: LL3Sigma,
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
                    yAxis: LL1Sigma,
                    itemStyle: {
                      normal: {
                        color: 'rgba(21, 235, 0, 0.5)'
                      }
                    }
                  },
                  {
                    yAxis: LH1Sigma
                  }
                ],
                [
                  {
                    yAxis: LH1Sigma,
                    itemStyle: {
                      normal: {
                        color: 'rgba(250, 243, 30, 0.5)'
                      }
                    }
                  },
                  {
                    yAxis: LH2Sigma
                  }
                ],
                [
                  {
                    yAxis: LL2Sigma,
                    itemStyle: {
                      normal: {
                        color: 'rgba(250, 243, 30, 0.5)'
                      }
                    }
                  },
                  {
                    yAxis: LL1Sigma
                  }
                ],
                [
                  {
                    yAxis: LH2Sigma,
                    itemStyle: {
                      normal: {
                        color: 'rgba(255, 0, 0, 0.5)'
                      }
                    }
                  },
                  {
                    yAxis: LH3Sigma
                  }
                ],
                [
                  {
                    yAxis: LL3Sigma,
                    itemStyle: {
                      normal: {
                        color: 'rgba(255, 0, 0, 0.5)'
                      }
                    }
                  },
                  {
                    yAxis: LL2Sigma
                  }
                ]
              ]
            }
          },
          {
            name: 'SP',
            data: valuesSP,
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
          },
          {
            name: 'Histograma',
            type: 'bar',
            barWidth: '99.3%',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: histogramaValues
          },
          {
            name: 'Distribucion normal',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 1,
            smooth: true,
            symbolSize: 0,
            lineStyle: {
              normal: {
                width: 2,
                color: 'black'
              }
            },
            data: normData
          },
          {
            name: 'Rango',
            smooth: false,
            data: valuesRangos,
            type: 'line',
            symbolSize: 0,
            xAxisIndex: 3,
            yAxisIndex: 2,
            lineStyle: {
              normal: {
                width: 2,
                color: 'orange'
              }
            },
            markLine: {
              symbol: '',
              data: [
                {
                  name: 'LCL R',
                  yAxis: lslR,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      width: 2,
                      color: 'rgba(255, 34, 34, 1)'
                    }
                  }
                },
                {
                  name: 'USL R',
                  yAxis: uslR,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      width: 2,
                      color: 'rgba(255, 34, 34, 1)'
                    }
                  }
                },
                {
                  name: 'Media',
                  yAxis: mediaR,
                  lineStyle: {
                    normal: {
                      type: '',
                      width: 2,
                      color: 'rgba(0, 0, 0, 1)'
                    }
                  }
                }
              ]
            }
          },
          {
            name: 'Diferencia PV - SP',
            data: valuesDiffPvSp,
            type: 'line',
            smooth: false,
            type: 'line',
            symbolSize: 0,
            xAxisIndex: 4,
            yAxisIndex: 3,
            lineStyle: {
              normal: {
                width: 2,
                color: 'purple'
              }
            }
          },
          {
            name: 'Promedios',
            data: valuesPromedios,
            type: 'line',
            smooth: false,
            type: 'line',
            symbolSize: 0,
            xAxisIndex: 5,
            yAxisIndex: 4,
            lineStyle: {
              normal: {
                width: 2,
                color: 'salmon'
              }
            }
          }
        ]
      }

      this.chart.setOption(option)
    },
    // normalDist(media, std, x) {
    //   return (
    //     (1 / (std * Math.sqrt(2 * Math.PI))) *
    //     Math.exp(-0.5 * (((x - media) * (x - media)) / (std * std)))
    //   )
    // },
    numeroClase(numeroDatos) {
      if (numeroDatos <= 50) {
        return 5
      }
      if (numeroDatos <= 100) {
        return 6
      }
      if (numeroDatos <= 200) {
        return 7
      }
      if (numeroDatos <= 500) {
        return 8
      }
      if (numeroDatos <= 1000) {
        return 9
      }
      return 14
    },
    agruparProductosHistoricos() {
      const productosHistorico = _.groupBy(
        this.historicosAcumulados.historicos,
        'codigo_producto'
      )
      this.productosHistoricoFiltrado = []
      for (const key in productosHistorico) {
        this.productosHistoricoFiltrado.push(key)
      }
    },
    colorBotonCodigoProducto(codigo) {
      if (this.codigoProductoSelecionado === codigo) {
        return 'blue'
      }
      return 'blue-grey'
    },
    normalDist(theta, x) {
      return (
        (1 / (theta * Math.sqrt(2 * Math.PI))) *
        Math.exp((-x * x) / 2 / theta / theta)
      )
    },

    generateData(theta, x0, x1) {
      var data = []
      for (var i = 0; i <= 200; i++) {
        var x = ((x1 - x0) * i) / 200 + x0
        data.push([x, this.normalDist(theta, x)])
      }
      return data
    }
  }
}
</script>