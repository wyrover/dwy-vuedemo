(function(){
  Vue.validator('email', function (val/*,rule*/) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
  })
})();
(function(){
  Vue.component('menu-item',{
    template:`
      <li>
        <a :href="href">
          <slot></slot>
        </a>
      </li>
    `,
    props:{
      href:{
        type:String,
        default:'javascript:;'
      }
    }
  });


  Vue.component('menu-divider',{
    template:`
      <li class="divider"></li>`
  });

  Vue.component('dropdown',{
    template:`
      <div class="dropdown" v-bind:class="{open:isOpen}">
        <button @click.stop="onBtnClick($event)" class="dropdown-toggle btn btn-success">
          {{btnText}}
          <i class="caret"></i>
        </button>
        <ul class="dropdown-menu">
          <slot></slot>
        </ul>
      </div>
    `,
    props:{
      isOpen:{
        type:Boolean,
        default:false
      },
      btnText:{
        type:String,
        required:true
      }
    },
    created:function(){
      document.addEventListener('click',this.onDocumentClick.bind(this));
    },
    destroyed:function(){
      document.removeEventListener('click',this.onDocumentClick);
    },
    methods:{
      onBtnClick:function(){
        this.isOpen=!this.isOpen;
      },
      onDocumentClick:function(){
        this.isOpen=false;
      }
    }

  });
})();

(function(){
  Vue.component('panel',{
    template:`
        <div class="panel panel-default">
          <div class="panel-heading" v-if="showHeader">
            <h4>{{heading}}</h4>
          </div>
          <div class="panel-body">
            <slot></slot>
          </div>
          <div class="panel-footer" v-if="showFooter">
            <p>{{footer}}</p>
          </div>
        </div>
      `,
    replace:true,
    props: {
      // 基础类型检测 （`null` 意思是任何类型都可以）
      heading: {
        type:String
      },
      footer:{
        type:String
      },
      showHeader:{
        type:Boolean,
        default:true
      },
      showFooter:{
        type:Boolean,
        default:false
      }
    }
  });
})();

(function () {
  Vue.component('signup-form', {
    data: function () {
      return {
        account: {
          email: 'parox2014@gmail.com',
          nickname: 'William nicolas',
          password: '25415257'
        }
      }
    },
    template: `
    <validator name="signupValidator">
      <form @submit.prevent="onSubmit($event)" novalidate>
          <div class="form-group">
            <input class="form-control"
            placeholder="example@google.com"
            v-validate:email="{required:true,email:true}"
            type="email"
            v-model="account.email">
          </div>

          <div class="alert alert-danger" v-show="$signupValidator.email.invalid&&!$signupValidator.email.pristine">
            <p v-show="$signupValidator.email.required&&!$signupValidator.email.pristine">email required</p>
            <p v-show="$signupValidator.email.email&&!$signupValidator.email.pristine">invalid email format</p>
          </div>

          <div class="form-group">
            <input
            v-validate:nickname="{required:true,minlength:6,maxlength:50}"
            class="form-control"
            placeholder="William"
            type="text"
            v-model="account.nickname">
          </div>

          <div class="alert alert-danger" v-show="$signupValidator.nickname.invalid&&!$signupValidator.nickname.pristine">
            <p v-show="$signupValidator.nickname.required&&!$signupValidator.nickname.pristine">nickname required</p>
            <p v-show="$signupValidator.nickname.minlength&&!$signupValidator.nickname.pristine">nickname too short</p>
            <p v-show="$signupValidator.nickname.maxlength&&!$signupValidator.nickname.pristine">nickname too long</p>
          </div>

          <div class="form-group">
            <input class="form-control"
            v-validate:password="{required:true,minlength:6,maxlength:50}"
            placeholder="password" type="password" v-model="account.password">
          </div>

          <div class="alert alert-danger" v-show="$signupValidator.password.invalid&&!$signupValidator.password.pristine">
            <p v-show="$signupValidator.password.required&&!$signupValidator.password.pristine">password required</p>
            <p v-show="$signupValidator.password.minlength&&!$signupValidator.password.pristine">password too short</p>
            <p v-show="$signupValidator.password.maxlength&&!$signupValidator.password.pristine">password too long</p>
          </div>

          <button class="btn btn-success btn-block" type="submit" :disabled="$signupValidator.invalid">Signup</button>
        </form>
    </validator>
      `,
    created:function(){

    },
    methods: {
      onSubmit: function (e) {
        this
          .$http
          .post('/signup',this.account)
        .then(function(resp){
          this.$dispatch('success',resp)
        })
        .catch(function(err){
          this.$dispatch('fail',err);
        });

      }
    }
  });
})();

(function(){
  var Dropdown=Vue.component('dropdown');
  Vue.component('dropdown-comp',{
    data:function(){
      return {
        menuList:[
          {name:'fuck you'},
          {name:'fuck me'},
          {name:'fuck her'},
          {name:'fuck them'}
        ],
        currentMenu:null
      }
    },
    template:`
    <panel :heading="'Dropdown'" transition="slide" class="slide-transition module-container">
      <div class="col-xs-5">
        <dropdown :btn-text="'open menu'" :is-open="true">
          <menu-item v-for="menu of menuList" @click="onItemClick(menu)">{{menu.name}}</menu-item>
        </dropdown>
      </div>
      <div class="col-xs-5">
        <h4 v-if="currentMenu">current menu is:{{currentMenu.name}}</h4>
        <h4 v-if="!currentMenu">Please select menu!</h4>
      </div>
    </panel>`,
    methods:{
      onItemClick:function(menu){
        this.currentMenu=menu;
        var vm=new Dropdown({
          el:document.createElement('div'),
          props:{
            btnText:'fuck'
          }
        });

        vm.$appendTo('body');
      }
    }
  })
})();


(function(){
  Vue.component('signup',{
    data:function(){
      return {
        title:'Signup Form'
      }
    },
    template:`
        <panel :heading="title" transition="slide" class="slide-transition module-container">
          <signup-form @success="onSuccess" @fail="onFail"></signup-form>
        </panel>
      `,
    methods:{
      onSuccess:function(resp){
        console.log(resp);
      },
      onFail:function(err){
        console.log(err.statusText);
      }
    }
  });
})();