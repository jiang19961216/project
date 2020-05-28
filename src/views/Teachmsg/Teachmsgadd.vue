<template>
  <div class="teachermsg-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-page-header style="font-weight: 700;font-size:18px" @back="goBack" content="教师信息添加"></el-page-header>
      </div>
      <el-form :model="form" label-width="100px" :rules="rules" ref="form">
        <!-- 姓名 -->
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="form.realname"></el-input>
        </el-form-item>
        <!-- 专业 -->
        <el-form-item label="专业" prop="subject">
          <el-input v-model="form.subject"></el-input>
        </el-form-item>
        <!-- 教师编号 -->
        <el-form-item label="教师编号" prop="realname">
          <el-input v-model="form.teacher_id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" type="primary" @click="addmessage">添加教师</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入密码正则
import { passwordReg } from "@/utils/reg";
// 引入接口请求函数
import { postteachadd } from "@/api/api";
// 引入本地存储工具函数
import local from "@/utils/local";
import myencode from "@/utils/pwd";
import moment from "moment";

export default {
  data() {
    // 密码验证;
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
      formLabelWidth: "100px", // 标签宽度
      form: {
        realname: "",
        subject: "",
        teacher_id: ""
      },
      rules: {
        realname: [{ required: true, message: "请输入行吗", trigger: "blur" }],
        subject: [{ required: true, message: "请输入专业", trigger: "blur" }],
        teacher_id: [{ required: true, message: "请输入教师编号", trigger: "blur" }],
      }
    };
  },
  methods: {
    addmessage() {
      this.$refs.form.validate(async vaid => {
        if (vaid) {
          let api_key = local.get("api_key");
          // 把教师表单所有数据取出来
          let {
            realname,
            subject,
            teacher_id,
          } = this.form;
          let params = {
            rn: realname,
            st: subject,
            td: teacher_id,
          };
          //   // 发送添加教师请求
          let { code } = await postteachadd({ api_key, params });
          if (code === 200) {
            this.$message({ message: "添加成功", type: "success" });
            this.$router.push("/teachermsg");
          } else {
            return false;
          }
        }
      });
    },
    // 返回上一级
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.teachermsg-add {
  height: 100%;
  .int {
    width: 450px;
  }
  .el-form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .el-input {
      width: 350px;
    }
  }
}
</style>