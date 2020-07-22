import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },{
    path: '/category',
    component: Layout,
    children: [{
      path: 'category',
      name: 'category',
      component: () => import('@/pages/category/category'),
      meta: { title: '栏目管理', icon: 'nested' }
    }]
  },
  {
    path: '/information',
    component: Layout,
    // redirect: '/information',
    children: [{
      path: 'information',
      name: 'information',
      component: () => import('@/pages/information/information'),
      meta: { title: '校园资讯', icon: 'order' }
    },
    {
      path: 'addInformations',
      hidden:true,
      component: () => import('@/pages/information/addInformations'),
      meta: { title: '新增资讯'}
    },]
  },
  {
    path: '/courseManager',
    component: Layout,
    meta: { title: '课程管理', icon: 'table' },
    children: [
      {
        path: 'courseManager',
        component: () => import('@/pages/courseManager/courseManager'),
        meta: { title: '课程管理'}
      },
        {
        path: 'clazzroom',
        component: () => import('@/pages/courseManager/clazzroom'),
        meta: { title: '教室分配'}
      },
    ]
  },
  {
    path: '/Clazz',
    component: Layout,
    children: [
      {
        path: 'Clazz',
        component: () => import('@/pages/Clazz/Clazz'),
        meta: { title: '班级管理', icon: 'form'}
      }
    ]
  },
  {
    path: '/college',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'college',
        component: () => import('@/pages/college/college'),
        meta: { title: '学院管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/userInfo',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'userInfo',
        component: () => import('@/pages/userInfo/index'),
        meta: { title: '个人信息', icon: 'user' }
      }
    ]
  },
  
  


  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
