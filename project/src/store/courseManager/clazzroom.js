// import axios from '@/http/axios'
import {get,post} from '@/http/axios'


export default{
    namespaced:true,
    state:{
        ClazzroomInf:{}
    },
    getters:{},
    mutations:{
        setClazzroomInfo(state,data){
            state.ClazzroomInf = data;
        }
    },
    actions:{
        // 删除
        async deleteClazzroom(context,params){
            let res = await get('/clazzroom/deleteById?id='+params)
        },
        // 新增或修改食物控制信息
        async saveClazzroom(context,params){
            console.log(params)
            let res = await post('/clazzroom/saveOrUpdate',params)
        },
        // 查询所有的食物控制信息
        async loadclazzroom(context,params){
            let res = await get('/clazzroom/pageQuery',params)
            context.commit('setClazzroomInfo',res.data.data)
            // console.log(res.data.data);
        },
    }
}