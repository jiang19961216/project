import axios from "axios";
// 引入工具函数
import req from '@/utils/req'



// 获取登录api详情数据
export const getLogin = () => axios.get('/server/login')

export const postLogin = ({ un, pw, api_key }) => axios.post(`/server/login?un=${un}&pw=${pw}&api_key=${api_key}`)

// 登出
export const postLogout = ({ api_key, params }) => req.post(`/server/logout?api_key=${api_key}`, params)

// 修改密码
export const postchangepwd = ({ api_key, params }) => req.post(`/server/changePassword?api_key=${api_key}`, params)

// 重置密码
export const postresetpwd = ({ api_key, params }) => req.post(`/server/resetPassword?api_key=${api_key}`, params)

// 教师信息
// 获取教师api数据
export const getteachserch = ({ api_key, params }) => req.get(`server/teacher/search?api_key=${api_key}`, params)
// 获取增加教师api数据
export const postteachadd = ({ api_key, params }) => req.post(`server/teacher/add?api_key=${api_key}`, params)
// 获取删除教师api数据
export const postteachdel = ({ api_key, params }) => req.post(`server/teacher/del?api_key=${api_key}`, params)
// 获取修改教师api数据
export const postteachmodify = ({ api_key, params }) => req.post(`server/teacher/modify?api_key=${api_key}`, params)

// 学生信息
// 获取学生api数据
export const getstudentserch = ({ api_key, params }) => req.get(`server/student/search?api_key=${api_key}`, params)
// 获取增加学生api数据
export const poststudentadd = ({ api_key, params }) => req.post(`server/student/add?api_key=${api_key}`, params)
// 获取删除学生api数据
export const poststudentdel = ({ api_key, params }) => req.post(`server/student/del?api_key=${api_key}`, params)
// 获取修改学生api数据
export const poststudentmodify = ({ api_key, params }) => req.post(`server/student/modify?api_key=${api_key}`, params)
// 导入学生信息模块
export const poststudentimport = ({ api_key, params }) => req.post(`server/student/import?api_key=${api_key}`,params)

// 课程信息
// 获取课程api数据
export const getscourseserch = ({ api_key, params }) => req.get(`server/course/search?api_key=${api_key}`, params)
// 获取增加课程api数据
export const postcourseadd = ({ api_key, params }) => req.post(`server/course/add?api_key=${api_key}`, params)
// 获取删除课程api数据
export const postcoursedel = ({ api_key, params }) => req.post(`server/course/del?api_key=${api_key}`, params)
// 获取修改课程api数据
export const postcoursemodify = ({ api_key, params }) => req.post(`server/course/modify?api_key=${api_key}`, params)

// 章节信息
// 获取章节api数据
export const getschapterserch = ({ api_key, params }) => req.get(`server/chapter/search?api_key=${api_key}`, params)
// 获取增加章节api数据
export const postchapteradd = ({ api_key, params }) => req.post(`server/chapter/add?api_key=${api_key}`, params)
// 获取删除章节api数据
export const postchapterdel = ({ api_key, params }) => req.post(`server/chapter/del?api_key=${api_key}`, params)
// 获取修改章节api数据
export const postchaptermodify = ({ api_key, params }) => req.post(`server/chapter/modify?api_key=${api_key}`, params)

// 获取文件
export const getdownload = ({ api_key, params }) => req.get(`server/download?api_key=${api_key}`, params)

// 上传文件
// export const postupload = ({ api_key, params }) => req.get(`sserver/upload?api_key=${api_key}`, params)

// 删除文件
export const postdownload = ({ api_key, fid,name }) => req.post(`server/download?fid=${fid}&name=${name}&api_key=${api_key}`)

// 远程桌面
export const poststartEnv = ({ api_key, ctid }) => req.post(`server/startEnv?ctid=${ctid}&api_key=${api_key}`)

// 获取当前正在运行的镜像
export const getcurrentEnv = ({ api_key, params }) => req.get(`server/currentEnv?api_key=${api_key}`, params)

// 关闭当前正在运行的镜像
export const postcloseEnv = ({ api_key, params }) => req.post(`server/closeEnv?api_key=${api_key}`, params)

// 生成新的镜像
export const postmake = ({ api_key, params }) => req.post(`server/chapter/make?api_key=${api_key}`, params)

// 文件上传
export const poststartEnvUpload = ({ api_key, params }) => req.post(`server/startEnvUpload?api_key=${api_key}`,params)
// export const poststartEnvUpload = ({ api_key, env_id }) => req.post(`server/startEnvUpload?api_key=${api_key}&env_id=${env_id}`)

// 获取用户操作日志
export const getaudit_log = ({ api_key, params }) => req.get(`server/audit_log?api_key=${api_key}`, params)