// import axios from '@/http/axios'
import {get,post} from '@/http/axios'

export default{
    namespaced:true,
    state:{
        informationInfo:{},
        elementInfo:{}
    },
    getters:{},
    mutations:{
        setInformationInfo(state,data){
            state.informationInfo = data;
        },
        setelementInfo(state,data){
            state.elementInfo = data;
        }
    },
    actions:{
        // 新增或修改资讯
        async addInformation(context,params){
            let res = await post('/article/saveOrUpdate',params)
        },
        // 删除
        async deleteInformation(context,params){
            let res = await get('/article/deleteById?id='+params)
        },
        // 查询所有的资讯信息
        async loadInformation(context,params){
            let res = await get('/article/pageQuery',params)
            context.commit('setInformationInfo',res.data.data)
            // console.log(res.data.data);
        },
    }
}