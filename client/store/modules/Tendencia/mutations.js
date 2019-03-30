export const SET_TENDENCIA = 'SET_TENDENCIA'
export const SET_TENDENCIAS = 'SET_TENDENCIAS'
export const SET_MODAL_AGREGAR_TENDENCIA = 'SET_MODAL_AGREGAR_TENDENCIA'
export const SET_MODAL_EDITAR_TENDENCIA = 'SET_MODAL_EDITAR_TENDENCIA'
export const SET_MODAL_ELIMINAR_TENDENCIA = 'SET_MODAL_ELIMINAR_TENDENCIA'

const mutations = {
  [SET_TENDENCIA](state, tendencia) {
    state.tendencia = tendencia
  },
  [SET_TENDENCIAS](state, tendencias) {
    state.tendencias = tendencias
  },
  [SET_MODAL_AGREGAR_TENDENCIA](state, modal) {
    state.modalAgregarTendencia = modal
  },
  [SET_MODAL_EDITAR_TENDENCIA](state, modal) {
    state.modalEditarTendencia = modal
  },
  [SET_MODAL_ELIMINAR_TENDENCIA](state, modal) {
    state.modalEliminarTendencia = modal
  }
}

export default mutations
