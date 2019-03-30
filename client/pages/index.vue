<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <panel-indicador/>
      </v-flex>
      <v-flex xs12 class="mt-2">
        <v-card class="elevation-0" style="height: 50vh;">
          <grafico-tendecia
            :datas="datas"
            :valuesPV="valuesPV"
            :valuesSP="valuesSP"
            :limite="limite"
          />
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import mathjs from 'mathjs'
import _ from 'lodash'
import GraficoTendecia from '@/components/public/GraficoTendecia'
import PanelIndicador from '@/components/public/PanelIndicador'

export default {
  layout: 'default',
  components: {
    GraficoTendecia,
    PanelIndicador
  },

  data: () => ({
    datas: [],
    valuesPV: [],
    valuesSP: [],
    valuesRangos: [],
    valuesPromedios: [],
    valuesDiferenciaPVSP: [],
    valuesProductos: [],
    limite: null
  }),

  computed: {
    ...mapGetters([
      'tendenciaSeleccionada',
      'datosSocket',
      'historicos',
      'aplicarFiltroTendencia',
      'modoTiempoReal',
      'puntosPromedio'
    ])
  },

  watch: {
    datosSocket() {
      if (
        this.tendenciaSeleccionada &&
        this.historicosTendenciaSeleccionada &&
        this.modoTiempoReal
      ) {
        // Busco tendencia seleccionada de datos del socket
        const datosTendencia = this.datosSocket.find(item => {
          if (
            parseInt(this.tendenciaSeleccionada.id) ===
            parseInt(item.tendencia.id)
          ) {
            return true
          }
        })

        // Agrego en datos de historicos actual lo nuevo
        this.historicosTendenciaSeleccionada.hasta = datosTendencia.hasta
        this.historicosTendenciaSeleccionada.producto = datosTendencia.producto
        this.historicosTendenciaSeleccionada.tendencia =
          datosTendencia.tendencia

        datosTendencia.historicos.map(historico => {
          this.historicosTendenciaSeleccionada.historicos.push(historico)
        })
        datosTendencia.limites.map(limite => {
          this.historicosTendenciaSeleccionada.limites.push(limite)
        })

        this.generaDatosParaGraficar()
      }
    },
    async aplicarFiltroTendencia() {
      if (this.tendenciaSeleccionada) {
        this.historicosTendenciaSeleccionada = this.historicos

        this.generaDatosParaGraficar()
      }
    }
  },

  methods: {
    generaDatosParaGraficar() {
      const historicos = this.historicosTendenciaSeleccionada.historicos
      const limites = this.historicosTendenciaSeleccionada.limites
      const desde = this.historicosTendenciaSeleccionada.desde
      const hasta = this.historicosTendenciaSeleccionada.hasta
      const productoActual = this.historicosTendenciaSeleccionada.producto

      // Busco ultimos limite, sino hay genero uno en 0
      this.limite =
        limites.length > 0
          ? limites[limites.length - 1]
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

      // Filtra fechas
      this.datas = historicos.map(historico => {
        return moment(historico.fecha).format('YYYY-MM-DD HH:mm:ss')
      })

      // Filtra valores PV
      this.valuesPV = historicos.map(historico => {
        if (historico.pv) {
          return mathjs.round(historico.pv, 2)
        }
        return 0
      })

      // Filtra valor SP
      this.valuesSP = historicos.map(historico => {
        if (historico.sp) {
          return mathjs.round(historico.sp, 2)
        }
        return 0
      })

      // Filtra valores rango
      this.valuesRangos = this.valuesPV.map((item, i) => {
        if (i < this.valuesPV.length - 1) {
          return mathjs.round(
            Math.abs(this.valuesPV[i + 1] - this.valuesPV[i]),
            2
          )
        }
      })

      // Filtra valores promedios
      let dataPromedios = []
      let valoresAcumulados = 0
      let cantidadRecorridos = 0
      this.valuesPromedios = this.valuesPV
        .map((pv, i) => {
          if (cantidadRecorridos === this.puntosPromedio) {
            const acumulado = mathjs.round(
              valoresAcumulados / this.puntosPromedio,
              2
            )
            cantidadRecorridos = 0
            valoresAcumulados = 0

            dataPromedios.push(this.datas[i - 6])
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
      this.valuesDiferenciaPVSP = historicos.map(historico => {
        return mathjs.round(historico.pv - historico.sp, 2)
      })

      // Filtra productos
      this.valuesProductos = historicos.map(historico => {
        return historico.codigo_producto
      })
    }
  }
}
</script>

<style scoped>
.imagen {
  border-radius: 6px;
  border: 2px solid grey;
  position: relative;
  width: 400px;
}
.loading {
  margin-top: 20vh;
  opacity: 0.5;
  animation: aloading 4s linear infinite alternate;
}
@keyframes aloading {
  0% {
    transform: scale(1.02);
  }
  50% {
    transform: scale(1.04);
  }
  100% {
    transform: scale(1.06);
  }
}
</style>
