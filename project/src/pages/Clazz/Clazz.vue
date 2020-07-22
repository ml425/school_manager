<template>
    <div class="Clazz">
        <div class="Clazz_button">
            <el-button type="primary" size='small' @click="toAdd">新增班级</el-button>
		</div>
        <!-- 表格开始 -->
        <el-table
            :data="clazzInfo.list"
            style="width: 100%" size='small' empty-text='暂无数据'>
            <el-table-column
                type="index"
                label="序号"
                width="80" align="center">
            </el-table-column>
            <el-table-column
                prop="name"
                label="班级名称"
                max-width="300" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="college.name"
                label="所属学院"
                max-width="300" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="paikeStatus"
                label="是否排课" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="charge.realname"
                label="班主任" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="charge.telephone"
                label="班主任联系方式" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="150" align="center">
                <template slot-scope="scope">
                    <el-button @click="addCourse(scope.row)" type="text" size="small">排课</el-button>
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
            <!-- 表单开始 -->
			<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="班级名称" prop="name" >
                    <el-input v-model="form.name" placeholder="请输入班级名称" size='small'></el-input>
                </el-form-item>
                <el-form-item label="所属学院" prop="collegeId" >
                    <el-select v-model="form.collegeId" placeholder="请选择所属学院" size='small'>
                        <el-option v-for="item in collegeInfo.list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否排课" prop="paikeStatus">
                    <el-input v-model="form.paikeStatus" size='small'></el-input>
                </el-form-item>
                <el-form-item label="班主任" prop="chargeId" >
                    <el-select v-model="form.chargeId" placeholder="请选择班主任" size='small'>
                        <el-option v-for="item in clazzInfo.list" :key="item.id" :label="item.charge?item.charge.realname:''" :value="item.charge?item.charge.id:''"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- 表单结束 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size='small'>取 消</el-button>
                <el-button type="success" @click="toSave" size='small'>确 定</el-button>
            </span>
        </el-dialog>
        <!-- 模态框结束 -->
        <!-- 排课模态框开始 -->
        <el-dialog title='排课' :visible.sync="dialogVisible2" width="50%">
            <!-- 表单开始 -->
			<el-form :model="courseForm" :rules="rules" ref="courseForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="班级编号" prop="clazzId" >
                    <el-input v-model="courseForm.clazzId" placeholder="请输入名称" size='small' disabled></el-input>
                </el-form-item>
                <el-form-item label="课程名称" prop="courseId">
                    <el-select v-model="courseForm.courseId" placeholder="请选择课程" size='small'>
                        <el-option v-for="item in courseInfo.list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程日期" prop="courseDay" >
                    <el-select v-model="courseForm.courseDay" placeholder="请选择上课日期" size='small'>
                        <el-option v-for="item in courseDays" :key="item.id" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程时间段" prop="courseTime" >
                    <el-input v-model="courseForm.courseTime" placeholder="请输入每次上课的时间段" size='small'></el-input>
                </el-form-item>
            </el-form>
            <!-- 表单结束 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false" size='small'>取 消</el-button>
                <el-button type="success" @click="SaveCourse" size='small'>确 定</el-button>
            </span>
        </el-dialog>
        <!-- 排课模态框结束 -->
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
                dialogVisible2:false,
                title:'新增班级信息',
                form:{},
                courseForm:{},
                rules: {
                    name: [
                        { required: true, message: '请输入班级名称', trigger: 'blur' }
                    ],
                    collegeId: [
                        { required: true, message: '请选择所属学院', trigger: 'blur' }
                    ],
                    paikeStatus: [
                        { required: true, message: '是否排课', trigger: 'blur' }
                    ],
                    chargeId: [
                        { required: true, message: '请选择班主任', trigger: 'blur' }
                    ],
                },
                courseDays:['周一','周二','周三','周四','周五']
            }
        },
        created(){
            this.load();
        },
        computed:{
            ...mapState('Clazz',['clazzInfo']),
            ...mapState('college',['collegeInfo']),
            ...mapState('courseManager',['courseInfo']),
        },
        methods:{
            ...mapActions('Clazz',['loadClazz','saveClazz','deleteClazz','toSaveCourse']),
            ...mapActions('college',['loadcollege']),
            ...mapActions('courseManager',['loadCourseInfo']),
            // 确定排课
            SaveCourse(){
                this.dialogVisible2 = false;
                this.toSaveCourse(this.courseForm).then(r=>{
                    this.load()
                    this.$notify({
                        title: '成功',
                        message: '排课成功',
                        type:'success'
                    })
                })
            },
            // 为班级排课
            addCourse(row){
                this.dialogVisible2 = true;
                this.courseForm.clazzId = row.id;
            },
            // 保存
            toSave(){
                this.dialogVisible = false
                this.saveClazz(this.form).then(r=>{
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
                    paikeStatus:'',
                    collegeId:'',
                    chargeId:''
                }
                this.title = '新增班级信息'
            },
            // 修改
            edit(row) {
                this.dialogVisible = true
                this.form.name = row.name
                this.form.paikeStatus = row.paikeStatus
                this.form.collegeId = row.collegeId
                this.form.chargeId = row.college.id
                this.form.id = row.id
                this.title = '修改班级信息'
            },
            // 删除
            deleteRow(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.deleteClazz(row.id).then(r=>{
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
            // 加载所有班级信息
            load(){
                let obj = {
                    page:this.page,
					pageSize:this.pageSize
				}
                this.loadClazz(obj).then(r=>{
                    this.total = this.clazzInfo.total
                })
                // 加载所有学院
                let obj2 = {
                    page:1,
					pageSize:100
				}
                this.loadcollege(obj2)
                this.loadCourseInfo(obj2)
            }
        }
    }
</script> 
<style scoped>
    .Clazz{
        padding: 10px;
    }
    /* 头部的按钮的颜色 */
    .Clazz_button .el-button{
        background-color:orange;
        border-color:orange;
    }
    .Clazz_button .el-button:hover{
        background-color:rgb(248, 189, 79);
        border-color:rgb(250, 193, 87);
    }
    /* 头部的按钮、输入框、下拉框之间的距离 */
    .Clazz_button .el-input{
        width: 20%;
    }
    .Clazz_button .el-select{
        margin-right: 20px;
    }
    .Clazz_button .el-button{
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
    .dialog-footer .el-button:nth-child(2){
        background-color:orange;
        border-color:orange;
    }
    .dialog-footer .el-button:nth-child(2):hover{
        background-color:rgb(248, 189, 79);
        border-color:rgb(250, 193, 87);
    }
    /* 模态框的标题部分 */
    .el-dialog__header{
        background-color: orange ;
    }
</style>