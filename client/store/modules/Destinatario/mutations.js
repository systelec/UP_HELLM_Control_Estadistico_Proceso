export const SET_DESTINATARIO = 'SET_DESTINATARIO'
export const SET_DESTINATARIOS = 'SET_DESTINATARIOS'
export const SET_MODAL_AGREGAR_DESTINATARIO = 'SET_MODAL_AGREGAR_DESTINATARIO'
export const SET_MODAL_EDITAR_DESTINATARIO = 'SET_MODAL_EDITAR_DESTINATARIO'
export const SET_MODAL_ELIMINAR_DESTINATARIO = 'SET_MODAL_ELIMINAR_DESTINATARIO'
export const SET_PAYLOAD_DESTINATARIOS = 'SET_PAYLOAD_DESTINATARIOS'
export const CLEAR_PAYLOAD_DESTINATARIOS = 'CLEAR_PAYLOAD_DESTINATARIOS'

const mutations = {
  [SET_DESTINATARIO](state, destinatario) {
    state.destinatario = destinatario
  },
  [SET_DESTINATARIOS](state, destinatarios) {
    state.destinatarios = destinatarios
  },
  [SET_MODAL_AGREGAR_DESTINATARIO](state, modal) {
    state.modalAgregarDestinatario = modal
  },
  [SET_MODAL_EDITAR_DESTINATARIO](state, modal) {
    state.modalEditarDestinatario = modal
  },
  [SET_MODAL_ELIMINAR_DESTINATARIO](state, modal) {
    state.modalEliminarDestinatario = modal
  }
}

export default mutations
