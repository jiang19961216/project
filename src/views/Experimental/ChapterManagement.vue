<template>
  <div class="chapter-management">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
         <el-page-header style="font-weight: 700;font-size:18px" @back="goBack" content="管理章节"></el-page-header>  
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
            <el-button type="primary" @click="add">添加章节</el-button>
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
          <el-table-column prop="name" label="章节名称" width="200"></el-table-column>
          <!-- 镜像名称 -->
          <el-table-column prop="image" label="镜像名称" width="300"></el-table-column>
          <!-- 创建时间 -->
          <el-table-column prop="build_time" label="创建时间" width="200"></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
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
        <!-- 增加章节模态框 -->
        <el-dialog width="500px" title="增加章节" :visible.sync="dialogFormVisible" class="dialog">
          <el-form style="width: 500px;" :model="addform" :inline="true">
            <!-- 章节名称 -->
            <el-form-item label="章节名称" :label-width="formLabelWidth">
              <el-input v-model="addform.name" auto-complete="off"></el-input>
            </el-form-item>
            <!-- 镜像名称 -->
            <el-form-item label="镜像名称" :label-width="formLabelWidth">
              <el-input v-model="addform.image" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <!-- 尾部 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addmessage">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 修改章节模态框 -->
         <el-dialog width="550px" title="修改章节" :visible.sync="dialogFormchange" class="dialog">
          <el-form style="width: 500px;" :model="changeform" :inline="true">
            <!-- 章节名称 -->
            <el-form-item label="章节名称" :label-width="formLabelWidth">
              <el-input v-model="changeform.name" auto-complete="off"></el-input>
            </el-form-item>
             <!-- 镜像名称 -->
            <el-form-item label="镜像名称" :label-width="formLabelWidth">
              <el-input v-model="changeform.image" auto-complete="off" :disabled="true"></el-input>
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
  getschapterserch,
  postchapteradd,
  postchapterdel,
  postchaptermodify,
  getscourseserch
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
        image: "",
        name: ""
      },
      // 修改
      changeform: {
        image: "",
        name: ""
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
        p:this.currentPage
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
        name: "",
      };
      // 再次调用
      this.getchapter();
    },
    // 跳转到增加课程信息
    add() {
      this.dialogFormVisible = true;
    },
    // 增加章节信息
    async addmessage() {
      let { name, image } = this.addform;
      let params = { nm: name, img: image, cid: this.tid };
      console.log(params);
      let api_key = local.get("api_key");
      // 发送添加课程请求
      let { code } = await postchapteradd({ api_key, params });
      console.log(code);
      if (code === 200) {
        this.$message({ message: "添加成功", type: "success" });
        this.getchapter();
      } else {
        return false;
      }
      this.dialogFormVisible = false;
      this.addform = {}
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
          let ctid = this.tableData[index].uuid;
          let name = this.tableData[index].name
          let params = { ctid: ctid,name:name };
          // // 确定
          let { code } = await postchapterdel({ api_key, params });
          console.log(code);
          // // 判断
          if (code === 200) {
            this.$message({ type: "success", message: "删除成功" });
            this.getchapter(); // 重新请求账号列表 刷新页面
          }else if (code === 500) {
            this.$message({ type: "error", message: "请先删除章节的内容" });
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
      this.dialogFormchange = true;
      this.changeform = { ...row }; // 赋值一份这个对象
    },
    // 返回
    goBack(){
        this.$router.go(-1)
    },
    // 修改
    async changemessage() {
      let api_key = local.get("api_key");
      this.dialogFormVisible = false; // 关闭模态框
      let { image, name,uuid } = this.changeform;
      let params = { ctid: uuid, nm: name, img: image, };
      console.log(params)
      let { code } = await postchaptermodify({ api_key, params });
      console.log(code)
      if (code === 200) {
        this.$message({ type: "success", message: "修改成功" });
        this.getchapter(); // 刷新列表
      }
      this.dialogFormchange = false;
    },
  },
  created() {
    //在模板编译进路由前调用created方法，触发接收函数
    this.getchapter();
    // this.getcourse();
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