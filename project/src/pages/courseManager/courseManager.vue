<template>
    <div class="courseManager">
        <div class="courseManager_button">
            <el-button type="primary" size='small' @click="toAdd">新增</el-button>
		</div>
        <!-- 表格结束 -->
        <div class="information_left">
            <!-- 表格开始 -->
            <el-table
                :data="courseInfo.list" 
                style="width: 100%" @row-click="openHomeworks" size='small' empty-text='暂无数据'>
                <el-table-column
                    prop="id"
                    label="编号"
                    width="50" align="center">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称"
                    width="150" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100" align="center">
                    <template slot-scope="scope">
                        <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 表格结束 -->
            <!-- 分页开始 -->
            <div class="grade_page">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :hide-on-single-page="false"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
            <!-- 分页结束 -->
        </div>
        <div class="information_right" v-if="isShow">
            <!-- 右边具体资料的头部 -->
            <div class="right_header">
                <div><span>当前课程：</span> <span>{{this.courseNameNow}}</span></div>
            </div>
            <!-- 表格开始 -->
            <el-table
                :data="this.details"
                style="width: 100%" border size='small' empty-text='暂无数据'>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item>
                                <span class="time">
                                    <div>
                                        <span>学期：</span>
                                        <span>{{props.row.year}}</span>
                                        <span>{{props.row.term}}</span>
                                    </div>
                                    <div>
                                        <span>具体时间：</span>
                                        <span>{{props.row.courseDay}}</span>
                                        <span>{{props.row.courseTime}}</span>
                                    </div>
                                    <div>
                                        <span>学分：</span>
                                        <span>{{props.row.credit}}</span>
                                    </div>
                                    <div>
                                        <span>课时：</span>
                                        <span>{{props.row.hours}}</span>
                                    </div>
                                </span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称"
                    min-width="100" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="类型"
                    width="100" align="center">
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="课程说明"
                    width="150" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="teacherName"
                    label="任课老师"
                    width="100" align="center">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100" align="center">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 表格结束 -->
        </div>
        <div class="replace" v-else>您还未选中课程</div>
        <!-- 新增修改模态框开始 -->
        <el-dialog :title='title' :visible.sync="dialogVisible" width="50%">
            <!-- {{form}} -->
            <!-- 表单开始 -->
			<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="名称" prop="name" >
                    <el-input v-model="form.name" placeholder="请输入名称" size='small'></el-input>
                </el-form-item>
                <el-form-item label="课程类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择课程类型" size='small'>
                        <el-option v-for="item in courses" :key="item.id" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任课老师" prop="teacherId" >
                    <el-select v-model="form.teacherId" placeholder="请选择班主任" size='small'>
                        <el-option v-for="item in courseInfo.list" :key="item.teacher.id" :label="item.teacher.realname" :value="item.teacher.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学分" prop="credit" >
                    <el-input type="number" v-model="form.credit" placeholder="请输入课程所占学分" size='small'></el-input>
                </el-form-item>
                <el-form-item label="课时" prop="hours" >
                    <el-input type="number" v-model="form.hours" placeholder="请输入课时" size='small'></el-input>
                </el-form-item>
                <el-form-item label="课程说明" prop="description">
                    <el-input type="textarea" v-model="form.description" placeholder="请输入课程说明" size='small'></el-input>
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
            pageSize:8,
            total:100,
            dialogVisible:false,
            title:'新增课程',
            isShow:false,
            courseNameNow:'',
            courses:['必修课','选修课'],
            details:[],
            form:{
            },
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择课程类型', trigger: 'blur' }
                ],
                teacherId: [
                    { required: true, message: '请选择任课老师', trigger: 'blur' }
                ],
                credit: [
                    {required: true, message: '请填写数字', trigger: 'blur' }
                ],
                hours: [
                    { required: true, message: '请填写此课程的课时', trigger: 'blur' }
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
        ...mapState('courseManager',['courseInfo','courseNow']),
	},
    methods:{
        ...mapActions('courseManager',['loadCourseInfo','saveCourseInfo','deleteCourseInfo','loadCourse']),
        // 点击某一行
        openHomeworks(row){
            // 根据课程id加载作业
            this.loadCourse(row.id).then(r=>{
                var teacherbyId = this.courseInfo.list.filter(item => {
                    return item.teacher.id == this.courseNow[0].teacherId; 
                }); 
                this.courseNow[0].teacherName = teacherbyId[0].teacher.realname
                this.details = this.courseNow
            })
            this.courseNameNow = row.name
            this.isShow = true
        },
        // 保存年级信息
		toSave(){
			this.dialogVisible = false
			this.saveCourseInfo(this.form).then(r=>{
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
                teacherId:'',
                type:'',
                description:'',
                credit:'',
                hours:'',
            }
		},
        // 修改
        edit(row) {
            this.dialogVisible = true
            this.form.name = row.name
            this.form.teacherId = row.teacherId
            this.form.type = row.type
            this.form.description = row.description
            this.form.credit = row.credit
            this.form.hours = row.hours
            this.form.id = row.id
            this.title = '修改课程信息'
        },
        // 删除
        deleteRow(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
					this.deleteCourseInfo(row.id).then(r=>{
                        this.load()
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type:'success'
                        })
                        this.details = [];
                        this.courseNameNow = '';
                    })
				}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
            
        },
        // 分页触发事件
    	handleCurrentChange(page){
    		this.page = page
    		this.load()
        },
        // 加载所有课程信息
        load(){
            let obj = {
				page:this.page,
				pageSize:this.pageSize
			}
            this.loadCourseInfo(obj).then(r=>{
                this.total = this.courseInfo.total
            })
        }
    }
}
</script> 
<style scoped>
    .courseManager{
        padding: 10px;
    }
    .courseManager_button .el-button{
        background-color:orange;
        border-color:orange;
        margin-bottom: 10px;
    }
    .courseManager_button .el-button:hover{
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
    .information_left{
        width: 30%;
        float: left;
        margin-right: 20px;
    }
    .information_right{
        width: 65%;
        padding: 10px;
        float: right;
    }
    .replace{
        color: red;
        font-size: 12px;
        padding: 10px;
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
    /* 右边头部 */
    .right_header>*{
        margin-bottom: 10px;
    }
    .right_header>div>span:first-child{
        font-weight: bold;
    }
    .time>div>span:first-child{
        font-size: 20px;
    }
</style>