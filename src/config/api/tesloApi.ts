import { API_URL, API_URL_ANDROID, API_URL_IOS, STAGE } from "@env";
import axios from "axios";
import { Platform } from "react-native";
import { StorageAdapter } from "../adapters/async-storage";


export const BASE_URL = (STAGE === 'production') 
? API_URL 
: Platform.OS === 'ios' 
? API_URL_IOS 
: API_URL_ANDROID


const tesloApi = axios.create({
    baseURL : BASE_URL,
    headers:{
        'Content-Type': 'application/json'
    }
})

//TODO: interceptors
tesloApi.interceptors.request.use(
    async (config) => {
        const token = await StorageAdapter.getItem('token')

        if(token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        
        return config
    }
)

//de esta forma es seguro que se va a exportar despues de haber
//accedido a los interceptores
export {
    tesloApi
}