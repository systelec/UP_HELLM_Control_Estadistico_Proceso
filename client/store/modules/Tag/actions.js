import { SET_TAGS } from './mutations'
import axios from '@/plugins/axios'

const actions = {
  async getAllTags(context, payload) {
    payload = payload ? payload : {}
    await axios
      .get('tags', { params: payload.params })
      .then(response => {
        context.commit(SET_TAGS, response.data)
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async createTag(context, payload) {
    await axios
      .post('tags', payload.content)
      .then(response => {
        context.dispatch('getAllTags')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async updateTag(context, payload) {
    await axios
      .put(`tags/${payload.content.id}`, payload.content)
      .then(response => {
        context.dispatch('getAllTags')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  async deleteTag(context, payload) {
    await axios
      .delete(`tags/${payload.content.id}`)
      .then(response => {
        context.dispatch('getAllTags')
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

export default actions
