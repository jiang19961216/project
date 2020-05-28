<template>
  <div class="choice-chapter">
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
    <el-card class="box-card">
      <div slot="header" class="clearfix">
         <el-page-header style="font-weight: 700;font-size:18px" @back="goBack" content="选择章节"></el-page-header>  
      </div>
      <!-- <div style="font-weight: 700;">{{this.name}}</div> -->
      <div class="studentmsg">
        <!-- 订单管理查询表单 -->
        <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
          <!-- 章节名称 -->
          <el-form-item label="章节名称">
            <el-input v-model="searchForm.chaptername" placeholder="章节名称"></el-input>
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
          <!-- 章节名称 -->
          <el-table-column prop="name" label="章节名称" width="360"></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="lookchapter(scope.row)">启动</el-button>
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
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口请求函数
import {
  getschapterserch,
  poststartEnv,
  getcurrentEnv,
  postcloseEnv,
  postmake,
  poststartEnvUpload
} from "@/api/api";
// 引入本地存储工具函数
import local from "@/utils/local";
import myencode from "@/utils/pwd";
import { release } from 'os';

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
      tid: "",
      urls: "",
      NowtableData: [],
      role: ""
    };
  },
  methods: {
    // 获取章节详情
    async getchapter() {
      this.tid = this.$router.history.current.query.tid;
      this.name = this.$router.history.current.query.name;
      // 获取搜索表单数据
      let { name } = this.searchForm;
      // 获取参数（结合了查询工具）
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        cid: this.tid,
        nm: name,
        p: this.currentPage
      };
      let api_key = local.get("api_key");
      let { data } = await getschapterserch({
        params,
        api_key
      });
      // // 赋值渲染
      this.tableData = data.list;
      // console.log(this.tableData)
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
    // 生成新镜像
    generate(row) {
      this.dialogFormVisible = true;
      this.nowform = { ...row };
    },
    // 生成新镜像信息
    async addmessage() {
      console.log(this.nowform);
      let { chaptername, imgname } = this.addform;
      let cid = this.nowform.chapter_id;
      let env_id = this.nowform.uuid;
      let params = { nm: chaptername, img: imgname, cid: cid, env_id: env_id };
      console.log(params);
      let api_key = local.get("api_key");
      // 发送添加课程请求
      let { code } = await postmake({ api_key, params });
      console.log(code);
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
      this.getchapter();
    },
    // 查询
    search() {
      this.getchapter(); // 调用请求函数
    },
    // 清空
    clear() {
      // 清空表单
      this.searchForm = {
        name: ""
      };
      // 再次调用
      this.getchapter();
    },
    // 跳转到增加课程信息
    add() {
      this.dialogFormVisible = true;
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    //  // 查看文件
    async lookchapter(i) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let ctid = i.uuid;
      let api_key = local.get("api_key");
      let { code, data } = await poststartEnv({
        ctid,
        api_key
      });
      if (code === 200) {
        loading.close();
        let { env_url } = data;
        let urls = `http://${env_url}`;
        window.open(urls);
        this.getcurrentEnv();
      } else if (code === 900) {
        loading.close();
        this.$message.error({
          message: "你有正在运行的虚拟环境，请先关闭环境"
        });
      } else {
        return false;
      }
    },
    // 打开
    open(i) {
      let env_url = i.env_url;
      let urls = `http://${env_url}`;
      window.open(urls);
    }
  },
  created() {
    //在模板编译进路由前调用created方法，触发接收函数
    let role = local.get("u_r");
    this.role = role;
    this.getchapter();
    this.getcurrentEnv();
  }
};
</script>

<style lang="less" scoped>
.choice-chapter {
  height: 100%;
  .el-card {
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