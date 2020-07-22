// import axios from '@/http/axios'
import {get,post} from '@/http/axios'


export default{
    namespaced:true,
    state:{
        
    },
    getters:{},
    mutations:{
        
    },
    actions:{
        // 确定修改
        async tomodification(context,params){
            let res = await post('/baseUser/saveOrUpdate',params)
        },
    }
}