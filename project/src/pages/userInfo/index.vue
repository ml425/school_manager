<template>
    <div class="userInfo">
        <!-- {{this.data}} -->
        <div class="userInfo_info">
            <div>
                <span>用户名</span>
                <span>{{this.data.username}}</span>
            </div>
            <div>
                <span>姓 名</span>
                <span>{{this.data.realname}}</span>
            </div>
            <div>
                <span>手机号</span>
                <span>{{this.data.telephone}}</span>
            </div>
            <div>
                <span>性 别</span>
                <span>{{this.data.gender=='female'?'女':'男'}}</span>
            </div>
            <div>
                <span>注册时间</span>
                <span>{{TimeCycle(this.data.registerTime)}}</span>
            </div>
            <div>
                <span>状 态</span>
                <span>{{this.data.status}}</span>
            </div>
            <div>
                <span>身份证号</span>
                <span>{{this.data.idCard}}</span>
            </div>
            <div>
                <span>地 址</span>
                <span>{{this.data.address}}</span>
            </div>
            <div>
                <span>民 族</span>
                <span>{{this.data.nation}}</span>
            </div>
            <div>
                <span>政治身份</span>
                <span>{{this.data.politicsStatus}}</span>
            </div>
            <el-button type="success" size="small" @click="modification">修改</el-button>
        </div>
        <div class="userInfo_img">
            <img :src="this.data.userFace" alt="暂无头像">
        </div>
        <!-- 模态框开始 -->
        <el-dialog title="修改个人信息" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="用户名" >
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="realname" :rules="[{ required:true, message:'请输入姓名', trigger:'blur' }]">
                    <el-input v-model="form.realname"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.telephone"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.gender">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input v-model="form.idCard"></el-input>
                </el-form-item>
                <el-form-item label="民族">
                    <el-input v-model="form.nation"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="政治身份">
                    <el-input v-model="form.politicsStatus"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click="cancel" class="cancel">取消</el-button>
                    <el-button type="success" size="small" @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 模态框结束 -->
    </div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
export default {
    data(){
        return{
            dialogFormVisible: false,
            form: {
                username: '',
                password:'',
                realname: '',
                gender:'',
                telephone:'',
                idCard: '',
                nation: '',
                address: '',
                politicsStatus: ''
            },
            formLabelWidth: '120px'
        }
    },
    created(){

    },
    computed:{
    	...mapState('user',['data'])
	},
    methods:{
        ...mapActions('userInfo',['tomodification']),
        ...mapActions('user',['getInfo']),
        // 取消修改
        cancel(){
            this.dialogFormVisible = false
        },
        // 确定修改
        onSubmit() {
            this.form.gender = this.form.gender=='女'?'female':'male'
            // console.log(this.form);
            this.tomodification(this.form).then(r=>{
                this.$notify({
					title: '成功',
					message: '修改成功',
					type:'success'
                })
                this.dialogFormVisible = false
                this.getInfo()
            });
        },
        // 点击修改
        modification(){
            this.dialogFormVisible = true
            this.form.id = this.data.id
            this.form.userFace = this.data.userFace
            this.form.status = this.data.status
            this.form.username = this.data.username
            this.form.password = this.data.password
            this.form.realname = this.data.realname
            this.form.telephone = this.data.telephone
            this.form.gender = this.data.gender=='female'?'女':'男'
            this.form.idCard = this.data.idCard
            this.form.nation = this.data.nation
            this.form.address = this.data.address
            this.form.politicsStatus = this.data.politicsStatus
        },
        // 将时间转换成我们能看懂的样子
        TimeCycle(time){
            let date = new Date(time);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = (date.getDate()< 10 ? '0'+date.getDate() : date.getDate())+' ';
            let h = (date.getHours()< 10 ? '0'+date.getHours() : date.getHours())+ ':';
            let m = (date.getMinutes()< 10 ? '0'+date.getMinutes() : date.getMinutes())+ ':';
            let s = (date.getSeconds()< 10 ? '0'+date.getSeconds() : date.getSeconds());
            return Y+M+D+h+m+s;
        }
    }
}
</script>
<style scoped>
    .app-main{
        border-radius: 4px;
    }
    .userInfo{
        padding: 10px;
    }
    .userInfo_info{
        width: 30%;
        display: inline-block;
    }
    .userInfo_info>div{
        height: 32px;
        line-height: 32px;
    }
    .userInfo_info>div>span:first-child{
        width: 100px;
        color: #666;
        font-weight: 700px;
        font-weight: bold;
        display: inline-block;
    }
    .userInfo_info>div>span:nth-child(2){
        color: #999;
    }
    .userInfo_img{
        display: inline-block;
        width: 150px;
        height: 150px;
        position: relative;
        top: -150px;
    }
    .userInfo_img img{
        width: 150px;
        height: 150px;
        border-radius: 50%;
    }
    /* 模态框里面表单的单选选中颜色 */
    .el-radio__input .is-checked .el-radio__inner{
        background: orange !important;
        border-color: orange !important;
    }
    /* 按钮颜色 */
    .el-button--success{
        background: orange;
        border-color: orange 
    }
    .el-button:focus, .el-button:hover{
        background: rgb(247, 195, 99);
        border-color: rgb(250, 227, 185) 
    }
    .cancel:hover{
        background: rgb(250, 227, 185);
        border-color: rgb(250, 227, 185) ;
        color: orange;
    }
</style>