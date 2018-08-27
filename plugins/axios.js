import axios from 'axios'
// console.log(process.env.baseUrl)
const instance = axios.create({
    baseURL: process.env.baseUrl,
    timeout: 5000
})

export default instance