<template>
  <v-menu
    offset-y
    style="width: 90%"
    origin="center center"
    :nudge-bottom="10"
    transition="scale-transition"
    :close-on-content-click="false"
    v-model="close"
    full-width
  >
    <v-btn :loading="loading" small flat slot="activator">
      <v-icon>filter_list</v-icon>
      <span class="ml-2">filtro</span>
    </v-btn>
    <v-card width="800">
      <v-card-actions>
        <v-checkbox class="ml-3" label="Activar tiempo real" v-model="modoTiempoReal"></v-checkbox>

        <v-spacer></v-spacer>
        <v-btn
          :disabled="!tendenciaSeleccionada"
          dark
          color="blue"
          @click="filtrarTendecia()"
        >APLICAR</v-btn>
      </v-card-actions>
      <v-card-text style="margin-top: -40px;">
        <v-layout row wrap>
          <v-flex xs12>
            <v-slider
              v-model="puentosPromediar"
              max="10"
              label="Puento a promediar"
              step="1"
              thumb-label="always"
              color="blue"
              ticks
            ></v-slider>
          </v-flex>
          <v-flex xs4>
            <v-combobox v-model="tendenciaSeleccionada" :items="itemsTendencias" label="Tendencia"/>
          </v-flex>
          <v-flex xs4>
            <v-combobox
              v-model="productosSeleccionada"
              :items="itemsProductos"
              label="Producto"
              multiple
            />
          </v-flex>
          <v-flex xs4>
            <v-combobox
              v-model="tanquesSeleccionada"
              :items="itemsTanques"
              label="Tanque"
              multiple
            />
          </v-flex>
          <v-spacer/>
          <v-flex xs12>
            <span class="red--text">{{ valid }}</span>
          </v-flex>
          <v-flex xs3>
            <v-menu
              ref="menuFechaDesde"
              :close-on-content-click="false"
              v-model="menuFechaDesde"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
              :disabled="modoTiempoReal"
            >
              <v-text-field
                slot="activator"
                v-model="fechaDesde"
                label="Fecha inicio"
                persistent-hint
                prepend-icon="event"
                :disabled="modoTiempoReal"
              ></v-text-field>
              <v-date-picker
                no-title
                locale="es-es"
                v-model="fechaDesde"
                @input="menuFechaDesde = false"
                :disabled="modoTiempoReal"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs3>
            <v-menu
              ref="menuHoraDesde"
              :close-on-content-click="false"
              v-model="menuHoraDesde"
              :nudge-right="40"
              :return-value.sync="horaDesde"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
              :disabled="modoTiempoReal"
            >
              <v-text-field
                slot="activator"
                v-model="horaDesde"
                label="Hora inicio"
                prepend-icon="access_time"
                :disabled="modoTiempoReal"
              ></v-text-field>
              <v-time-picker
                format="24hr"
                no-title
                locale="es-es"
                v-if="menuHoraDesde"
                v-model="horaDesde"
                @change="$refs.menuHoraDesde.save(horaDesde)"
                :disabled="modoTiempoReal"
              ></v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex xs3>
            <v-menu
              ref="menuFechaHasta"
              :close-on-content-click="false"
              v-model="menuFechaHasta"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
              :disabled="modoTiempoReal"
            >
              <v-text-field
                slot="activator"
                v-model="fechaHasta"
                label="Fecha fin"
                persistent-hint
                prepend-icon="event"
                :disabled="modoTiempoReal"
              ></v-text-field>
              <v-date-picker
                no-title
                locale="es-es"
                v-model="fechaHasta"
                @input="menuFechaHasta = false"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs3>
            <v-menu
              ref="menuHoraHasta"
              :close-on-content-click="false"
              v-model="menuHoraHasta"
              :nudge-right="40"
              :return-value.sync="horaHasta"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
              :disabled="modoTiempoReal"
            >
              <v-text-field
                slot="activator"
                v-model="horaHasta"
                label="Hora fin"
                prepend-icon="access_time"
                :disabled="modoTiempoReal"
              ></v-text-field>
              <v-time-picker
                format="24hr"
                no-title
                locale="es-es"
                v-if="menuHoraHasta"
                v-model="horaHasta"
                @change="$refs.menuHoraHasta.save(horaHasta)"
                :disabled="modoTiempoReal"
              ></v-time-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import axios from '@/plugins/axios'
