import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    eventItem: [],
    error: false
  },
  mutations: {
    updateEventItems (state, arr) {
      state.eventItem = state.eventItem.map(item => {
        for (const newItem of arr) {
          if (item._id === newItem._id) {
            return newItem
          }
        }
        return item
      })
    },
    sortEventItem (state) {
      state.eventItem = state.eventItem.sort(function (a, b) {
        a = a.time.hour * 60 + a.time.minutes
        b = b.time.hour * 60 + b.time.minutes
        return a - b
      })
    },
    setEventItem (state, data) {
      state.eventItem = data
    },
    addEventItem (state, data) {
      state.eventItem.push(data)
    },
    errorSet (state, data) {
      state.error = true
      console.error(data)
      window.M.toast({ html: 'Oops, something went wrong' })
      state.error = false
    },
    eventItemDelete (state, id) {
      state.eventItem = state.eventItem.filter(el => el._id !== id)
    }
  },
  actions: {
    getAllEventItem ({ commit }) {
      axios.get('/eventItem/getAll').then(result => {
        commit('setEventItem', result.data)
        commit('sortEventItem')
      }).catch(err => commit('errorSet', err))
    },
    async addEventItem ({ commit }, eventItem) {
      await axios.post('/eventItem/add', eventItem).then(result => {
        commit('addEventItem', result.data)
        commit('sortEventItem')
      }).catch(err => commit('errorSet', err))
    },
    async eventItemDelete ({ commit }, id) {
      await axios.post('/eventItem/delete', { id }).then(() => {
        commit('eventItemDelete', id)
      }).catch(err => commit('errorSet', err))
    },
    async eventItemsUpdate ({ commit }, { ids, time }) {
      await axios.post('/eventItem/update', { ids, time }).then(result => {
        commit('updateEventItems', result.data)
        commit('sortEventItem')
      }).catch(err => commit('errorSet', err))
    }
  }
})
