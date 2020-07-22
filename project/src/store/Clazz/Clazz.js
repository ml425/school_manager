// import axios from '@/http/axios'
import {get,post} from '@/http/axios'


export default{
    namespaced:true,
    state:{
        clazzInfo:[]
    },
    getters:{},
    mutations:{
        setclazzInfo(state,data){
            state.clazzInfo = data;
        }
    },
    actions:{
        // 排课
        async toSaveCourse(context,params){
            let res = await post('/clazz/paike',params)
        },
        // 删除
        async deleteClazz(context,params){
            let res = await get('/clazz/deleteById?id='+params)
        },
        // 新增或修改食谱分类信息
        async saveClazz(context,params){
            let res = await post('/clazz/saveOrUpdate',params)
        },
        // 查询所有的食谱分类信息
        async loadClazz(context,params){
            let res = await get('/clazz/pageQuery',params)
            context.commit('setclazzInfo',res.data.data)
            // console.log(res.data.data);
        },
    }
}