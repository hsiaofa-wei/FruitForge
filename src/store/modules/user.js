import { login, getUserProfile, updateUserProfile, updateUserAvatar, updateUserPassword } from '@/api/api';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || '',
    userInfo: null,
    loading: false
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    CLEAR_USER(state) {
      state.token = '';
      state.userInfo = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo'); // 同时清除用户信息
    }
  },
  actions: {
    async login({ commit }, loginData) {
      commit('SET_LOADING', true);
      try {
        const response = await login(loginData);
        if (response.code === 200) {
          commit('SET_TOKEN', response.data.token);
          commit('SET_USER_INFO', {
            nickname: response.data.nickname,
            user_pic: response.data.user_pic
          });
        }
        return response;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async getUserProfile({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await getUserProfile();
        commit('SET_USER_INFO', response.data);
        return response;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async updateUserProfile({ commit }, data) {
      const response = await updateUserProfile(data);
      commit('SET_USER_INFO', response.data);
      return response;
    },
    async updateUserAvatar({ commit }, data) {
      const response = await updateUserAvatar(data)
      commit('SET_USER_INFO', response.data)
      return response
    },
    async updateUserPassword({ commit }, data) {
      return await updateUserPassword(data);
    },
    async logout({ commit }) {
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'centered-message-box',
          center: true
        })
        await logout() // 调用axios接口
        commit('CLEAR_USER')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('退出登录失败:', error)
          throw error
        }
      }
    }
  },
  getters: {
    username: state => state.userInfo?.nickname || 'Guest',
  },
};