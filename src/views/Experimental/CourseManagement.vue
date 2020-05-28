<template>
  <div class="course-management">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: 700;font-size:18px">课程管理</span>
      </div>
      <div class="studentmsg">
        <!-- 订单管理查询表单 -->
        <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
          <!-- 课程名称 -->
          <el-form-item label="课程名称">
            <el-input v-model="searchForm.name" placeholder="课程名称"></el-input>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item class="stubtn">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="clear">清空</el-button>
            <el-button type="primary" @click="add">添加课程</el-button>
          </el-form-item>
        </el-form>
        <!-- 课程信息表格 -->
        <el-table
          height="600px"
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
        >
          <!-- 课程名称 -->
          <el-table-column fixed prop="name" label="课程名称" width="200"></el-table-column>
          <!-- 创建时间 -->
          <el-table-column prop="build_time" label="创建时间" width="200"></el-table-column>
          <!-- 课程描述 -->
          <el-table-column prop="describe" label="课程描述" ></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" class="oprentain" width="300">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
              <el-button size="mini" type="danger" @click="lookchapter(scope.row)">查看章节</el-button>
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
        <!-- 添加课程模态框 -->
        <el-dialog width="800px" title="添加课程" :visible.sync="dialogFormVisible" class="dialog">
          <el-form :model="addform" :inline="true">
            <!-- 课程名称 -->
            <el-form-item label="课程名称" :label-width="formLabelWidth">
              <el-input v-model="addform.name" auto-complete="off"></el-input>
            </el-form-item>
            <!-- 课程描述 -->
            <el-form-item label="课程描述" :label-width="formLabelWidth" >
              <el-input style="width: 600px;" type="textarea" :rows="2" v-model="addform.describe" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <!-- 尾部 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addmessage">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 修改课程模态框 -->
        <el-dialog width="850px" title="修改课程" :visible.sync="dialogFormchange" class="dialog">
          <el-form style="width: 800px;" :model="changeform" :inline="true">
            <!-- 课程名称 -->
            <el-form-item label="课程名称" :label-width="formLabelWidth">
              <el-input v-model="changeform.name" auto-complete="off"></el-input>
            </el-form-item>
             <!-- 课程描述 -->
            <el-form-item label="课程描述" :label-width="formLabelWidth" >
              <el-input style="width: 600px;" type="textarea" :rows="2" v-model="changeform.describe" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <!-- 尾部 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormchange = false">取 消</el-button>
            <el-button type="primary" @click="changemessage">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口请求函数
import {
  getscourseserch,
  postcourseadd,
  postcoursedel,
  postcoursemodify
} from "@/api/api";
// 引入本地存储工具函数
import local from "@/utils/local";
import myencode from "@/utils/pwd";

export default {
  data() {
    return {
      // 搜索表单
      searchForm: {
        name: ""
      },
      tableData: [],
      currentPage: 1, //分页
      total: 0, //条数
      pagesize: 10, //默认每页条数
      dialogFormVisible: false, // 模态框显示和隐藏
      dialogFormchange: false,
      // 模态框
      // 增加
      addform: {
        name: "",
        describe: ""
      },
      // 修改
      changeform: {
        name: "",
        describe: ""
      },
      formLabelWidth: "100px", // 标签宽度
      // 接收参数
      tid: "",
      name: ""
    };
  },
  methods: {
    // 获取课程详情
    async getcourse() {
      // 获取搜索表单数据
      let { name } = this.searchForm;
      // 获取参数（结合了查询工具）
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        nm: name,
        p: this.currentPage
      };
      let api_key = local.get("api_key");
      let { data } = await getscourseserch({
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
    // 每页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
    },
    // 当前页改变
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getcourse();
    },
    // 查询
    search() {
      this.getcourse(); // 调用请求函数
    },
    // 清空
    clear() {
      // 清空表单
      this.searchForm = {
        name: ""
      };
      // 再次调用
      this.getcourse();
    },
    // 跳转到增加课程信息
    add() {
      this.dialogFormVisible = true;
    },
    // 增加课程信息
    async addmessage() {
      let { name, describe } = this.addform;
      let params = { nm: name, dc: describe };
      let api_key = local.get("api_key");
      // 发送添加课程请求
      let { code } = await postcourseadd({ api_key, params });
      if (code === 200) {
        this.$message({ message: "添加成功", type: "success" });
        this.getcourse();
      } else {
        return false;
      }
      this.dialogFormVisible = false;
      this.addform = {};
    },
    // 删除
    handleDelete(index) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let api_key = local.get("api_key");
          let cid = this.tableData[index].uuid;
          let name = this.tableData[index].name
          let params = { cid: cid,name:name };
          // // 确定
          let { code } = await postcoursedel({ api_key, params });
          console.log(code);
          // // 判断
          if (code === 200) {
            this.$message({ type: "success", message: "删除成功" });
            this.getcourse(); // 重新请求账号列表 刷新页面
          } else if (code === 900) {
            this.$message({ type: "error", message: "请先删除课程的内容" });
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
    // 编辑课程信息
    handleEdit(row) {
      this.dialogFormchange = true;
      this.changeform = { ...row }; // 赋值一份这个对象
    },
    // 修改
    async changemessage() {
      let api_key = local.get("api_key");
      this.dialogFormVisible = false; // 关闭模态框
      let { uuid, name, describe } = this.changeform;
      let params = { cid: uuid, nm: name, dc: describe };
      console.log(params)
      let { code } = await postcoursemodify({ api_key, params });
      if (code === 200) {
        this.$message({ type: "success", message: "修改成功" });
        this.getcourse(); // 刷新列表
      } else {
        this.$message({ type: "danger", message: "修改失败" });
      }
      this.dialogFormchange = false;
    },
    // 查看章节
    lookchapter(i) {
      this.$router.push({
        path: "/coursemanagement/chaptermanagement",
        query: {
          tid: i.uuid,
          name: i.name
        }
      });
    }
  },
  created() {
    this.getcourse();
  }
};
</script>

<style lang="less" scoped>
.course-management {
  height: 100%;
  .el-card {
    .el-table {
      td {
        padding: 6px 0 !important;
      }
      .el-button {
        width: 80px;
      }
    }
    .el-card__body {
      width: 1300px;
    }
    .studentmsg {
      .stubtn {
        .el-button {
          width: 80px;
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