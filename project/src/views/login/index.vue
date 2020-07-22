<template>
  <div class="login-container">
    <div class="title-container">
			<h3 class="title">教学辅助平台</h3>
		</div>
		<div class="content-container">
			<div class="content-left">
				<img src="../../assets/login3.jpg" alt="">
			</div>
			<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
				<div class="login-form-title">登录</div>
				<el-form-item prop="username">
					<span class="svg-container">
					<svg-icon icon-class="user" />
					</span>
					<el-input
						ref="username"
						v-model="loginForm.username"
						placeholder="Username"
						name="username"
						type="text"
						tabindex="1"
						auto-complete="on"
					/>
				</el-form-item>
				<el-form-item prop="password">
					<span class="svg-container">
					<svg-icon icon-class="password" />
					</span>
					<el-input
						:key="passwordType"
						ref="password"
						v-model="loginForm.password"
						:type="passwordType"
						placeholder="Password"
						name="password"
						tabindex="2"
						auto-complete="on"
						@keyup.enter.native="handleLogin"
					/>
					<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
					</span>
				</el-form-item>
				<el-button :loading="loading" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>
				<div>没有账号？
					<el-button @click="enroll" type="text" size="small">注册</el-button>
				</div>
			</el-form>
		</div>
		<!-- 模态框开始 -->
        <!-- <el-dialog title='用户注册' :visible.sync="dialogVisible" width="40%"> -->
            <!-- 表单开始 -->
			<!-- <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username" >
                    <el-input v-model="form.username" placeholder="请输入用户名" size='small'></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop='realname'>
                    <el-input v-model="form.realname" placeholder="请输入姓名" size='small'></el-input>
                </el-form-item>
                <el-form-item label="密码" prop='password'>
                    <el-input type="password" v-model="form.password" placeholder="请输入密码" size='small'></el-input>
                </el-form-item>
            </el-form> -->
            <!-- 表单结束 -->
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size='small'>取 消</el-button>
                <el-button type="success" @click="toSave" size='small'>确 定</el-button>
            </span>
        </el-dialog> -->
        <!-- 模态框结束 -->
		<!-- 模态框开始 -->
        <el-dialog title="用户注册" :visible.sync="dialogVisible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="realname">
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
import { validUsername } from '@/utils/validate'
import {mapActions,mapState} from "vuex";
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
        callback()
    }
    const validatePassword = (rule, value, callback) => {
        callback()
    }
    return {
		dialogVisible:false,
		form:{},
		rules: {
			username: [
				{ required: true, message: '请输入用户名', trigger: 'blur' }
			],
			realname: [
				{ required: true, message: '请输入姓名', trigger: 'blur' }
			],
			password: [
				{ required: true, message: '请输入密码', trigger: 'blur' }
			]
		},
      loginForm: {
        username: 'admin1',
        password: '123321'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('userInfo',['tomodification']),
	//   保存
	toSave(){
		this.dialogVisible = false
		// console.log(this.form);
		this.tomodification(this.form).then(r=>{
			this.$notify({
				title: '成功',
				message: '注册成功',
				type:'success'
			})
		})
	},
	//   注册
	enroll(){
		this.dialogVisible = true
		this.form = {}
	},
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
		  this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#000;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
  $bg:#ffd582;
	$dark_gray:#889aa4;
	// $light_gray:#eee;
	.login-container {
		min-height: 100%;
		width: 100%;
		.title-container {
			width: 100%;
			height: 100px;
			background-color: #fff;
			// padding-left: 100px;
			.title {
				font-size: 26px;
				color: #000;
				margin: 0;
				line-height: 100px;
        font-weight:normal;
        text-align: center;
			}
		}
		.content-container{
			background-color: $bg;
			max-width: 100%;
			padding: 90px;
			overflow: hidden;
			.content-left{
				float: left;
				img{
					width:370px;
          height:300px;
				}
			}
			.login-form {
				position: relative;
				width: 360px;
				height: 300px;
				max-width: 100%;
				padding: 20px 35px 0;
				background-color: transparent;
				float:right;
				border-radius: 5px;
			}
		}
	}
	.login-form-title{
		width: 100%;
		height: 60px;
		line-height: 60px;
		font-weight: bold;
		text-align: center;
	}
	.svg-container {
		padding: 6px 5px 6px 15px;
		color: $dark_gray;
		vertical-align: middle;
		width: 30px;
		display: inline-block;
	}
	.show-pwd {
		position: absolute;
		right: 10px;
		top: 7px;
		font-size: 16px;
		color: $dark_gray;
		cursor: pointer;
		user-select: none;
  }
	.el-button{
		background-color: transparent;
	}
	.el-button:focus, .el-button:hover{
		color: orange;
		background-color: #fad390;
		border-color: #faf0dc;
	}
	/* 所有的文字按钮 */
    .el-button--text{
        color: #333;
    }
    .el-button--text:hover,.el-button--text:focus{
        color: #ccc;
		border:none;
		background-color: transparent;
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
</style>
