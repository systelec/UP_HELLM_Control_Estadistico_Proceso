const getters = {
  tanque(state) {
    return state.tanque
  },
  tanques(state) {
    return state.tanques
  },
  modalAgregarTanque(state) {
    return state.modalAgregarTanque
  },
  modalEditarTanque(state) {
    return state.modalEditarTanque
  },
  modalEliminarTanque(state) {
    return state.modalEliminarTanque
  }
}

export default getters
