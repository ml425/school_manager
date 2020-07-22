// import axios from '@/http/axios'
import {get,post} from '@/http/axios'


export default{
    namespaced:true,
    state:{
        courseInfo:[],
        courseNow:[]
    },
    getters:{},
    mutations:{
        setcourseInfo(state,data){
            state.courseInfo = data;
        },
        setcourseNow(state,data){
            state.courseNow = data;
        }
    },
    actions:{
        // 删除
        async deleteCourseInfo(context,params){
            let res = await get('/course/deleteById?id='+params)
        },
        // 新增或修改食谱分类信息
        async saveCourseInfo(context,params){
            let res = await post('/course/saveOrUpdate',params)
        },
        // 根据id查找
        async loadCourse(context,params){
            let res = await get('/course/query?id='+params)
            context.commit('setcourseNow',res.data.data)
            // console.log(res.data.data);
        },
        // 查询所有的食谱分类信息
        async loadCourseInfo(context,params){
            let res = await get('/course/pageQuery',params)
            context.commit('setcourseInfo',res.data.data)
            // console.log(res.data.data);
        },
    }
}