<template>
  <div class="choice-class">
    <!-- 当前正在运行的环境 -->
    <el-card class="box-cards">
      <div slot="header" class="clearfix">
        <span style="font-weight: 600;font-size:18px">当前正在运行的虚拟环境</span>
      </div>
      <div class="studentmsgs">
        <el-table
          :data="NowtableData"
          border
          @selection-change="handleSelectionChange"
        >
          <!-- 课程名称 -->
          <el-table-column prop="course_name" label="课程名称" width="280"></el-table-column>
          <!-- 章节名称 -->
          <el-table-column prop="chapter_name" label="章节名称" width="280"></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" class="oprentain">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="open(scope.row)">打开</el-button>
              <el-button size="mini" type="danger" @click="shut(scope.row)">关闭</el-button>
              <el-button v-if="role !== 3" size="mini" type="danger" @click="generate(scope.row)">生成新的镜像</el-button>
              <el-button size="mini" type="danger" @click="onplouds(scope.row)">文件上传</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 选择课程 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: 700;font-size:20px">选择课程</span>
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
          </el-form-item>
        </el-form>
        <!-- 学生信息表格 -->
        <el-table
          height="600px"
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
        >
          <!-- 课程名称 -->
          <el-table-column prop="name" label="课程名称" width="300"></el-table-column>
          <!-- 课程描述 -->
          <el-table-column prop="describe" label="课程描述" ></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" class="oprentain"  width="200">
            <template slot-scope="scope">
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
        <!-- 增加新镜像模态框 -->
        <el-dialog width="500px" title="增加章节" :visible.sync="dialogFormVisible" class="dialog">
          <el-form style="width: 500px;" :model="addform" :inline="true">
            <!-- 新章节名称 -->
            <el-form-item label="新章节名称" :label-width="formLabelWidth">
              <el-input v-model="addform.chaptername" auto-complete="off"></el-input>
            </el-form-item>
            <!-- 新镜像名称 -->
            <el-form-item label="新镜像名称" :label-width="formLabelWidth">
              <el-input v-model="addform.imgname" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <!-- 尾部 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addmessage">确 定</el-button>
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
  getcurrentEnv,
  postcloseEnv,
  postmake,
  poststartEnvUpload
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
      formLabelWidth: "100px", // 标签宽度
      // 接收参数
      tid: "",
      name: "",
      NowtableData: [],
      role: "",
      dialogFormVisible: false, // 模态框显示和隐藏
      // 增加
      addform: {
        imgname: "",
        chaptername: ""
      },
      nowform: {}
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
    // 获取当前正在运行的镜像
    async getcurrentEnv() {
      let api_key = local.get("api_key");
      let { data } = await getcurrentEnv({
        api_key
      });
      console.log(data);
      this.NowtableData = data.list;
      this.total = data.total;
    },
    // 关闭当前正在运行的镜像
    shut() {
      this.$confirm("确认关闭吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let api_key = local.get("api_key");
          // // 确定
          let { code } = await postcloseEnv({
            api_key
          });
          // // 判断
          if (code === 200) {
            this.$message({ type: "success", message: "关闭成功" });
            this.getcurrentEnv(); // 重新请求账号列表 刷新页面
          }
        })
        // 取消
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消关闭"
          });
        });
    },
    // 文件上传
    async onplouds(i) {
      let api_key = local.get("api_key");
      let env_id = i.uuid;
      let params = { env_id: env_id };
      // console.log(env_id)
      let { code, data } = await poststartEnvUpload({ api_key, params });
      console.log(code);
      if (code === 200) {
        let file_server = data.file_server;
        let fileurl = `http://${file_server}`;
        window.open(fileurl);
      }else{
        return false
      }
    },
    // 生成新镜像
    generate(row) {
      this.dialogFormVisible = true;
      this.nowform = { ...row };
    },
    // 生成新镜像信息
    async addmessage() {
      let { chaptername, imgname } = this.addform;
      let cid = this.nowform.chapter_id;
      let env_id = this.nowform.uuid;
      let params = { nm: chaptername, img: imgname, cid: cid, env_id: env_id };
      let api_key = local.get("api_key");
      // 发送添加课程请求
      let { code } = await postmake({ api_key, params });
      if (code === 200) {
        this.$message({ message: "添加成功", type: "success" });
        this.getcurrentEnv();
      } else {
        return false;
      }
      this.dialogFormVisible = false;
      this.addform = {};
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
    // 查看章节
    lookchapter(i) {
      this.$router.push({
        path: "/index/choicechapter",
        query: {
          tid: i.uuid,
          name: i.name
        }
      });
    },
    // 打开
    open(i) {
      let env_url = i.env_url;
      let urls = `http://${env_url}`;
      window.open(urls);
    }
  },
  created() {
    let role = local.get("u_r");
    this.role = role;
    this.getcourse();
    this.getcurrentEnv();
  }
};
</script>

<style lang="less" scoped>
.choice-class {
  height: 100%;
  .el-card {
    margin-bottom: 10px;
    .el-table {
      td {
        padding: 6px 0 !important;
      }
      .el-button {
        width: 100px;
        margin-left: 30px;
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