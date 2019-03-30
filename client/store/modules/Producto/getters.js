const getters = {
  producto(state) {
    return state.producto
  },
  productos(state) {
    return state.productos
  },
  modalAgregarProducto(state) {
    return state.modalAgregarProducto
  },
  modalEditarProducto(state) {
    return state.modalEditarProducto
  },
  modalEliminarProducto(state) {
    return state.modalEliminarProducto
  }
}

export default getters
