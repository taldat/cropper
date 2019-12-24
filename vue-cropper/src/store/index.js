import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: []
  },
  mutations: {
    SET_DATA(state, newValue) {
      state.data = newValue
    }
  },
  actions: {
    saveData({commit, state}, newValue) {
      commit('SET_DATA', newValue)
      return state.data
    }
  },
})
