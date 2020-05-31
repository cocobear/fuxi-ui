import Axios from 'axios'
import message from '../../message'
import router from "../../../router";

let API_PATH = "";
if (process.env.VUE_APP_ENV === "production") {
    API_PATH = window.location.protocol + "//" + window.location.host + "/api/v1";
} else {
    API_PATH = process.env.VUE_APP_BASE_API
}

const request = Axios.create({
    // timeout: 20000,
    baseURL: API_PATH
});

request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['token']  = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

request.interceptors.response.use((response) => {
    if (response.data['status']['code'] === 10401) {
        window.localStorage.removeItem('access_token');
        message.error('TOKEN已过期');
        router.push({path: '/login'}).then(r => {window.console.log(r)});
    }
    return response;
}, (error) => {
    if (error.response) {
        let status_code = error.response.status;
        if (status_code === 401) {
            window.localStorage.removeItem('access_token');
            message.error('TOKEN已过期');
            router.push({path: '/login'}).then(r => {window.console.log(r)});
        } else if (status_code === 500) {
            message.error('服务器出错');
        } else {
            message.error('未知错误');
        }
    } else {
        message.error('网络问题. 请检查你的网络连接');
    }
    return Promise.reject(error.response.data)
});

export default request
