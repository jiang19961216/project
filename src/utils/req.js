import axios from 'axios'
import qs from 'qs'
// axios.defaults.baseURL = "http://172.16.13.223"
axios.defaults.baseURL = "http://172.16.13.152"
// get和post请求
export default {
    get(url, params = {}) {
      return new Promise((resolve, reject) => {
        axios.get(url, { params })
          .then(response => {
            if (response) {
              resolve(response.data) // 成功
            }
          })
          .catch(err => {
            reject(err) // 失败
          })
      })
    },
    post(url, params = {}) {
      return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(params))
          .then(response => {
            if (response) {
              resolve(response.data) // 成功
            }
          })
          .catch(err => {
            reject(err) // 失败
          })
      })
    }
  }
  
  