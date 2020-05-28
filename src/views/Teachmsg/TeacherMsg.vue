<template>
  <div class="teacher-msg">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: 700;font-size:18px">教师信息管理</span>
      </div>
      <div class="teachermsg">
        <!-- 管理查询表单 -->
        <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
          <!-- 姓名 -->
          <el-form-item label="姓名">
            <el-input v-model="searchForm.realname" placeholder="姓名"></el-input>
          </el-form-item>
          <!-- 电话 -->
          <el-form-item label="专业">
            <el-input v-model="searchForm.subject" placeholder="专业"></el-input>
          </el-form-item>
          <!-- 学院 -->
          <el-form-item label="教师编号">
            <el-input v-model="searchForm.teacher_id" placeholder="教师编号"></el-input>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item class="btn">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="clear">清空</el-button>
            <el-button type="primary" @click="add">添加教师</el-button>
          </el-form-item>
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
        </el-form>
        <!-- 学生信息表格 -->
        <el-table
          height="600px"
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
        >
          <!-- 姓名 -->
          <el-table-column fixed prop="realname" label="姓名" width="100"></el-table-column>
          <!-- 专业 -->
          <el-table-column prop="subject" label="专业" width="180"></el-table-column>
          <!-- 教师编号 -->
          <el-table-column prop="teacher_id" label="教师编号" width="160"></el-table-column>
          <!-- 创建时间 -->
          <el-table-column prop="build_time" label="创建时间" width="200"></el-table-column>
          <!-- 操作 -->
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
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
        <el-dialog width="850px" title="修改教师信息" :visible.sync="dialogFormVisible" class="dialog">
          <el-form style="width: 800px;" :model="form" :inline="true">
            <!-- 姓名 -->
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.realname" auto-complete="off"></el-input>
            </el-form-item>
            <!-- 专业 -->
            <el-form-item label="专业" :label-width="formLabelWidth">
              <el-input v-model="form.subject" auto-complete="off"></el-input>
            </el-form-item>
            <!-- 教师编号 -->
            <el-form-item label="院系" :label-width="formLabelWidth">
              <el-input :disabled="true" v-model="form.teacher_id" auto-complete="off"></el-input>
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
import { getteachserch, postteachdel, postteachmodify } from "@/api/api";
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
        realname: "",
        teacher_id: "",
        subject: ""
      },
      tableData: [],
      currentPage: 1, //分页
      total: 0, //条数
      pagesize: 10, //默认每页条数
      dialogFormVisible: false, // 模态框显示和隐藏
      // 模态框
      form: {
        teacher_id: "",
        subject: "",
        realname: ""
      },
      formLabelWidth: "100px", // 标签宽度
      ids: "",
      fileList: []
    };
  },
  methods: {
    // 获取教师详情
    async getteach() {
      // 获取搜索表单数据
      let { teacher_id, realname, subject } = this.searchForm;
      // 获取订单参数（结合了查询工具）
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        rn: realname,
        td: teacher_id,
        st: subject,
        p: this.currentPage
      };
      let api_key = local.get("api_key");
      let { data } = await getteachserch({
        params,
        api_key
      });
      console.log(data);
      // 赋值渲染
      this.tableData = data.list;
      this.total = data.total;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
    },
    // 当前页改变
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getteach();
    },
    // 查询
    search() {
      this.getteach(); // 调用请求函数
    },
    // 清空
    clear() {
      // 清空表单
      this.searchForm = {
        subject: "",
        realname: "",
        teacher_id: ""
      };
      // 再次调用
      this.getteach();
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
          url: "server/teacher/import",
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
            this.getteach();
          } else {
            this.$message({ type: "error", message: "请选择正确格式的文件" });
          }
        }); // 发送请求
      } else {
        this.$message({ type: "error", message: "请选择文件" });
      }
    },
    // 导出
    exported() {
      window.location.href = "/server/teacher/template";
    },
    // 跳转到增加学生信息
    add() {
      this.$router.push("/teachermsg/teachmsgadd");
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
          let name = this.tableData[index].filename;
          let params = { pw: myencode(value), tid: tid, name: name };
          // // 确定
          let { code } = await postteachdel({ api_key, params });
          // // 判断
          if (code === 200) {
            this.$message({ type: "success", message: "删除成功" });
            this.getteach(); // 重新请求账号列表 刷新页面
          } else {
            this.$message.error("删除失败");
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
    // 编辑信息
    async modifymessage() {
      let api_key = local.get("api_key");
      this.dialogFormVisible = false; // 关闭模态框
      let { uuid, teacher_id, realname, subject } = this.form;
      console.log(this.form);
      let params = {
        tid: uuid,
        rn: realname,
        st: subject
      };
      // console.log(params.bd)
      let { code } = await postteachmodify({ api_key, params });
      console.log(code);
      if (code === 200) {
        this.$message({ type: "success", message: "修改成功" });
        this.getteach(); // 刷新列表
      }
    }
  },
  created() {
    this.getteach();
  }
};
</script>

<style lang="less" scoped>
.teacher-msg {
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
    .teachermsg {
      .el-input {
        width: 180px;
      }
      .btn {
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