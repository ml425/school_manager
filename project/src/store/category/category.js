// import axios from '@/http/axios'
import {get,post} from '@/http/axios'


export default{
    namespaced:true,
    state:{
        categoryInfo:[]
    },
    getters:{},
    mutations:{
        setcategoryInfo(state,data){
            state.categoryInfo = data;
        }
    },
    actions:{
        // 批量删除
        async toDeleteAll(context,params){
            console.log(params);
            let res = await post('/category/batchDelete',params)
        },
        // 删除
        async deleteCategory(context,params){
            let res = await get('/category/deleteById?id='+params)
        },
        // 新增或修改栏目信息
        async saveCategory(context,params){
            let res = await post('/category/saveOrUpdate',params)
        },
        // 查询所有栏目信息
        async loadCategory(context,params){
            let res = await get('/category/findAll')
            context.commit('setcategoryInfo',res.data.data)
            // console.log(res.data.data);
        },
    }
}