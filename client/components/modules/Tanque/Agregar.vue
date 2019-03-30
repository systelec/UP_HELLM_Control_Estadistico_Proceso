<template>
  <v-layout row justify-center>
    <v-dialog v-model="modalAgregarTanque" width="400" persistent>
      <v-card class="modal elevation-0">
        <v-card-title class="elevation-0 py-0 px-2">
          <v-icon medium>playlist_add</v-icon>
          <v-spacer></v-spacer>
          <span class="title blue-grey--text">NUEVA TANQUE</span>
          <v-spacer></v-spacer>
          <v-btn icon flat color="grey" @click="SET_MODAL_AGREGAR_TANQUE(false)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-layout justify-center>
              <v-flex xs12>
                <v-text-field
                  ref="Numero"
                  v-model="tanqueAgregar.numero"
                  :rules="rules.numero"
                  label="Numero"
                  placeholder="1"
                  prepend-icon="plus_one"
                  required
                ></v-text-field>
                <v-text-field
                  ref="Nombre"
                  v-model="tanqueAgregar.nombre"
                  :rules="rules.nombre"
                  label="Nombre"
                  placeholder="Tanque preparacion ..."
                  prepend-icon="airplay"
                  required
                ></v-text-field>
                <v-textarea
                  ref="Descripcion"
                  v-model="tanqueAgregar.descripcion"
                  label="Descripcion"
                  placeholder="Tanque para preparacion de ...."
                  prepend-icon="subject"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn block dark flat color="green" @click="agregarTanque()">Guardar</v-btn>
          <v-btn block dark flat color="blue" @click="SET_MODAL_AGREGAR_TANQUE(false)">cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<style scoped>
.modal {
  border-radius: 6px;
}
</style>


<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import notify from '@/mixins/notify'
export default {
  data() {
    return {
      valid: false,
      tanqueAgregar: {
        numero: null,
        nombre: null,
        descripcion: null
      },
      rules: {
        numero: [v => !!v || 'El campo numero es requerido'],
        nombre: [v => !!v || 'El campo nombre es requerido']
      },
      width: 0
    }
  },

  mixins: [notify],

  computed: {
    ...mapGetters(['tanque', 'modalAgregarTanque'])
  },

  methods: {
    ...mapMutations(['SET_MODAL_AGREGAR_TANQUE', 'SET_ACTUALIZAR_TANQUES']),
    ...mapActions(['createTanque']),
    agregarTanque() {
      if (this.valid) {
        const payload = {
          content: this.tanqueAgregar
        }

        this.createTanque(payload)
          .then(response => {
            this.alertSuccess()
            this.tanqueAgregar = {
              nombre: null,
              descripcion: null
            }
            this.SET_MODAL_AGREGAR_TANQUE(false)
          })
          .catch(error => {
            this.alertError(error)
          })
      }
    }
  }
}
</script>
