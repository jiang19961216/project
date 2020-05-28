<template>
  <div class="login">
    <div class="imgs">
      <img src="./../assets/imgs/logo.png" alt="">
      <h1>PaaS云微服务管理系统</h1>
    </div>
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="login-Form"
    >
      <!-- 账号 -->
      <el-form-item label="账号" prop="account">
        <el-input
          prefix-icon="iconfont icon-user-s"
          type="text"
          v-model="loginForm.account"
          auto-complete="off"
        ></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input
          @click.native="changeicon"
          prefix-icon="iconfont icon-lock"
          :suffix-icon="visible ? 'iconfont icon-yanjing_kai':'iconfont icon-yanjing_bi'"
          :type="visible ? 'text': 'password'"
          v-model="loginForm.password"
          auto-complete="off"
          @keydown.native.enter="submitForm"
        ></el-input>
      </el-form-item>

      <!-- 登录 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入密码正则
import { passwordReg } from "@/utils/reg";
// 引入接口请求函数
import { getLogin } from "@/api/api";
import { postLogin } from "@/api/api";
// 引入本地存储工具函数
import local from "@/utils/local";
import myencode from "@/utils/pwd";

export default {
  data() {
    // 密码验证
    const validatepassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码"));
      } else if (!rule.reg.test(value)) {
        callback(new Error(rule.msg));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: "",
        password: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 ~ 30 之间", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            msg: "输入 1-30位 数字或字母",
            trigger: "blur",
            validator: validatepassword,
            reg: passwordReg
          }
        ]
      },
      visible: false
    };
  },
  async created() {
    let res = await getLogin();
    let { data, code } = res.data;
    // console.log(code);
    let key = data.api_key;
    if (code === 200) {
      local.set("api_key", key);
    }
  },
  methods: {
    submitForm() {
      // 点击验证所有表单
      this.$refs.loginForm.validate(async vaid => {
        if (vaid) {
          let api_key = local.get("api_key");
          let { account, password } = this.loginForm;
          let un = myencode(account);
          let pw = myencode(password);
          // 如果valid是true 证明所有前端验证已经通过 可以发送给后端
          let { data } = await postLogin({
            un,
            pw,
            api_key
          });
          let username = data.data.username;
          local.set("username", username);
          console.log(data);
          if (data.code === 200) {
            local.set("u_r", data.data.role);
            this.$message({ message: "登录成功", type: "success" });
            this.$router.push({
              path: "/index",
            });
          } else if (data.code === 900) {
            this.$message({
              message: "无此用户名或密码，请核实后再试!",
              type: "error"
            });
          } else {
            return false;
          }
        }
      });
    },
    // 改变密码显示隐藏
    changeicon(e) {
      if (e.target.className.includes("icon-yanjing") === true) {
        this.visible = !this.visible;
      }
    }
  }
};
</script>

<style lang="less">
.login {
  height: 100%;
  background: #2d3a4b;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .imgs {
    flex: 0 0 380px;
    margin-left: 35px;
    img {
      margin-top: 200px;
    }
    h1 {
      font-size: 32px;
      text-align: center;
      padding-top: 18px;
      color: #59637f;
    }
  }
  .login-Form {
    width: 400px;
    flex: 1;
    // margin: auto;
    .el-form-item {
      .el-form-item__label {
        color: #fff;
      }
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>