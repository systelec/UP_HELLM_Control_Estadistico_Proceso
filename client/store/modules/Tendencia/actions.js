import { SET_TENDENCIAS } from './mutations'
import axios from '@/plugins/axios'

const actions = {
  async getAllTendencias(context, payload) {
    payload = payload ? payload : {}
    await axios
      .get('tendencias', { params: payload.params })
      .then(response => {
        context.commit(SET_TENDENCIAS, response.data)
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async createTendencia(context, payload) {
    await axios
      .post('tendencias', payload.content)
      .then(response => {
        context.dispatch('getAllTendencias')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async updateTendencia(context, payload) {
    await axios
      .put(`tendencias/${payload.content.id}`, payload.content)
      .then(response => {
        context.dispatch('getAllTendencias')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async deleteTendencia(context, payload) {
    await axios
      .delete(`tendencias/${payload.content.id}`)
      .then(response => {
        context.dispatch('getAllTendencias')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

export default actions
