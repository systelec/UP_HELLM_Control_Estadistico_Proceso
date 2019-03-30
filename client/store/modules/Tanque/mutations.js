export const SET_TANQUE = 'SET_TANQUE'
export const SET_TANQUES = 'SET_TANQUES'
export const SET_MODAL_AGREGAR_TANQUE = 'SET_MODAL_AGREGAR_TANQUE'
export const SET_MODAL_EDITAR_TANQUE = 'SET_MODAL_EDITAR_TANQUE'
export const SET_MODAL_ELIMINAR_TANQUE = 'SET_MODAL_ELIMINAR_TANQUE'

const mutations = {
  [SET_TANQUE](state, tanque) {
    state.tanque = tanque
  },
  [SET_TANQUES](state, tanques) {
    state.tanques = tanques
  },
  [SET_MODAL_AGREGAR_TANQUE](state, modal) {
    state.modalAgregarTanque = modal
  },
  [SET_MODAL_EDITAR_TANQUE](state, modal) {
    state.modalEditarTanque = modal
  },
  [SET_MODAL_ELIMINAR_TANQUE](state, modal) {
    state.modalEliminarTanque = modal
  }
}

export default mutations
