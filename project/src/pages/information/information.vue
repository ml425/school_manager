<template>
    <div class="information">
        <div class="information_button">
            <el-button type="primary" size='small' @click="toAdd">新增资讯</el-button>
            所属栏目
            <el-select v-model="value" placeholder="请选择所属栏目" clearable size='small' >
                <el-option v-for="item in categoryInfo" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            标题
            <el-input placeholder="请输入标题" v-model="input" clearable size="small"></el-input>
		</div>
        <!-- 表格开始 -->
        <el-table
            :data="informationInfo.list"
            style="width: 100%" size='small' empty-text='暂无数据'>
            <el-table-column
                type="index"
                label="序号"
                width="80" align="center">
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题"
                max-width="300" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="发布日期" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                    <span>{{row.publishTime | dateParse}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="category.name"
                label="所属栏目" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="150" align="center">
                <template slot-scope="scope">
                    <el-button @click="look(scope.row)" type="text" size="small">查看</el-button>
                    <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
                    <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表格结束 -->
        <!-- 分页开始 -->
		<div class="grade_page">
            <el-pagination
                v-if="pageHide"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[3, 5, 8, 10]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total">
            </el-pagination>
		</div>
        <!-- 分页结束 -->
        <!-- 查看模态框开始 -->
        <el-dialog :title='title' :visible.sync="dialogVisible2" width="70%">
            <!-- 表单开始 -->
            <el-form :model="form" label-width="100px" class="demo-ruleForm">
                <!-- v-html指令可以让含有HTML标签的数据按照HTML页面的格式显示出来 -->
				<div v-html="form.content">{{form.content}}</div>
            </el-form>
            <!-- 表单结束 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false" size='small'>关 闭</el-button>
            </span>
        </el-dialog>
        <!-- 查看模态框结束 -->
    </div>
</template>
<script>
    import {mapActions,mapState} from "vuex";
    export default {
        data(){
            return{
                page:1,
                pageSize:5,
                total:100,
                input:'',
                value:'',
                pageHide:true,
                dialogVisible:false,
                dialogVisible2:false,
                dialogVisible3:false,
                title:'新增食物信息',
                form:{
                },
                title:'',
                rules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    introduce: [
                        { required: true, message: '请输入介绍', trigger: 'blur' }
                    ]
                },
                fileList: [],
                element:{}
            }
        },
        created(){
            this.load();
        },
        // 监听下拉框select的变化，改变就查询
        watch:{
            value:function(old,news){
                let obj = {
                    page:1,
                    pageSize:this.pageSize,
					categoryId:this.value,
					title:this.input
				}
				if(this.input == ''){
					delete obj.title
				}
                this.loadInformation(obj).then(r=>{
                    this.total = this.informationInfo.total
                })
            },
            input:function(old,news){
                let obj = {
                    page:1,
                    pageSize:this.pageSize,
					title:this.input,
					categoryId:this.value
				}
				if(this.value == ''){
					delete obj.categoryId
				}
                this.loadInformation(obj).then(r=>{
                    this.total = this.informationInfo.total
                })
            },
        },
        computed:{
            ...mapState('information',['informationInfo']),
            ...mapState('category',['categoryInfo'])
        },
        methods:{
            ...mapActions('information',['loadInformation','deleteInformation']),
            ...mapActions('category',['loadCategory']),
            // 查看
            look(row){
                this.dialogVisible2 = true
                this.form.content = row.content
                this.title = row.title
            },
            // 新增
            toAdd(){
                // 路由跳转
                this.$router.push({path:'addInformations'})
            },
            // 修改
            edit(row) {
                // 路由跳转
                this.$router.push({path:'addInformations',query:{row:row}})
            },
            // 删除
            deleteRow(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.deleteInformation(row.id).then(r=>{
                            this.load()
                            this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type:'success'
                            })
                        })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
                
            },
            // 改变pageSize
            handleSizeChange(val){
                this.pageSize = val
                this.load()
            },
            // 分页触发事件
            handleCurrentChange(page){
                this.page = page
                this.load()
            },
            // 加载所有食物控制信息
            load(){
                let obj = {
                    page:this.page,
					pageSize:this.pageSize,
					title:this.input,
					categoryId:this.value
				}
				if(this.value == ''){
					delete obj.categoryId
				}
				if(this.input == ''){
					delete obj.title
				}
                this.loadInformation(obj).then(r=>{
                    this.total = this.informationInfo.total
                    // this.pageHide = this.informationInfo.total<=3?false:true
                })
                // 加载所有食谱分类信息
                this.loadCategory()
            }
        }
    }
</script> 
<style scoped>
    .information{
        padding: 10px;
    }
    /* 头部的按钮的颜色 */
    .information_button .el-button{
        background-color:orange;
        border-color:orange;
    }
    .information_button .el-button:hover{
        background-color:rgb(248, 189, 79);
        border-color:rgb(250, 193, 87);
    }
    /* 头部的按钮、输入框、下拉框之间的距离 */
    .information_button .el-input{
        width: 20%;
    }
    .information_button .el-select{
        margin-right: 20px;
    }
    .information_button .el-button{
        margin-right: 20px;
        margin-bottom: 10px;
    }
    /* 所有的文字按钮 */
    .el-button--text{
        color: orange;
    }
    .el-button--text:hover{
        color: rgb(248, 189, 79);
    }
     /* 模态框上面的按钮 */ 
    .dialog-footer .el-button:hover{
        background-color:rgb(248, 189, 79);
        border-color:rgb(250, 193, 87);
    }
    /* 模态框的标题部分 */
    .el-dialog__header{
        background-color: orange ;
    }
</style>