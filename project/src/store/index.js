import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import userInfo from './userInfo/index'
import college from './college/college'
import information from './information/information'
import courseManager from './courseManager/courseManager'
import clazzroom from './courseManager/clazzroom'
import Clazz from './Clazz/Clazz'
import category from './category/category'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    userInfo,
    college,
    information,
    courseManager,
    clazzroom,
    Clazz,
    category
  },
  getters
})

export default store
