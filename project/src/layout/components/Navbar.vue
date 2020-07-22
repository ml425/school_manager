<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="data.userFace" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 显示实时天气 -->
    <div class="weather">
      <ul>
        <li>
          <iframe id="tianqi" scrolling="no" frameborder="0" allowtransparency="true" src="http://i.tianqi.com/index.php?c=code&a=getcode&id=34&h=25&w=280"></iframe>
          <span>{{this.nowTime}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters,mapState} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  data() {
    return {
      nowTime: new Date(), // 获取当前时间戳
    };
  },
  created() {
    var this_ = this; //声明一个变量代表this，保证this的指向正确
    var setTime = setInterval(function() {  //使用定时器，每一秒执行一次
      this_.nowTime = //将获取的时间戳转换成日常的时间格式
        new Date().getFullYear() + "-" +
        this_.appendZero((new Date().getMonth() + 1)) + "-" +
        this_.appendZero(new Date().getDate()) + " " +
        this_.appendZero(new Date().getHours()) + ":" +
        this_.appendZero(new Date().getMinutes()) + ": " +
        this_.appendZero(new Date().getSeconds());
    }, 1000);
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    ...mapState('user',['avatar','data'])
  },
  methods: {
    //将小于10的在前面加0
    appendZero(time){
      if (time < 10) {
        return "0" + time;
      }else {
        return time;
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #f7e6c3;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
// 天气的部分
.weather{
  width: 450px;
  height: 50px;
  float: right;
}
.weather iframe{
  width: 250px;
  height: 50px;
  display:inline-block;
}
.weather span{
  position:relative;
  top:-33px;
  color: #333;
  font-size: 12px;
}
</style>
