import { SET_DESTINATARIOS } from './mutations'
import axios from '@/plugins/axios'

const actions = {
  async getAllDestinatarios(context, payload) {
    payload = payload ? payload : {}
    await axios
      .get('destinatarios', { params: payload.params })
      .then(response => {
        context.commit(SET_DESTINATARIOS, response.data)
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async createDestinatario(context, payload) {
    await axios
      .post('destinatarios', payload.content)
      .then(response => {
        context.dispatch('getAllDestinatarios')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async updateDestinatario(context, payload) {
    await axios
      .put(`destinatarios/${payload.content.id}`, payload.content)
      .then(response => {
        context.dispatch('getAllDestinatarios')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async deleteDestinatario(context, payload) {
    await axios
      .delete(`destinatarios/${payload.content.id}`)
      .then(response => {
        context.dispatch('getAllDestinatarios')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

export default actions
