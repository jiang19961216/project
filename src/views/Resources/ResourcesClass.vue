<template>
  <div class="course-management">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: 700;font-size:18px">查看课程</span>
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
          <el-table-column fixed prop="name" label="课程名称" width="300"></el-table-column>
           <!-- 课程描述 -->
          <el-table-column prop="describe" label="课程描述" ></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" class="oprentain" width="200">
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
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口请求函数
import {
  getscourseserch,
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
        p:this.currentPage 
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
        name: "",
      };
      // 再次调用
      this.getcourse();
    },
    // 查看章节
    lookchapter(i) {
      console.log(i)
      this.$router.push({
        path: "/resourcesclass/resourceschapter",
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
        margin-left: 50px
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