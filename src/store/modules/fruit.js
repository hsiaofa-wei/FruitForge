import { getFruits, addFruit, updateFruit, deleteFruit } from '@/api/api';

export default {
  namespaced: true,
  state: {
    fruits: [],
    total: 0,
    loading: false
  },
  mutations: {
    SET_FRUITS(state, fruits) {
      state.fruits = fruits;
    },
    SET_TOTAL(state, total) {
      state.total = total;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },

    ADD_FRUIT(state, fruit) {
      state.fruits.push(fruit)
      state.total += 1
    },
    UPDATE_FRUIT(state, updatedFruit) {
      const index = state.fruits.findIndex(f => f.id === updatedFruit.id)
      if (index !== -1) {
        state.fruits.splice(index, 1, updatedFruit)
      }
    },
    DELETE_FRUIT(state, id) {
      const index = state.fruits.findIndex(f => f.id === id);
      if (index !== -1) {
        state.fruits.splice(index, 1);
        state.total -= 1;
      }
    }
  },
  actions: {
    async fetchFruits({ commit }, params) {
      commit('SET_LOADING', true);
      try {
        const response = await getFruits(params);
        commit('SET_FRUITS', response.data.list);
        commit('SET_TOTAL', response.data.total);
        return response; // 添加这行
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async addFruit({ commit }, fruitData) {
      const response = await addFruit(fruitData);
      commit('ADD_FRUIT', response.data);
      return response;
    },
    async updateFruit({ commit }, { id, data }) {
      const response = await updateFruit(id, data);
      commit('UPDATE_FRUIT', response.data);
      return response;
    },
    async deleteFruit({ commit }, id) {
      await deleteFruit(id);
      commit('DELETE_FRUIT', id);
    }
  }
}; 