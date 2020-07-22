// import axios from '@/http/axios'
import {get,post} from '@/http/axios'


export default{
    namespaced:true,
    state:{
        collegeInfo:{}
    },
    getters:{},
    mutations:{
        setcollegeInfo(state,data){
            state.collegeInfo = data;
        }
    },
    actions:{
        // 删除
        async deleteCollege(context,params){
            let res = await get('/college/deleteById?id='+params)
        },
        // 新增或修改学院
        async saveCollege(context,params){
            let res = await post('/college/saveOrUpdate',params)
        },
        // 查询所有的学院信息
        async loadcollege(context,params){
            let res = await get('/college/pageQuery',params)
            context.commit('setcollegeInfo',res.data.data)
            // console.log(res.data.data);
        },
    }
}