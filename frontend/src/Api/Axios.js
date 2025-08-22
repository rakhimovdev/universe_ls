import axios from "axios"

const Api = axios.create({
    baseURL: 'https://universe-backend-898v.onrender.com' // Backend server URL
})
//  https://universe-backend-898v.onrender.com
export default Api