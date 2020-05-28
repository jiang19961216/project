<template>
    <div class="journal">
        <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: 700;font-size:18px">日志管理</span>
      </div>
      <div class="journalmsg">
          <!-- 管理查询表单 -->
        <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
          <!-- 操作时间 -->
          <el-form-item label="操作时间">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="searchForm.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item class="btn">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="clear">清空</el-button>
          </el-form-item>
        </el-form>
        <!-- 日志管理信息表格 -->
        <el-table
          height="600px"
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
        >
          <!-- 用户名 -->
          <el-table-column fixed prop="username" label="用户名" width="150"></el-table-column>
          <!-- 操作描述 -->
          <el-table-column prop="msg" label="操作描述" width="180"></el-table-column>
          <!-- 创建时间 -->
          <el-table-column prop="build_time" label="创建时间" width="240"></el-table-column>
          <!-- 请求附带信息 -->
          <el-table-column prop="r_body" label="附带信息"></el-table-column>
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
import { getaudit_log } from "@/api/api";
// 引入本地存储工具函数
import local from '@/utils/local'
import moment from "moment";

export default {
  data() {
    return {
      // 搜索表单
      searchForm: {
        date: []
      },
      tableData: [],
      currentPage: 1, //分页
      total: 0, //条数
      pagesize: 10, //默认每页条数
      formLabelWidth: "100px" // 标签宽度
    };
  },
  methods: {
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
      this.getteach();
    },
    // 获取用户操作日志
    async getaudit_log() {
      // 获取搜索表单数据
      let { date } = this.searchForm;
      // 获取订单参数（结合了查询工具）
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pagesize,
        st:this.searchForm.date[0],
        et:this.searchForm.date[1],
      };
      console.log(params)
      let api_key = local.get("api_key");
      let { data, code } = await getaudit_log({
        api_key,
        params
      });
      this.tableData = data.list;
      this.total = data.total;
    },
     // 查询
    search() {
      this.getaudit_log(); // 调用请求函数
    },
    // 清空
    clear() {
      // 清空表单
      this.searchForm = {
         date: []
      };
      // 再次调用
      this.getaudit_log();
    },
  },
  created() {
    this.getaudit_log();
  }
};
</script>

<style lang="less" scoped>
</style>