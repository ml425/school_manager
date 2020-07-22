<template>
    <div class="addInformation">
        <el-button @click="returnRecipe" type="text" size="small">返回</el-button>
        <!-- 表单开始 -->
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item label="所属栏目" prop="categoryId">
                <el-select v-model="form.categoryId" placeholder="请选择父栏目" size='small'>
                    <el-option v-for="item in categoryInfo" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title" >
                <el-input v-model="form.title" placeholder="请输入名称" size='small'></el-input>
            </el-form-item>
            <el-form-item label="正文" prop="title" >
                <mavon-editor  v-model="form.content" @save='saveContent'/>
            </el-form-item>
        </el-form>
        <!-- 表单结束 -->
        <el-button type="success" @click="toSave" size='small'>发 布</el-button>
    </div>
</template>
<script>
import {mapActions,mapState} from "vuex";
export default {
    data(){
        return{
            form:{},
            rules: {
                title: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, message: '请输入介绍', trigger: 'blur' }
                ]
            },
        }
    },
    created(){
        // 加载所有食谱分类信息
        this.loadCategory()
        if(this.$route.query.row){
            this.form = this.$route.query.row
            // this.form = {
            //     categoryId:this.$route.query.row.categoryId,
            //     title:this.$route.query.row.title,
            //     content:this.$route.query.row.content,
            //     id:this.$route.query.row.id,
            //     publishTime:this.$route.query.row.publishTime
            // }
        }
    },
    computed:{
    	...mapState('category',['categoryInfo'])
	},
    methods:{
        ...mapActions('category',['loadCategory']),
        ...mapActions('information',['addInformation']),
        // 监听富文本编辑器的保存按钮
        saveContent(value,render){
            this.form.content = render;
        },
        // 发布保存食谱
		toSave(){
            // console.log(this.form);
			this.addInformation(this.form).then(r=>{
				this.$router.push({path:'information'})
				let messageInfo = ''
				if(this.form.id){
					messageInfo = '修改'
				}else{
					messageInfo = '新增'
				}
				this.$notify({
					title: '成功',
					message: messageInfo+'成功',
					type:'success'
				})
			})
        },
        // 返回食谱管理
        returnRecipe(){
            this.$router.push({path:'information'})
        }
    }
}
</script>
<style scoped>
    .addInformation{
        padding: 10px;
    }
    /* 所有的文字按钮 */
    .el-button--text{
        color: orange;
    }
    .el-button--text:hover{
        color: rgb(248, 189, 79);
    }
    /* 成功的按钮 */
    .el-button--success{
        background: orange;
        border-color: orange 
    }
    .el-button--success:hover{
        background-color:rgb(248, 189, 79);
        border-color:rgb(250, 193, 87);
    }
    /* 下拉框的宽度 */
    .el-select{
        width: 100%;
    }
</style>