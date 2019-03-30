import { SET_HISTORICOS } from './mutations'
import axios from '@/plugins/axios'

const actions = {
  async getAllHistoricos(context, payload) {
    payload = payload ? payload : {}
    await axios
      .get('historicos', { params: payload.params })
      .then(response => {
        context.commit(SET_HISTORICOS, response.data)
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async createHistorico(context, payload) {
    await axios
      .post('historicos', payload.content)
      .then(response => {
        context.dispatch('getAllHistoricos')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async updateHistorico(context, payload) {
    await axios
      .put(`historicos/${payload.content.id}`, payload.content)
      .then(response => {
        context.dispatch('getAllHistoricos')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async deleteHistorico(context, payload) {
    await axios
      .delete(`historicos/${payload.content.id}`)
      .then(response => {
        context.dispatch('getAllHistoricos')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

export default actions
