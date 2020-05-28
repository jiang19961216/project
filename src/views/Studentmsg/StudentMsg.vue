<template>
  <div class="student-msg">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: 700;font-size:18px">学生信息管理</span>
      </div>
      <div class="studentmsg" slot-scope="scope">
        <!-- 管理查询表单 -->
        <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
          <!-- 姓名 -->
          <el-form-item label="姓名">
            <el-input v-model="searchForm.realname" placeholder="姓名"></el-input>
          </el-form-item>
          <!-- 学号 -->
          <el-form-item label="学号">
            <el-input v-model="searchForm.student_id" placeholder="学号"></el-input>
          </el-form-item>
          <!-- 专业 -->
          <el-form-item label="专业">
            <el-input v-model="searchForm.subject" placeholder="专业"></el-input>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item class="stubtn" >
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="clear">清空</el-button>
            <el-button type="primary" @click="add">添加学生</el-button>          
          </el-form-item>
        </el-form>
        <!-- 导入导出 -->
        <el-upload
          class="upload-demo"
          ref="upload"
          action
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="success" >选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="danger" @click="imports">导入信息表</el-button>
          <el-button size="small" type="warning" @click="exported">下载模板</el-button>
        </el-upload>  
        <!-- 学生信息表格 -->
        <el-table
          height="600px"
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
        >
          <!-- 姓名 -->
          <el-table-column fixed prop="realname" label="姓名" width="100"></el-table-column>
          <!-- 学号 -->
          <el-table-column prop="student_id" label="学号" width="150"></el-table-column>
          <!-- 专业 -->
          <el-table-column prop="subject" label="专业" width="180"></el-table-column>
          <!-- 创建时间 -->
          <el-table-column prop="build_time" label="创建时间" width="200"></el-table-column>
          <!-- 操作 -->
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
              <el-button size="mini" type="danger" @click="resetPassword(scope.row)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="block" style="margin-top:20px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pagesize"
            :total="total"
          ></el-pagination>
        </div>

        <!-- 模态框 -->
        <el-dialog width="850px" title="修改学生信息" :visible.sync="dialogFormVisible" class="dialog">
          <el-form style="width: 800px;" :model="form" :inline="true">
            <!-- 姓名 -->
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.realname" auto-complete="off"></el-input>
            </el-form-item>
            <!-- 学号 -->
            <el-form-item label="学号" :label-width="formLabelWidth">
              <el-input :disabled="true" v-model="form.student_id" auto-complete="off"></el-input>
            </el-form-item>
            <!-- 专业 -->
            <el-form-item label="专业" :label-width="formLabelWidth">
              <el-input  v-model="form.subject" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <!-- 尾部 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="modifymessage">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口请求函数
import {
  getstudentserch,
  poststudentdel,
  poststudentmodify,
  postresetpwd,
  poststudentimport
} from "@/api/api";
// 引入本地存储工具函数
import local from "@/utils/local";
import myencode from "@/utils/pwd";
import moment from "moment";
import axios from "axios";

