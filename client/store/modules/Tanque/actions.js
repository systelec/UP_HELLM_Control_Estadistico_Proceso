import { SET_TANQUES } from './mutations'
import axios from '@/plugins/axios'

const actions = {
  async getAllTanques(context, payload) {
    payload = payload ? payload : {}
    await axios
      .get('tanques', { params: payload.params })
      .then(response => {
        context.commit(SET_TANQUES, response.data)
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async createTanque(context, payload) {
    await axios
      .post('tanques', payload.content)
      .then(response => {
        context.dispatch('getAllTanques')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async updateTanque(context, payload) {
    await axios
      .put(`tanques/${payload.content.id}`, payload.content)
      .then(response => {
        context.dispatch('getAllTanques')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async deleteTanque(context, payload) {
    await axios
      .delete(`tanques/${payload.content.id}`)
      .then(response => {
        context.dispatch('getAllTanques')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

export default actions
