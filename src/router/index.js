import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 重定向
  {
    path: "/",
    redirect: "/login"
  },
  // 登陆路由
  {
    path: "/login",
    component: () => import("../views/Login.vue")
  },
  {
    path: '/index',
    component: () => import('../views/Index.vue'),
    children: [
      // 1选择课程 （进入后端 默认看到一个内容）
      {
        path: '',
        component: () => import('../views/ChoiceClass/ChoiceClass.vue'),
        meta: {
        }
      },
      {
        path: '/index/choicechapter',
        component: () => import('../views/ChoiceClass/ChoiceChapter.vue'),
        meta: {
        }
      },
      // 2教学资料下载
      {
        path: '/teachclass',
        component: () => import('../views/Teaching/TeachClass.vue'),
        meta: {
        }
      },
      {
        path: '/teachclass/teachingchapter',
        component: () => import('../views/Teaching/TeachChapter.vue'),
        meta: {
        }
      },
      {
        path: '/teachclass/teachingfile',
        component: () => import('../views/Teaching/TeachFile.vue'),
        meta: {
        }
      },
      // 3学生信息管理
      {
        path: '/studentmsg',
        component: () => import('../views/Studentmsg/StudentMsg.vue'),
        meta: {
        }
      },
      {
        path: '/studentmsg/studentmsgadd',
        component: () => import('../views/Studentmsg/StudentmsgAdd.vue'),
        meta: {
        }
      },
      // 4实验课程管理
      {
        path: '/coursemanagement',
        component: () => import('../views/Experimental/CourseManagement.vue'),
        meta: {
        }
      },
      {
        path: '/coursemanagement/chaptermanagement',
        component: () => import('../views/Experimental/ChapterManagement.vue'),
        meta: {
        }
      },
      // 5教学资料管理
      {
        path: '/resourcesclass',
        component: () => import('../views/Resources/ResourcesClass.vue'),
        meta: {
        }
      },
      {
        path: '/resourcesclass/resourceschapter',
        component: () => import('../views/Resources/ResourcesChapter.vue'),
        meta: {
        }
      },
      {
        path: '/resourcesclass/resourcesfile',
        component: () => import('../views/Resources/ResourcesFile.vue'),
        meta: {
        }
      },
      // 6教师信息管理
      {
        path: '/teachermsg',
        component: () => import('../views/Teachmsg/TeacherMsg.vue'),
        meta: {
        }
      },
      {
        path: '/teachermsg/teachmsgadd',
        component: () => import('../views/Teachmsg/Teachmsgadd.vue'),
        meta: {
        }
      },
      // 7权限管理
      {
        path: '/jurisdiction',
        component: () => import('../views/Jurisdiction.vue'),
        meta: {
        }
      },
      // 8日志管理
      {
        path: '/journal',
        component: () => import('../views/Journal.vue'),
        meta: {
        }
      },
      // 9修改密码
      {
        path: '/changepwd',
        component: () => import('../views/Changepwd.vue'),
        meta: {
        }
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
