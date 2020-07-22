<template>
    <div class="college">
        <div class="college_button">
            <el-button type="primary" size='small' @click="toAdd">添加学院</el-button>
            名称
            <el-input placeholder="请输入学院名称" v-model="input" clearable size="small"></el-input>
		</div>
        <!-- 表格开始 -->
        <el-table
            :data="collegeInfo.list"
            style="width: 100%" size='small' empty-text='暂无数据'>
            <el-table-column
                type="index"
                label="编号"
                width="80" align="center">
            </el-table-column>
            <el-table-column
                prop="name"
                label="学院名称"
                max-width="300" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="description"
                label="学院介绍" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="150" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
                    <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表格结束 -->
        <!-- 分页开始 -->
		<div class="grade_page">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[3, 5, 8, 10]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total">
            </el-pagination>
		</div>
        <!-- 分页结束 -->
        <!-- 模态框开始 -->
        <el-dialog :title='title' :visible.sync="dialogVisible" width="50%">
            <!-- {{form}} -->
            <!-- 表单开始 -->
			<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="学院名称" prop="name" >
                    <el-input v-model="form.name" placeholder="请输入学院名称" size='small'></el-input>
                </el-form-item>
                <el-form-item label="学院介绍" prop="description">
                    <el-input type="textarea" v-model="form.description" placeholder="请对此学院进行介绍" size='small'></el-input>
                </el-form-item>
            </el-form>
            <!-- 表单结束 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size='small'>取 消</el-button>
                <el-button type="success" @click="toSave" size='small'>确 定</el-button>
            </span>
        </el-dialog>
        <!-- 模态框结束 -->
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
                dialogVisible:false,
                title:'添加学院',
                form:{
                },
                title:'',
                rules: {
                    name: [
                        { required: true, message: '请输入学院名称', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入学院介绍', trigger: 'blur' }
                    ]
                },
            }
        },
        created(){
            this.load();
        },
        // 监听输入框的变化，改变就查询
        watch:{
            input:function(old,news){
                let obj = {
                    page:1,
                    pageSize:this.pageSize,
					name:this.input,
				}
                this.loadcollege(obj).then(r=>{
                    this.total = this.collegeInfo.total
                })
            },
        },
        computed:{
            ...mapState('college',['collegeInfo']),
        },
        methods:{
            ...mapActions('college',['loadcollege','saveCollege','deleteCollege']),
            // 保存学院信息
            toSave(){
                this.dialogVisible = false
                // console.log(this.form);
                this.saveCollege(this.form).then(r=>{
                    this.load()
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
            // 新增
            toAdd(){
                this.dialogVisible = true
                this.form={
                    name:'',
                    description:'',
                }
            },
            // 修改
            edit(row) {
                this.dialogVisible = true
                this.form.name = row.name
                this.form.description = row.description
                this.form.id = row.id
                this.title = '修改学院信息'
            },
            // 删除
            deleteRow(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.deleteCollege(row.id).then(r=>{
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
            // 加载所有学院信息
            load(){
                let obj = {
                    page:this.page,
					pageSize:this.pageSize,
					name:this.input
				}
				if(this.input == ''){
					delete obj.name
				}
                this.loadcollege(obj).then(r=>{
                    this.total = this.collegeInfo.total
                })
            }
        }
    }
</script> 
<style scoped>
    .college{
        padding: 10px;
    }
    /* 头部的按钮的颜色 */
    .college_button .el-button{
        background-color:orange;
        border-color:orange;
    }
    .college_button .el-button:hover{
        background-color:rgb(248, 189, 79);
        border-color:rgb(250, 193, 87);
    }
    /* 头部的按钮、输入框、下拉框之间的距离 */
    .college_button .el-input{
        width: 20%;
    }
    .college_button .el-select{
        margin-right: 20px;
    }
    .college_button .el-button{
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
     .dialog-footer .el-button:last-child{
         background-color: orange;
         border-color:orange;
     }
    .dialog-footer .el-button:last-child:hover{
        background-color:rgb(248, 189, 79);
        border-color:rgb(250, 193, 87);
    }
    .dialog-footer .el-button:first-child:hover{
         background-color:rgb(250, 224, 178);
        border-color:rgb(247, 217, 163);
        color: orange;
     }
    /* 模态框的标题部分 */
    .el-dialog__header{
        background-color: orange ;
    }
</style>