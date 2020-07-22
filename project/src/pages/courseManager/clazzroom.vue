<template>
    <div class="clazzroom">
        <div class="clazzroom_button">
            <el-button type="primary" size='small' @click="toAdd">新增</el-button>
		</div>
        <!-- 表格开始 -->
        <el-table
            :data="ClazzroomInf.list"
            style="width: 100%" size='small' empty-text='暂无数据'>
            <el-table-column
                type="index"
                label="序号"
                width="80" align="center">
            </el-table-column>
            <el-table-column
                prop="name"
                label="教室名称"
                width="120" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="seats"
                label="座椅个数"
                width="120" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="location"
                label="位置" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="180" align="center">
                <template slot-scope="scope">
                    <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
                    <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表格结束 -->
        <!-- 分页开始 -->
		<div class="grade_page">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :hide-on-single-page="false"
                :page-sizes="[3, 5, 8, 10]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total">
            </el-pagination>
		</div>
        <!-- 分页结束 -->
        <!-- 新增修改模态框开始 -->
        <el-dialog :title='title' :visible.sync="dialogVisible" width="50%">
            <!-- {{form}} -->
            <!-- 表单开始 -->
			<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="名称" prop="name" >
                    <el-input v-model="form.name" placeholder="请输入名称" size='small'></el-input>
                </el-form-item>
                <el-form-item label="座椅个数" prop="seats" >
                    <el-input v-model="form.seats" placeholder="请输入教室中的座椅个数" size='small'></el-input>
                </el-form-item>
                <el-form-item label="位置" prop="location" >
                    <el-input v-model="form.location" placeholder="请输入教室所在位置" size='small'></el-input>
                </el-form-item>
            </el-form>
            <!-- 表单结束 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size='small'>取 消</el-button>
                <el-button type="success" @click="toSave" size='small'>确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增修改模态框结束 -->
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
            dialogVisible:false,
            title:'新增教室信息',
            form:{
            },
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                seats: [
                    { required: true, message: '请输入座椅个数', trigger: 'blur' }
                ],
                location: [
                    { required: true, message: '请输入教室所在位置', trigger: 'blur' }
                ]
            },
            fileList: [],
            element:{}
        }
    },
    created(){
        this.load();
    },
    computed:{
    	...mapState('clazzroom',['ClazzroomInf'])
	},
    methods:{
        ...mapActions('clazzroom',['loadclazzroom','saveClazzroom','deleteClazzroom']),
        // 保存年级信息
		toSave(){
			this.dialogVisible = false
			this.saveClazzroom(this.form).then(r=>{
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
                seats:'',
                location:''
            }
		},
        // 修改
        edit(row) {
            this.dialogVisible = true
            this.form.name = row.name
            this.form.seats = row.seats
            this.form.location = row.location
            this.form.id = row.id
            this.title = '修改教室信息'
        },
        // 删除
        deleteRow(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
					this.deleteClazzroom(row.id).then(r=>{
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
				pageSize:this.pageSize
			}
            this.loadclazzroom(obj).then(r=>{
                this.total = this.ClazzroomInf.total
			})
        }
    }
}
</script> 
<style scoped>
    .clazzroom{
        padding: 10px;
    }
    .clazzroom_button .el-button{
        background-color:orange;
        border-color:orange;
        margin-bottom: 10px;
    }
    .clazzroom_button .el-button:hover{
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