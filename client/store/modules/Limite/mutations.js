export const SET_LIMITE = 'SET_LIMITE'
export const SET_LIMITES = 'SET_LIMITES'
export const SET_LIMITE_FILTRADO_POR_PRODUCTO =
  'SET_LIMITE_FILTRADO_POR_PRODUCTO'
export const SET_MODAL_AGREGAR_LIMITE = 'SET_MODAL_AGREGAR_LIMITE'
export const SET_MODAL_EDITAR_LIMITE = 'SET_MODAL_EDITAR_LIMITE'
export const SET_MODAL_ELIMINAR_LIMITE = 'SET_MODAL_ELIMINAR_LIMITE'

import moment from 'moment'

const mutations = {
  [SET_LIMITE](state, limite) {
    state.limite = limite
  },
  [SET_LIMITES](state, limites) {
    state.limites = limites
  },
  [SET_LIMITE_FILTRADO_POR_PRODUCTO](state, limiteFiltradoPorProducto) {
    state.limiteFiltradoPorProducto = limiteFiltradoPorProducto
  },
  [SET_MODAL_AGREGAR_LIMITE](state, modal) {
    state.modalAgregarLimite = modal
  },
  [SET_MODAL_EDITAR_LIMITE](state, modal) {
    state.modalEditarLimite = modal
  },
  [SET_MODAL_ELIMINAR_LIMITE](state, modal) {
    state.modalEliminarLimite = modal
  }
}

export default mutations
