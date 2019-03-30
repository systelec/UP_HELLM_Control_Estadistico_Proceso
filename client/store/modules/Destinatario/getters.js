const getters = {
  destinatario(state) {
    return state.destinatario
  },
  destinatarios(state) {
    return state.destinatarios
  },
  modalAgregarDestinatario(state) {
    return state.modalAgregarDestinatario
  },
  modalEditarDestinatario(state) {
    return state.modalEditarDestinatario
  },
  modalEliminarDestinatario(state) {
    return state.modalEliminarDestinatario
  }
}

export default getters
