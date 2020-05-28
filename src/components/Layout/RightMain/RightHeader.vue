<template>
  <div class="right-header">
    <div class="left-box">
      <img src="../../../assets/imgs/logo.png" alt="">
    </div>
    <!-- 右边信息 -->
    <div class="right-box">
      <!-- 左边 -->
      <div class="welcome" style="font-size:18px;">欢迎{{accountname}}{{usernames}}登录!</div>
      <!-- 右边 -->
      <div class="img-wrop">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <img
              width="50"
              height="50"
              src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573467743258&di=efd41161c5f25c739c2d1102ab47f39f&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F20%2F20170820122316_5zFTP.jpeg"
              alt
            />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changepwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
// 引入接口请求函数
import { postLogout } from "@/api/api";
// 引入本地存储工具函数
import local from "@/utils/local";

export default {
  data() {
    return {
      accountname: "",
      usernames:""
    };
  },
  methods: {
    // 点击下拉菜单项触发
    handleCommand(command) {
      if (command === "changepwd") {
        // 那么点击的是修改密码 之后我们跳转到修改密码页面即可
        this.$router.push("/changepwd");
      } else if (command === "logout") {
        this.$confirm("确定退出吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async ({ value }) => {
            let api_key = local.get("api_key");
            // local.remove("api_key");
            // 确定
            let { code } = await postLogout({ api_key });
            console.log(code);
            // // 判断
            if (code === 200) {
              this.$message({ type: "success", message: "退出成功" });
              this.$router.push("/login");
            }
          })
          // 取消
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消退出"
            });
          });
      }
    }
  },
  created() {
    let username = local.get("username");
    this.usernames = username;
    console.log(this.usernames)
    let role = local.get("u_r");
    if(role === 1){
      this.accountname = "管理员"
    }else if( role === 2){
      this.accountname = "教师"
    }else{
      this.accountname = "学生"
    }
  }
};
</script>

<style lang="less" scoped>
.right-header {
  line-height: 50px;
  display: flex;
  padding: 0 50px 0 30px;
  color: #fff;
  // box-sizing: border-box;
  // border-bottom: 1px solid #f0f2f5;
  .left-box {
    display: flex;
    flex: 1;
    img {
      height: 45px;
      line-height: 50px;
    }
  }
  .right-box {
    flex: 0 0 280px;
    display: flex;
    .img-wrop {
      height: 50px;
      flex: 0 0 50px;
      .el-dropdown-link {
        img {
          border-radius: 50%;
        }
      }
    }
    .welcome {
      flex: 1;
      text-align: center;
      font-size: 16px;
    }
  }
}
</style>