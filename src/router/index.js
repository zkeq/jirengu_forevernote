import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import About from '@/components/About'
import Login from '@/components/Login'
import Notebooks from '@/components/NotebookList.vue'
import NoteDetail from '@/components/NoteDetail.vue'
import TrashDetail from '@/components/TrashDetail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/notebooks',
      component: Notebooks
    }, 
    {
      path: '/note',
      component: NoteDetail
    },
    {
      path: '/trash',
      component: TrashDetail
    },
    {
      // 会匹配所有路径
      path: '/*',
      component: HelloWorld
    }
  ]
})
