<template>
  <v-layout>
    <v-flex xs6></v-flex>
    <v-flex xs6>
      <v-text-field
        v-model="search"
        class="buscador"
        append-icon="search"
        label="Buscar usuario por codigo"
        color="blue"
        outline
        single-line
        hide-details
        clearable
        @click:append="buscar()"
        @click:clear="limpiar()"
        @keyup.enter.native="buscar()"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      search: '',
      searchField: 'codigo'
    }
  },

  methods: {
    ...mapActions(['getAllProductos']),
    buscar() {
      this.getAllItems()
    },
    limpiar() {
      this.search = ''
      this.getAllItems()
    },
    getAllItems() {
      const payload = {
        params: {
          searchField: this.searchField,
          search: this.search
        }
      }
      this.getAllProductos(payload)
    }
  }
}
</script>

<style scoped>
</style>