export default {
  data() {
    return {
      // 搜索表单
      searchForm: {
        student_id: "",
        realname: "",
        subject: "",
      },
      tableData: [],
      currentPage: 1, //分页
      total: 0, //条数
      pagesize: 10, //默认每页条数
      dialogFormVisible: false, // 模态框显示和隐藏
      // 模态框
      form: {
        student_id: "",
        realname: "",
        subject:""
      },
      formLabelWidth: "100px", // 标签宽度
      fileList: []
    };
  },
  methods: {
    // 获取学生详情
    async getstudent() {
      // 获取搜索表单数据
      let {
        student_id,
        realname,
        subject,
      } = this.searchForm;
      // 获取订单参数（结合了查询工具）
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        rn: realname,
        st: subject,
        sd: student_id,
        p: this.currentPage
      };
      let api_key = local.get("api_key");
      let { data } = await getstudentserch({
        params,
        api_key
      });
      console.log(data);
      // 赋值渲染
      this.tableData = data.list;
      this.total = data.total;
    },
    // 删除
    handleDelete(index) {
      this.$prompt("请输入密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async ({ value }) => {
          let api_key = local.get("api_key");
          let tid = this.tableData[index].uuid;
          let name = this.tableData[index].realname
          let params = { pw: myencode(value), tid: tid,name:name };
          // // 确定
          let { code } = await poststudentdel({ api_key, params });
          // // 判断
          if (code === 200) {
            this.$message({ type: "success", message: "删除成功" });
            this.getstudent(); // 重新请求账号列表 刷新页面
          }else{
            this.$message.error('删除失败');
          }
        })
        // 取消
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 编辑
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.form = { ...row }; // 赋值一份这个对象
    },
    // 限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    // 编辑信息
    async modifymessage() {
      let api_key = local.get("api_key");
      this.dialogFormVisible = false; // 关闭模态框
      let {
        uuid,
        student_id,
        subject,
        realname,
      } = this.form;
      let params = {
        tid: uuid,
        rn: realname,
        st: subject,
      };
      let { code } = await poststudentmodify({ api_key, params });
      console.log(code);
      if (code === 200) {
        this.$message({ type: "success", message: "修改成功" });
        this.getstudent(); // 刷新列表
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.getstudent();
    },
    // 当前页改变
    handleCurrentChange(p) {
      console.log(p);
      this.currentPage = p;
      this.getstudent();
    },
    // 查询
    search() {
      this.getstudent(); // 调用请求函数
    },
    // 清空
    clear() {
      // 清空表单
      this.searchForm = {
        student_id: "",
        realname: "",
        college: "",
        phone: "",
        classid: "",
        departments: ""
      };
      // 再次调用
      this.getstudent();
    },
    // 导入
    async imports() {
      let formData = new FormData();
      let file = this.$refs.upload.uploadFiles[0].raw;
      // console.log()
      console.log(file);
      if (file) {
        let api_key = local.get("api_key");
        formData.append("fn", file);
        formData.append("api_key", api_key);
        await axios({
          url: "server/student/import",
          data: formData,
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(res => {
          let { code } = res.data;
          console.log(code);
          if (code === 200) {
            this.$message({ type: "success", message: "上传成功" });
            this.getstudent();
          } else if (code === 500) {
            this.$message({ type: "error", message: "请选择正确格式的文件" });
          }
        }); // 发送请求
      } else {
        this.$message({ type: "error", message: "请选择文件" });
      }
    },
    // 下载学生信息模块
    exported() {
      window.location.href = "/server/student/template";
    },
    // 跳转到增加学生信息
    add() {
      this.$router.push("/studentmsg/studentmsgadd");
    },
    //重置密码
    async resetPassword(row) {
      this.form = { ...row }; // 赋值一份这个对象
      let api_key = local.get("api_key");
      let { user_id } = this.form;
      let params = {
        uid: user_id
      };
      let { code } = await postresetpwd({ api_key, params });
      console.log(code);
      if (code === 200) {
        this.$message({ type: "success", message: "重置成功" });
        this.getstudent(); // 刷新列表
      }
    }
  },
  created() {
    this.total = this.tableData.length;
    this.getstudent();
  }
};
</script>

<style lang="less" scoped>
.student-msg {
  height: 100%;
  .el-card {
    .el-table {
      margin-top: 6px;
      td {
        padding: 6px 0 !important;
      }
    }
    .el-card__body {
      width: 1300px;
    }
    .studentmsg {
      .stubtn {
        .el-button {
          width: 100px;
        }
      }
    }
  }
  .block {
    display: flex;
    .el-pagination {
      flex: 1;
    }
    .el-button {
      flex: 0 0 100px;
    }
  }
  .el-dialog {
    .el-input {
      width: 240px;
    }
    .input {
      width: 240px;
    }
  }
}
</style>