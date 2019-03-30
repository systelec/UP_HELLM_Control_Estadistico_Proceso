import { SET_PRODUCTOS } from './mutations'
import axios from '@/plugins/axios'

const actions = {
  async getAllProductos(context, payload) {
    payload = payload ? payload : {}
    await axios
      .get('productos', { params: payload.params })
      .then(response => {
        context.commit(SET_PRODUCTOS, response.data)
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async createProducto(context, payload) {
    await axios
      .post('productos', payload.content)
      .then(response => {
        context.dispatch('getAllProductos')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async updateProducto(context, payload) {
    await axios
      .put(`productos/${payload.content.id}`, payload.content)
      .then(response => {
        context.dispatch('getAllProductos')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async deleteProducto(context, payload) {
    await axios
      .delete(`productos/${payload.content.id}`)
      .then(response => {
        context.dispatch('getAllProductos')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

export default actions
