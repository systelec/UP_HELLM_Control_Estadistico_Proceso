<template>
  <v-card class="carta-tabla elevation-0">
    <v-data-table
      :headers="headers"
      :items="tanques.data"
      :loading="loading"
      :pagination.sync="pagination"
      :total-items="parseInt(tanques.total)"
      no-data-text="No hay datos registrados en el sistema"
      no-results-text="No hay datos registrados en el sistema"
      :rows-per-page-items="[10, 25, 50]"
      rows-per-page-text="Por pagina"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-left">
            <strong class="blue-grey--text">{{ props.item.nombre }}</strong>
          </td>
          <td class="text-xs-left">{{ props.item.numero }}</td>
          <td class="text-xs-left">{{ props.item.descripcion }}</td>
          <td class="text-xs-right">
            <div>
              <v-icon color="blue" @click="editarTanque(props.item)">edit</v-icon>
              <v-icon color="pink" @click="eliminarTanque(props.item)">delete</v-icon>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
    <tanque-eliminar v-if="modalEliminarTanque"/>
    <tanque-editar v-if="modalEditarTanque"/>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import TanqueEliminar from '@/components/modules/Tanque/Eliminar'
import TanqueEditar from '@/components/modules/Tanque/Editar'
export default {
  components: {
    TanqueEliminar,
    TanqueEditar
  },

  data() {
    return {
      headers: [
        { text: 'Nombre', value: 'nombre', align: 'left' },
        { text: 'Numero', value: 'numero', align: 'left' },
        { text: 'Descripcion', value: 'descripcion', align: 'left' },
        { text: '', value: '', sortable: false }
      ],
      items: [],
      loading: false,
      search: '',
      pagination: {}
    }
  },

  watch: {
    pagination: {
      handler() {
        this.getTanques()
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters(['tanques', 'modalEditarTanque', 'modalEliminarTanque'])
  },

  methods: {
    ...mapMutations([
      'SET_TANQUE',
      'SET_MODAL_EDITAR_TANQUE',
      'SET_MODAL_ELIMINAR_TANQUE'
    ]),
    ...mapActions(['getAllTanques']),
    async getTanques() {
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

      await this.getAllTanques(payload)
      this.loading = false
    },
    expandTabla(props) {
      props.expanded = !props.expanded
    },
    buscar() {
      this.getTanques()
    },
    limpiar() {
      this.search = ''
      this.getTanques()
    },
    agregarTanque() {
      this.SET_MODAL_AGREGAR_TANQUE(true)
    },
    editarTanque(item) {
      this.SET_TANQUE(item)
      this.SET_MODAL_EDITAR_TANQUE(true)
    },
    eliminarTanque(item) {
      this.SET_TANQUE(item)
      this.SET_MODAL_ELIMINAR_TANQUE(true)
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
