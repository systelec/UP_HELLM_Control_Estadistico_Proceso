export const SET_PRODUCTO = 'SET_PRODUCTO'
export const SET_PRODUCTOS = 'SET_PRODUCTOS'
export const SET_MODAL_AGREGAR_PRODUCTO = 'SET_MODAL_AGREGAR_PRODUCTO'
export const SET_MODAL_EDITAR_PRODUCTO = 'SET_MODAL_EDITAR_PRODUCTO'
export const SET_MODAL_ELIMINAR_PRODUCTO = 'SET_MODAL_ELIMINAR_PRODUCTO'

const mutations = {
  [SET_PRODUCTO](state, producto) {
    state.producto = producto
  },
  [SET_PRODUCTOS](state, productos) {
    state.productos = productos
  },
  [SET_MODAL_AGREGAR_PRODUCTO](state, modal) {
    state.modalAgregarProducto = modal
  },
  [SET_MODAL_EDITAR_PRODUCTO](state, modal) {
    state.modalEditarProducto = modal
  },
  [SET_MODAL_ELIMINAR_PRODUCTO](state, modal) {
    state.modalEliminarProducto = modal
  }
}

export default mutations
