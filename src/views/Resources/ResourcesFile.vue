<template>
  <div class="chapter-management">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
         <el-page-header style="font-weight: 700;font-size:18px" @back="goBack" content="上传文件"></el-page-header>  
      </div>
      <!-- <div style="font-weight: 700;">{{this.name}}</div> -->
      <div class="studentmsg">
        <!-- 订单管理查询表单 -->
        <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
          <!-- 文件名称 -->
          <el-form-item label="文件名称">
            <el-input v-model="searchForm.filename" placeholder="文件名称"></el-input>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item class="stubtn">
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <el-upload
          class="upload-demo"
          ref="upload"
          action
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="success" >选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="danger" @click="submitBtn">上传到服务器</el-button>
        </el-upload>
        <!-- 信息表格 -->
        <el-table
          height="600px"
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
        >
           <!-- 文件名称 -->
          <el-table-column prop="filename" label="文件名称" width="300"></el-table-column>
          <!-- 创建时间 -->
          <el-table-column prop="uploadtime" label="创建时间" width="240"></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除文件</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="block" style="margin-top:20px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口请求函数
import { getdownload, postupload, postdownload } from "@/api/api";
// 引入本地存储工具函数
import local from "@/utils/local";
import myencode from "@/utils/pwd";
import axios from "axios";
import qs from "qs";
import { constants } from "zlib";
export default {
  data() {
    return {
      // 搜索表单
      searchForm: {
        filename: ""
      },
      tableData: [],
      currentPage: 1, //分页
      total: 0, //条数
      pagesize: 10, //默认每页条数
      dialogFormVisible: false, // 模态框显示和隐藏
      dialogFormchange: false,
      // 模态框
      formLabelWidth: "100px", // 标签宽度
      tid: "",
      // name:''
      fileList: [],
      file: ""
    };
  },
  methods: {
    // 获取章文件详情
    async getdownload() {
      this.cid = this.$router.history.current.query.cid;
      this.chid = this.$router.history.current.query.chid;
      // 获取搜索表单数据
      let { name } = this.searchForm;
      // 获取参数（结合了查询工具）
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        cid: this.cid,
        chid: this.chid,
        p: this.currentPage
      };
      let api_key = local.get("api_key");
      console.log(api_key);
      let { data } = await getdownload({
        params,
        api_key
      });
      console.log(data);
      // 赋值渲染
      this.tableData = data.list;
      this.total = data.total;
    },
    // 上传
    async submitBtn() {
      let formData = new FormData();
      let file = this.$refs.upload.uploadFiles[0].raw;
      // console.log()
      console.log(file);
      if (file) {
        let cid = this.$router.history.current.query.cid;
        let chid = this.$router.history.current.query.chid;
        let api_key = local.get("api_key");
        formData.append("fn", file);
        formData.append("cid", cid);
        formData.append("chid", chid);
        formData.append("api_key", api_key);
        await axios({
          url: "/server/upload",
          data: formData,
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(res => {
          let { code } = res.data;
          if (code === 200) {
            this.$message({ type: "success", message: "上传成功" });
            this.getdownload();
          } else {
            this.$message({ type: "error", message: "请选择正确格式的文件" });
          }
        }); // 发送请求
      } else {
        this.$message({ type: "error", message: "请选择文件" });
      }
    },
    // 删除文件
    handleDelete(index) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let api_key = local.get("api_key");
          let fid = this.tableData[index].uuid;
          let name = this.tableData[index].filename
          // let params = { ctid: ctid };
          // 确定
          console.log(api_key);
          let { code } = await postdownload({ api_key, fid ,name});
          console.log(code);
          // // 判断
          if (code === 200) {
            this.$message({ type: "success", message: "删除成功" });
            this.getdownload(); // 重新请求账号列表 刷新页面

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
      this.getdownload();
    },
    // 查询
    search() {
      this.getdownload(); // 调用请求函数
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    //在模板编译进路由前调用created方法，触发接收函数
    this.getdownload();
  }
};
</script>

<style lang="less" scoped>
.chapter-management {
  height: 100%;
  .el-card {
    .el-table {
      margin-top: 10px;
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