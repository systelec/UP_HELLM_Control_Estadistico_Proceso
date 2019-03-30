import { SET_LIMITES } from './mutations'
import axios from '@/plugins/axios'

const actions = {
  async getAllLimites(context, payload) {
    payload = payload ? payload : {}
    await axios
      .get('limites', { params: payload.params })
      .then(response => {
        context.commit(SET_LIMITES, response.data)
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async createLimite(context, payload) {
    await axios
      .post('limites', payload.content)
      .then(response => {
        context.dispatch('getAllLimites')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async updateLimite(context, payload) {
    await axios
      .put(`limites/${payload.content.id}`, payload.content)
      .then(response => {
        context.dispatch('getAllLimites')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async deleteLimite(context, payload) {
    await axios
      .delete(`limites/${payload.content.id}`)
      .then(response => {
        context.dispatch('getAllLimites')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

export default actions
