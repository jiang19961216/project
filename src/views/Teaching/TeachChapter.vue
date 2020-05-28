<template>
  <div class="chapter-management">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
         <el-page-header style="font-weight: 700;font-size:18px" @back="goBack" content="下载章节"></el-page-header>  
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
                <el-button size="mini" type="danger" @click="lookchapter(scope.row)">查看文件</el-button>
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
import { getschapterserch } from "@/api/api";
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
        imgname: "",
        chaptername: ""
      },
      // 修改
      changgeform: {
        imgname: "",
        chaptername: ""
      },
      formLabelWidth: "100px", // 标签宽度
      tid: ""
      // name:''
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
    lookchapter(i) {
      console.log(i);
      this.$router.push({
        path: "/teachclass/teachingfile",
        query: {
          cid: this.tid,
          chid: i.uuid
        }
      });
    }
  },
  created() {
    //在模板编译进路由前调用created方法，触发接收函数
    this.getchapter();
  }
};
</script>

<style lang="less" scoped>
.chapter-management {
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