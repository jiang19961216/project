<template>
  <el-container class="index-container">
    <el-header>
      <!-- 右上 -->
      <RightHeader />
    </el-header>
    <el-container>
      <!-- 左边 -->
      <el-aside :width="isCollapse ? '64px':'200px' ">
        <div class="left-nav">
          <div class="toggle-button" @click="togglecollpase">|||</div>
          <!-- 左侧导航 -->
            <!-- :default-active="activePath" -->
          <el-menu
            background-color="#304156"
            text-color="#fff"
            unique-opened
            router
            :collapse="isCollapse"
            :collapse-transition="false"
            :default-active="$route.path" 
          >
            <template v-for="item in accessMenu">
              <!-- 没有儿子的 -->
              <el-menu-item v-if="!item.children" :index="item.path" :key="item.title">
                <i class="iconfont" :class="item.icon"></i>
                <span slot="title">{{ item.title }}</span>
              </el-menu-item>

              <!-- 有儿子的 -->
              <el-submenu v-else :index="item.index" :key="item.title">
                <template slot="title" class="dev">
                  <i class="iconfont" :class="item.icon"></i>
                  <span>{{ item.title }}</span>
                </template>
                <el-menu-item
                  v-for="child in item.children"
                  :key="child.title"
                  :index="child.path"
                >{{ child.title }}</el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <!-- 中间内容 -->
      <el-main>
        <RightContent />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入组件
import RightHeader from "@/components/Layout/RightMain/RightHeader.vue";
import RightContent from "@/components/Layout/RightMain/RightContent.vue";
import local from "@/utils/local";

export default {
  data() {
    return {
      // 菜单数据
      menus: [
        // 1选择课程
        {
          path: "/index",
          icon: "icon-shouye",
          title: "选择课程",
          meta: [1, 2, 3]
        },
        // 2教学资料下载
        {
          path: "/teachclass",
          icon: "icon-jiaoxue",
          title: "教学资料下载",
          meta: [1, 2, 3]
        },
        // 3学生信息管理
        {
          path: "/studentmsg",
          icon: "icon-shujucangku",
          title: "学生信息管理",
          meta: [1,2]
        },
        // 4实验课程管理
        {
          path: "/coursemanagement",
          icon: "icon-ruanjianfuwu",
          title: "实验教学管理",
          meta: [1]
        },
        // 5教学资料管理
        {
          path: "/resourcesclass",
          icon: "icon-ziyuan",
          title: "教学资料管理",
          meta: [1, 2]
        },
        // 6教师信息管理
        {
          path: "/teachermsg",
          icon: "icon-shujucangku",
          title: "教师信息管理",
          meta: [1]
        },
        // 7权限管理
        // {
        //   path: "/jurisdiction",
        //   icon: "icon-quanxianxitong",
        //   title: "权限管理",
        //   meta: ["super"]
        // },
        // // 8日志管理
        {
          path: "/journal",
          icon: "icon-rizhiguanli",
          title: "日志管理",
          meta: [1]
        }
      ],
      // 是否折叠
      isCollapse: false,
      accessMenu: []
    };
  },
  // 注册
  components: {
    // 计算高亮效果
    activePath() {
      // 如果跳转到了商品的编辑页面 这个高亮的地址 还是返回 goodslist 也就是让商品列表保持激活
      if (this.$route.path === "/index/choicechapter") {
        return "/index";
      }

      if (this.$route.path === "/teachclass/teachingchapter") {
        return "/teachclass";
      }
      if (this.$route.path === "/teachclass/teachingfile") {
        return "/teachclass";
      }

      if (this.$route.path === "/studentmsg/studentmsgadd") {
        return "/studentmsg";
      }

      if (this.$route.path === "/coursemanagement/chaptermanagement") {
        return "/coursemanagement";
      }

      if (this.$route.path === "/resourcesclass/resourceschapter") {
        return "/resourcesclass";
      }
      if (this.$route.path === "/teachclass/resourcesfile") {
        return "/resourcesclass";
      }

      if (this.$route.path === "/teachermsg/teachmsgadd") {
        return "/teachermsg";
      }
      return this.$route.path;
    },
    RightHeader,
    RightContent
  },
  methods: {
    togglecollpase() {
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    // 从本地取出role
    let role = local.get("u_r");
    // 计算出权限菜单（可以访问的菜单）
    this.accessMenu = this.menus.filter(menu => menu.meta.includes(role));
    // console.log(this.accessMenu);
  }
};
</script>

<style lang="less" scoped>
.index-container {
  height: 100%;
  // 左侧
  .el-aside {
    height: 100%;
    background-color: #304156;
    .left-nav {
      .toggle-button {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        cursor: pointer;
        background-color: #4a5864;
      }
      .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-weight: 700;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .el-menu {
        border-right: none;
        .el-menu-item {
          // height: 45px;
          // line-height: 45px;
          // padding: 0 10px;
          // padding-left: 20px;
          i {
            margin-right: 10px;
          }
        }
        .el-submenu {
          .el-submenu__title {
            i {
              margin-right: 10px;
            }
          }
          .el-menu {
            .el-menu-item {
              background-color: #202f3f !important;
            }
          }
        }
      }
    }
  }
  .el-header {
    height: 50px !important;
    background: #202f3f;
  }
}
</style>