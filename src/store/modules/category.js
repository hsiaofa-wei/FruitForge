import { getCategories, addCategory, updateCategory, deleteCategory } from '@/api/api';

export default {
  namespaced: true,
  state: {
    categories: [],
    total: 0,
    loading: false
  },
  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    SET_TOTAL(state, total) {
      state.total = total;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    ADD_CATEGORY(state, category) {
      state.categories.push(category);
      state.total += 1;
    },
    UPDATE_CATEGORY(state, updatedCategory) {
      const index = state.categories.findIndex(c => c.id === updatedCategory.id);
      if (index !== -1) {
        state.categories.splice(index, 1, updatedCategory);
      }
    },
    DELETE_CATEGORY(state, id) {
      const index = state.categories.findIndex(c => c.id === id);
      if (index !== -1) {
        state.categories.splice(index, 1);
        state.total -= 1;
      }
    }
  },
  actions: {
    async fetchCategories({ commit }, params) {
      commit('SET_LOADING', true);
      try {
        const response = await getCategories(params);
        commit('SET_CATEGORIES', response.data.list);
        commit('SET_TOTAL', response.data.total);
        return response; // 添加这行
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async addCategory({ commit }, categoryData) {
      const response = await addCategory(categoryData);
      commit('ADD_CATEGORY', response.data);
      return response;
    },
    async updateCategory({ commit }, { id, data }) {
      const response = await updateCategory(id, data);
      commit('UPDATE_CATEGORY', response.data);
      return response;
    },
    async deleteCategory({ commit }, id) {
      await deleteCategory(id);
      commit('DELETE_CATEGORY', id);
    }
  }
}; 