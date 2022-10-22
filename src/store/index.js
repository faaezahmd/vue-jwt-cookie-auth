import { createStore } from "vuex";
import axios from "axios";
import VuexPersistence from 'vuex-persist';
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default createStore({
  state: {
    user: null,
    posts: null
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    StatePosts: (state) => state.posts,
    StateUser: (state) => state.user
  },
  mutations: {
    setUser(state, username) {
      state.user = username;
    },
    setPosts(state, posts) {
      state.posts = posts;
    },
    LogOut(state) {
      state.user = null;
      state.posts = null;
    }
  },
  actions: {
    async Register({ dispatch }, form) {
      await axios.post("register", form);
      let UserForm = new FormData();
      UserForm.append("username", form.username);
      UserForm.append("password", form.password);
      await dispatch("LogIn", UserForm);
    },
    async LogIn({ commit }, User) {
      await axios.post("login", {
        username: "sarimalavi",
        password: "sarim123notreallyhashed"
      }, { withCredentials: true });
      await commit("setUser", User.get("username"));
    },
    async CreatePost({ dispatch }, post) {
      await axios.post("post", post);
      await dispatch("GetPosts");
    },
    async GetPosts({ commit }) {
      let response = await axios.get("posts");
      commit("setPosts", response.data);
    },
    async LogOut({ commit }) {
      let user = null;
      commit("LogOut", user);
    }
  },
  modules: {},
  plugins: [vuexLocal.plugin],
});
