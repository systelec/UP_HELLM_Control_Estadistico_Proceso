<template>
  <v-layout row justify-center>
    <v-dialog v-model="modalEditarDestinatario" width="600" persistent>
      <v-card class="modal elevation-0">
        <v-card-title class="elevation-0 py-0 px-2">
          <v-icon medium>account_circle</v-icon>
          <v-spacer></v-spacer>
          <span class="title blue-grey--text">NUEVA DESTINATARIO</span>
          <v-spacer></v-spacer>
          <v-btn icon flat color="grey" @click="SET_MODAL_EDITAR_DESTINATARIO(false)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-layout justify-center row wrap>
              <v-flex xs8>
                <v-text-field
                  ref="Email"
                  v-model="destinatarioEditar.email"
                  :rules="rules.email"
                  label="Email"
                  placeholder="juan@unilever.com"
                  prepend-icon="email"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-checkbox color="blue" v-model="destinatarioEditar.envio" label="Habilitar envio"></v-checkbox>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  ref="Nombre"
                  v-model="destinatarioEditar.nombre"
                  label="Nombre"
                  placeholder="Juan"
                  prepend-icon="list"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  ref="Apellido"
                  v-model="destinatarioEditar.apellido"
                  label="Apellido"
                  placeholder="..."
                  prepend-icon="list"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn block dark flat color="green" @click="editarDestinatario()">Guardar</v-btn>
          <v-btn block dark flat color="blue" @click="SET_MODAL_EDITAR_DESTINATARIO(false)">cancelar</v-btn>
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
      destinatarioEditar: {
        nombre: null,
        apellido: null,
        email: null,
        envio: true
      },
      rules: {
        email: [
          v => !!v || 'El email es requerido',
          v => /.+@.+/.test(v) || 'Formato de email no valido'
        ]
      },
      width: 0
    }
  },

  mixins: [notify],

  computed: {
    ...mapGetters(['destinatario', 'modalEditarDestinatario'])
  },

  mounted() {
    this.destinatarioEditar = this.destinatario
  },

  methods: {
    ...mapMutations([
      'SET_MODAL_EDITAR_DESTINATARIO',
      'SET_ACTUALIZAR_DESTINATARIOS'
    ]),
    ...mapActions(['updateDestinatario']),
    editarDestinatario() {
      const payload = {
        content: this.destinatarioEditar
      }
      if (this.valid) {
        this.updateDestinatario(payload)
          .then(response => {
            this.alertSuccess()
            this.destinatarioEditar = {
              nombre: null,
              descripcion: null
            }
            this.SET_MODAL_EDITAR_DESTINATARIO(false)
          })
          .catch(error => {
            this.alertError(error)
          })
      }
    }
  }
}
</script>
