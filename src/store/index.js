import { createStore } from 'vuex';
import fruit from './modules/fruit';
import category from './modules/category';
import user from './modules/user';

export default createStore({
  modules: {
    fruit,
    category,
    user
  }
});