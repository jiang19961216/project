/**
 * 封装对本地存储的增删改查
 * 2019-11-14 by 小貂蝉
 */
export default {
    get(key) {
        return JSON.parse(window.localStorage.getItem(key));
    },
    set(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value))
    },
    remove(key) {
        window.localStorage.removeItem(key)
    },
    clear() {
        window.localStorage.clear()
    }
}
