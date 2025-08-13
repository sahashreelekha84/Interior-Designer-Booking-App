
import axios from 'axios'
import { baseurl } from '../api';


const axiosInstance = axios.create({
 baseURL:baseurl,
})
axiosInstance.interceptors.request.use(
    async function(config){
        const token=sessionStorage.getItem("token")||localStorage.getItem("token")
        console.log("token",token);
        if(token){
            config.headers["x-access-token"]=token
            // config.headers.Authorization=token
            // config.headers.Authorization=`Bearer ${token}`

        }
        return config
        
    },
    function(err){
        return Promise.reject(err) 
    }
)
// export const fetchprofile=(media)=>{
//     return baseUrl+`uploads/user/profile_pic/${media}`
// }
// export const fetchprofile1=(media)=>{
//     return baseUrl+`uploads/user/image/${media}`
// }
export default axiosInstance
// https://wtsacademy.dedicateddevelopers.us/uploads/user/image/image_1734771650395_favicon.ico
