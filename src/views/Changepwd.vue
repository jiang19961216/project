<template>
  <div class="password-modify">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">修改密码</span>
      </div>

      <div>
        <!-- 修改密码表单 -->
        <el-form
          size="medium"
          :model="passwordModifyForm"
          status-icon
          :rules="rules"
          ref="passwordModifyForm"
          label-width="100px"
        >
          <!-- 原密码 -->
          <el-form-item label="原密码" prop="oldPwd">
            <el-input type="password" v-model="passwordModifyForm.oldPwd" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 新密码 -->
          <el-form-item label="新密码" prop="newPwd">
            <el-input type="password" v-model="passwordModifyForm.newPwd" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 确认新密码 -->
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model="passwordModifyForm.checkPass" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 确定 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入密码正则
import { passwordReg } from "@/utils/reg";
// 引入接口请求函数
import { postchangepwd } from "@/api/api";
// 引入本地存储工具函数
import local from "@/utils/local";
import myencode from "@/utils/pwd";

export default {
  data() {
    // 自定义验证旧密码
    const checkOldPwd = async (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码"));
      } else if (!rule.reg.test(value)) {
        callback(new Error(rule.msg));
      } else {
        callback();
      }
    };
    // 自定义验证新密码
    const validateNewPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (!rule.reg.test(value)) {
        callback(new Error(rule.msg));
      } else {
        // 反向验证一致性
        if (this.passwordModifyForm.checkPass !== "") {
          // 手动再次出发一致性校验
          this.$refs.passwordModifyForm.validateField("checkPass");
        }
        callback();
      }
    };

    // 自定义验证确认新密码
    const validateCheckPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordModifyForm.newPwd) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };

    return {
      // 密码修改表单
      passwordModifyForm: {
        oldPwd: "",
        newPwd: "",
        checkPass: ""
      },
      // 验证规则
      rules: {
        oldPwd: {
          required: true,
          msg: "输入 5-12位 数字或字母",
          trigger: "blur",
          validator: checkOldPwd,
          reg: passwordReg
        },
        newPwd: {
          required: true,
          validator: validateNewPwd,
          msg: "输入 5-12位 数字或字母",
          trigger: "blur",
          reg: passwordReg
        },
        checkPass: {
          required: true,
          validator: validateCheckPass,
          trigger: "blur"
        }
      }
    };
  },
  methods: {
    // 确定
    submitForm() {
      // 触发整个表单所有验证
      this.$refs.passwordModifyForm.validate(async valid => {
        if (valid) {
          let api_key = local.get("api_key");
          let { oldPwd, newPwd, checkPass } = this.passwordModifyForm;
          let opw = myencode(oldPwd);
          let npw = myencode(newPwd);
          let cnpw = myencode(checkPass);
          let params = {
            opw: opw,
            npw: npw,
            cnpw: cnpw
          };
          // 发送修改密码请求
          let { code } = await postchangepwd({ api_key, params });
          if (code === 200) {
            // 跳转到登录页
            this.$message({
              message: "修改成功!",
              type: "success"
            });
            this.$router.push("/login");
          } else if (code === 900) {
            this.$message({
              message: "密码错误，请核实后再试!",
              type: "error"
            });
          } else {
            return false;
          }
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs.passwordModifyForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.password-modify {
  .el-card {
    .el-card__header {
      .title {
        font-weight: 700;
      }
    }
    .el-card__body {
      .el-form {
        width: 320px;
      }
    }
  }
}
</style>