<template>
  <v-card class="carta-tabla elevation-0">
    <v-data-table
      :headers="headers"
      :items="tendencias.data"
      :loading="loading"
      :pagination.sync="pagination"
      :total-items="parseInt(tendencias.total)"
      no-data-text="No hay datos registrados en el sistema"
      no-results-text="No hay datos registrados en el sistema"
      :rows-per-page-items="[10, 25, 50]"
      rows-per-page-text="Por pagina"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-left">
            <v-layout d-flex>
              <v-flex xs1>
                <v-icon @click="expandTabla(props)" small>{{!props.expanded ? 'add' : 'remove'}}</v-icon>
              </v-flex>
              <v-flex xs11>
                <v-edit-dialog
                  :return-value.sync="props.item.tag"
                  large
                  lazy
                  persistent
                  @save="cambiarTag(props.item)"
                >
                  <div>
                    <strong class="blue-grey--text ml-3">{{ props.item.tag }}</strong>
                  </div>
                  <div slot="input" class="mt-3 title blue-grey--text">Cambiar TAG</div>
                  <v-text-field
                    slot="input"
                    v-model="props.item.tag"
                    label="Editar"
                    single-line
                    counter
                    autofocus
                  ></v-text-field>
                </v-edit-dialog>
              </v-flex>
            </v-layout>
          </td>
          <td class="text-xs-left">{{ props.item.nombre }}</td>
          <td class="text-xs-left">{{ props.item.descripcion }}</td>
          <td class="text-xs-left">
            <v-icon :color="props.item.dosificacion ? 'green' : 'grey'">check_circle</v-icon>
          </td>
          <td class="text-xs-left">
            <v-edit-dialog
              :return-value.sync="props.item.tv"
              large
              lazy
              persistent
              @save="habilitarVisualizacionTV(props.item)"
              class="elevation-0"
            >
              <div>
                <v-icon :color="props.item.tv ? 'green' : 'grey'">tv</v-icon>
              </div>
              <div slot="input" class="mt-3 subheading blue-grey--text">
                <strong>VISUALIZAION TV</strong>
              </div>
              <v-switch
                color="green"
                slot="input"
                label="Habilitar visualizacion"
                v-model="props.item.tv"
              ></v-switch>
            </v-edit-dialog>
          </td>
          <td class="text-xs-right">
            <div v-if="!props.item.dosificacion">
              <v-btn flat color="blue" @click="agregarLimite(props.item)">Agregar limite
                <v-icon class="ml-2" color="blue">timeline</v-icon>
              </v-btn>
            </div>
          </td>
        </tr>
      </template>
      <template slot="expand" slot-scope="props">
        <v-card>
          <limite-tabla :limites="props.item.limites" :limite="props.limites"/>
        </v-card>
      </template>
    </v-data-table>
    <limite-agregar v-if="modalAgregarLimite"/>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import notify from '@/mixins/notify'
import LimiteTabla from '@/components/modules/Tendencia/Limite/Tabla'
import LimiteAgregar from '@/components/modules/Tendencia/Limite/Agregar'
export default {
  components: {
    LimiteTabla,
    LimiteAgregar
  },

  data() {
    return {
      headers: [
        { text: 'Tag', value: 'tag', align: 'left' },
        { text: 'Nombre', value: 'nombre', align: 'left' },
        { text: 'Descripcion', value: 'descripcion', align: 'left' },
        { text: 'Dosificacion', value: 'dosificacion', align: 'left' },
        { text: 'TV', value: 'tv', align: 'left' },
        { text: '', value: '', sortable: false }
      ],
      items: [],
      loading: false,
      search: '',
      pagination: {}
    }
  },

  mixins: [notify],

  watch: {
    pagination: {
      handler() {
        this.getTendencias()
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters([
      'tendencias',
      'modalEditarTendencia',
      'modalEliminarTendencia',
      'modalAgregarLimite'
    ])
  },

  methods: {
    ...mapMutations([
      'SET_TENDENCIA',
      'SET_MODAL_EDITAR_TENDENCIA',
      'SET_MODAL_ELIMINAR_TENDENCIA',
      'SET_MODAL_AGREGAR_LIMITE'
    ]),
    ...mapActions(['getAllTendencias', 'updateTendencia']),
    async getTendencias() {
      this.loading = true
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      const payload = {
        params: {
          sortBy: sortBy,
          descending: descending ? 'DESC' : 'ASC',
          page: page,
          perPage: rowsPerPage
        }
      }
      await this.getAllTendencias(payload)
      this.loading = false
    },
    expandTabla(props) {
      this.SET_TENDENCIA(props.item)
      props.expanded = !props.expanded
    },
    buscar() {
      this.getTendencias()
    },
    limpiar() {
      this.search = ''
      this.getTendencias()
    },
    agregarTendencia() {
      this.SET_MODAL_AGREGAR_TENDENCIA(true)
    },
    editarTendencia(item) {
      this.SET_TENDENCIA(item)
      this.SET_MODAL_EDITAR_TENDENCIA(true)
    },
    eliminarTendencia(item) {
      this.SET_TENDENCIA(item)
      this.SET_MODAL_ELIMINAR_TENDENCIA(true)
    },
    agregarLimite(item) {
      this.SET_TENDENCIA(item)
      this.SET_MODAL_AGREGAR_LIMITE(true)
    },
    habilitarVisualizacionTV(item) {
      const payload = {
        content: item
      }

      this.SET_TENDENCIA(item)
      this.updateTendencia(payload)
        .then(response => {
          this.alertSuccess()
        })
        .catch(error => {
          this.alertError(error)
        })
    },
    cambiarTipoDosificacion(item) {
      const payload = {
        content: item
      }

      this.SET_TENDENCIA(item)
      this.updateTendencia(payload)
        .then(response => {
          this.alertSuccess()
        })
        .catch(error => {
          this.alertError(error)
        })
    },
    cambiarTag(item) {
      const payload = {
        content: item
      }

      this.SET_TENDENCIA(item)
      this.updateTendencia(payload)
        .then(response => {
          this.alertSuccess()
        })
        .catch(error => {
          this.alertError(error)
        })
    }
  }
}
</script>

<style scoped>
.carta-tabla {
  border: 1px solid #b0bec5;
  border-radius: 4px;
}
</style>
