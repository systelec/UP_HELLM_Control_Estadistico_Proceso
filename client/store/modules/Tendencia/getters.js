const getters = {
  tendencia(state) {
    return state.tendencia
  },
  tendencias(state) {
    return state.tendencias
  },
  modalAgregarTendencia(state) {
    return state.modalAgregarTendencia
  },
  modalEditarTendencia(state) {
    return state.modalEditarTendencia
  },
  modalEliminarTendencia(state) {
    return state.modalEliminarTendencia
  }
}

export default getters
