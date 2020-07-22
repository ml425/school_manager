<template>
    <div class="category">
        <div class="category_button">
            <el-button type="primary" size='small' @click="toAdd">新增</el-button>
            <el-button type="primary" size='small' @click="deleteAll">批量删除</el-button>
		</div>
        <!-- 表格开始 -->
        <el-table
            :data="categoryInfo" height="500px"  ref="multipleTable"
            style="width: 100%" size='small' empty-text='暂无数据' @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                type="index"
                label="序号"
                width="80" align="center">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                width="180" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="no"
                label="编号"
                width="180" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="description"
                label="栏目描述" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100" align="center">
                <template slot-scope="scope">
                    <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
                    <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表格结束 -->
        <!-- 模态框开始 -->
        <el-dialog :title='title' :visible.sync="dialogVisible" width="50%">
            <!-- {{form}} -->
            <!-- 表单开始 -->
			<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="栏目名称" prop="name" >
                    <el-input v-model="form.name" placeholder="请输入栏目名称" size='small'></el-input>
                </el-form-item>
                <el-form-item label="父栏目">
                    <el-select v-model="form.parentId" placeholder="请选择父栏目" size='small'>
                        <el-option v-for="item in categoryInfo" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="序号">
                    <el-input v-model="form.no" placeholder="请输入序号" size='small'></el-input>
                </el-form-item>
                <el-form-item label="栏目介绍">
                    <el-input type="textarea" v-model="form.description" size='small'></el-input>
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
                input:'',
                dialogVisible:false,
                title:'新增栏目',
                form:{
                },
                rules: {
                    name: [
                        { required: true, message: '请输入年级名称', trigger: 'blur' }
                    ]
                },
                multipleSelection: []
            }
        },
        created(){
            this.load();
        },
        computed:{
            ...mapState('category',['categoryInfo'])
        },
        methods:{
            ...mapActions('category',['loadCategory','saveCategory','deleteCategory','toDeleteAll']),
            // 批量删除
            deleteAll(){
                let ids = this.multipleSelection
                if(ids != ''){
                    this.$confirm('此操作将永久删除该栏目, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.toDeleteAll({ids}).then((response)=>{
                                if(this.message.status == 200){
                                    this.load()
                                    this.$notify({
                                        title: '成功',
                                        message:this.message.message,
                                        type:'success'
                                    })
                                }else{
                                    this.$notify.error({
                                        title: '错误',
                                        message: this.message.message
                                    });
                                }
                            })
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                }else{
                    this.$message({
                        type: 'info',
                        message: '请选择要删除的栏目'
                    }); 
                }
            },
            // 改变多选框时触发
            handleSelectionChange(val) {
                // multipleSelection是由选中的对象的id组成的数组
                this.multipleSelection = val.map((item,index)=>{
                    return item.id;
                });
            },
            // 保存年级信息
            toSave(){
                this.dialogVisible = false
                this.saveCategory(this.form).then(r=>{
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
                    no:'',
                    parentId:'',
                }
            },
            // 修改
            edit(row) {
                this.dialogVisible = true
                this.form.name = row.name
                this.form.description = row.description
                this.form.no = row.no
                this.form.parentId = row.parentId
                this.form.id = row.id
                this.title = '修改栏目'
            },
            // 删除
            deleteRow(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.deleteCategory(row.id).then(r=>{
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
            // 加载所有食谱分类信息
            load(){
                this.loadCategory()
            }
        }
    }
</script> 
<style scoped>
    .category{
        padding: 10px;
    }
    .category_button .el-button{
        background-color:orange;
        border-color:orange;
        margin-bottom: 10px;
    }
    .category_button .el-button:hover{
        background-color:rgb(248, 189, 79);
        border-color:rgb(250, 193, 87);
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
    /* 模态框上面的下拉框 */
    .el-dialog .el-select{
        width: 100%;
    }
     /* 模态框上面的按钮 */ 
    .dialog-footer .el-button:first-child:hover{
        color: orange;
        background-color:rgb(250, 227, 185);
        border-color:rgb(248, 226, 186);
    }
    .dialog-footer .el-button:nth-child(2):hover{
        background-color:rgb(248, 189, 79);
        border-color:rgb(250, 193, 87);
    }
    /* 模态框的标题部分 */
    .el-dialog__header{
        background: orange;
    }
</style>