import moment from 'moment'
export default {
  data: () => ({
    loading: false,
    puentosPromediar: 7,
    tendenciaSeleccionada: null,
    productosSeleccionada: [],
    tanquesSeleccionada: [],
    modoTiempoReal: true,
    fechaDesde: null,
    fechaHasta: null,
    menuFechaDesde: false,
    menuFechaHasta: false,
    horaDesde: null,
    horaHasta: null,
    menuHoraDesde: false,
    menuHoraHasta: false,
    close: null,
    valid: '',
    itemsTendencias: [],
    itemsProductos: [],
    itemsTanques: []
  }),

  async created() {
    let dateTime = new Date()
    this.fechaDesde = moment(dateTime).format('YYYY-MM-DD')
    this.fechaHasta = moment(dateTime).format('YYYY-MM-DD')
    this.horaDesde = '00:00:00'
    this.horaHasta = '23:59:00'
    this.getTendencias()
    this.getProductos()
    this.getTanques()
  },

  computed: {
    ...mapGetters([
      'productosSeleccionado',
      'tendencias',
      'productos',
      'tanques',
      'puntosPromedio'
    ])
  },

  watch: {
    puentosPromediar() {
      this.SET_PUNTO_PROMEDIO(this.puentosPromediar)
    }
  },

  mounted() {
    this.puentosPromediar = this.puntosPromedio
  },

  methods: {
    ...mapMutations([
      'SET_PUNTO_PROMEDIO',
      'SET_TENDENCIA',
      'SET_TENDENCIA_SELECCIONADA',
      'SET_MODO_TIEMPO_REAL',
      'SET_APLICAR_FILTRO_TENDENCIA'
    ]),
    ...mapActions([
      'getAllHistoricos',
      'getAllTendencias',
      'getAllProductos',
      'getAllTanques'
    ]),
    async filtrarTendecia() {
      this.SET_MODO_TIEMPO_REAL(this.modoTiempoReal)
      this.SET_TENDENCIA_SELECCIONADA(this.tendenciaSeleccionada)
      if (
        this.fechaDesde &&
        this.horaDesde &&
        this.fechaHasta &&
        this.horaHasta
      ) {
        this.loading = true
        let desde = null
        let hasta = null

        if (this.modoTiempoReal) {
          desde = moment()
            .add(-7, 'days')
            .format('YYYY-MM-DD HH:mm:ss')
          hasta = moment().format('YYYY-MM-DD HH:mm:ss')
        } else {
          desde = moment(this.fechaDesde + ' ' + this.horaDesde).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          hasta = moment(this.fechaHasta + ' ' + this.horaHasta).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }

        const payload = {
          params: {
            desde: moment(this.fechaDesde + ' ' + this.horaDesde).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            hasta: moment(this.fechaHasta + ' ' + this.horaHasta).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            tendencia: this.tendenciaSeleccionada.id,
            productos: this.productosSeleccionado,
            tanques: this.tanquesSeleccionada
          }
        }

        await this.getAllHistoricos(payload)
        this.SET_APLICAR_FILTRO_TENDENCIA()
        this.loading = false
        this.close = false
      } else {
        this.valid = 'Faltan seleccionar elementos del filtro'
      }
    },
    async getTendencias() {
      const payload = {
        params: {
          sortBy: 'tag',
          descending: 'ASC',
          paga: 1,
          perPage: 100000
        }
      }

      await this.getAllTendencias(payload)

      this.itemsTendencias = this.tendencias.data.map(tendencia => {
        tendencia.text = tendencia.tag
        tendencia.value = tendencia.id
        return tendencia
      })
    },
    async getProductos() {
      const payload = {
        params: {
          sortBy: 'codigo',
          descending: 'ASC',
          paga: 1,
          perPage: 100000
        }
      }

      await this.getAllProductos(payload)

      this.itemsProductos = this.productos.data.map(producto => {
        producto.text = producto.codigo
        producto.value = producto.id
        return producto
      })
    },
    async getTanques() {
      const payload = {
        params: {
          sortBy: 'nombre',
          descending: 'ASC',
          paga: 1,
          perPage: 100000
        }
      }

      await this.getAllTanques(payload)

      this.itemsTanques = this.tanques.data.map(tanque => {
        tanque.text = tanque.nombre
        tanque.value = tanque.id
        return tanque
      })
    }
  }
}
</script>
