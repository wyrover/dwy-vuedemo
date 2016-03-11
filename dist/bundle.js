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
          password: '25415257',
          confirmation:'5245454'
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
            v-autofocus
            v-autoselect
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

          <div class="form-group">
            <input class="form-control"
              v-confirmation="account.confirmation"
              v-bind:origin="account.password"
              name="confirmation"
              v-validate:confirmation="{required:true,minlength:6,maxlength:50}"
              placeholder="password"
              type="password"
              v-model="account.confirmation">

          </div>

          <div class="alert alert-danger" v-show="$signupValidator.confirmation.invalid&&!$signupValidator.confirmation.pristine">
            <p v-show="$signupValidator.confirmation.required&&!$signupValidator.confirmation.pristine">password required</p>
            <p v-show="$signupValidator.confirmation.minlength&&!$signupValidator.confirmation.pristine">password too short</p>
            <p v-show="$signupValidator.confirmation.maxlength&&!$signupValidator.confirmation.pristine">password too long</p>
            <p v-show="$signupValidator.confirmation.confirmation&&!$signupValidator.confirmation.pristine">password is diff with origin</p>
          </div>
      <div class="errors">
        <validator-errors :validation="$signupValidator"></validator-errors>
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
  Vue.directive('autofocus',{
    bind:function(){
      var el=this.el;
      setTimeout(function(){
        el.focus();
      },100);

    }
  });

  Vue.directive('autoselect',{
    bind:function(){
      var el=this.el;
      setTimeout(function(){
        el.select();
      },100);
    }
  });

  Vue.directive('confirmation',{
    params: ['origin'],
    paramWatchers:{
      origin:function(val,oldVal){
        if(val!==this._value){
          this.vm.$setValidationErrors([{
            field:'confirmation',
            message:'the value is diff with origin'
          }]);
        }

      }
    },
    update:function(val,oldVal){
      //{String} field
      //{String} message
      //{String} validator [optional]
      if(val!==this.params['origin']){
        //this.vm.$setValidationErrors([{
        //  field:'confirmation',
        //  message:'the value is diff with origin'
        //}]);
      }

      this._value=val;
    }
  });

})();
(function () {

  function _handleEvent (el, events, method, listener) {
    events.split(/\s|\,|\;/).forEach(function (evt) {
      el[method](evt, listener);
    });
  }

  function Backdrop(){
    this._backdrop=new Vue({
      el:document.createElement('div'),
      template:`<div class="modal-backdrop fade"></div>`
    });
  }

  Backdrop.prototype={
    show:function(){
      var $el=this._backdrop.$el;

      this._backdrop.$appendTo('body');
      setTimeout(function(){
        $el.classList.add('in');
      },0);

    },
    hide:function(){
      var backdrop=this._backdrop;
      var $el=backdrop.$el;

      var onTransitionEnd=function(){
        _handleEvent($el,transitionEnd,'removeEventListener',onTransitionEnd);
        backdrop.$destroy(true);
      };

      _handleEvent($el,transitionEnd,'addEventListener',onTransitionEnd);

      $el.classList.remove('in');
    }
  };

  function Modal(option) {
    var self = this;
    var defaults = {
      data:{
        title: 'Are you sure',
        okText: 'Yes,I\'m sure',
        cancelText: 'No,I am not'
      },
      methods:{
        onCancelBtnClick:function(){
          self.close()._onCancel();

        },
        onOkBtnClick:function(){
          self.close()._onConfirm();
        }
      },
      template: '',
      isOpen: false
    };

    this._handleOption(defaults,option);


    //set modal's container element
    this._modalContainer=document.querySelector('body');

    this._modal = this._getModalInstance(defaults);
  }

  var transitionEnd = 'transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd';

  Modal.prototype = {
    constructor:Modal,
    open: function () {
      var modal = this._modal;
      var $el = modal.$el;

      this.backdrop=new Backdrop();

      this._modalContainer.classList.add('modal-open');

      modal.$data.isOpen = true;
      modal.$appendTo('body');

      $el.setAttribute('style', 'display:block');

      setTimeout(function () {
        $el.classList.add('in');
      }, 0);

      this.backdrop.show();
      return this;
    },
    close: function () {
      var self = this;
      var modal = this._modal;
      var $el = modal.$el;

      var onTransitionEnd = function () {
        self._off(onTransitionEnd);
        modal.$destroy(true);
      };

      modal.$data.isOpen = false;

      self._on(onTransitionEnd);

      $el.classList.remove('in');

      this._modalContainer.classList.remove('modal-open');
      this.backdrop.hide();
      return this;
    },
    confirm: function (onConfirm) {
      if (typeof onConfirm === 'function') {
        this._onConfirm = onConfirm;
      }
      return this;
    },
    cancel: function (onCancel) {
      if (typeof onCancel === 'function') {
        this._onCancel = onCancel;
      }
      return this;
    },
    _on: function (listener) {
      _handleEvent(this._modal.$el, transitionEnd, 'addEventListener', listener);
    },
    _off: function (listener) {
      _handleEvent(this._modal.$el, transitionEnd, 'removeEventListener', listener);
    },
    _onConfirm:function(){},
    _onCancel:function(){},
    _handleOption:function(defaults,option){
      if (typeof option === 'string') {
        option = {
          template: option
        };
      }

      if(typeof option==='object'){
        defaults.template=option.template;

        //merge data
        Object.assign(defaults.data, option.data);

        //merge methods
        Object.assign(defaults.methods, option.methods);

        //set the onConfirm callback
        if (typeof option.confirm === 'function') {
          this._onConfirm = option.confirm;
        }

        //set the onCancel callback
        if (typeof option.cancel === 'function') {
          this._onCancel = option.cancel;
        }

      }
    },
    _getModalInstance:function(option){
      return new Vue({
        el: document.createElement('div'),
        data: option.data,
        template:this._tpl.replace('{{{template}}}',option.template),
        methods: option.methods
      })
    },
    _tpl: `
        <div class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" @click="onCancelBtnClick" aria-label="Close">
                <span aria-hidden="{{isOpen}}">&times;</span>
              </button>
              <h4 class="modal-title">{{title}}</h4>
            </div>
            <div class="modal-body">
              {{{template}}}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" @click="onCancelBtnClick">{{cancelText}}</button>
              <button type="button" class="btn btn-primary" @click="onOkBtnClick">{{okText}}</button>
            </div>
          </div>
        </div>
      </div>
      `
  };

  Vue.component('dropdown-comp', {
    data: function () {
      return {
        menuList: [
          {name: 'fuck you'},
          {name: 'fuck me'},
          {name: 'fuck her'},
          {name: 'fuck them'}
        ],
        tips: '',
        currentMenu: null
      }
    },
    template: `
    <panel :heading="'Dropdown'" transition="slide" class="slide-transition module-container">
      <div class="col-xs-5">
        <dropdown :btn-text="'open menu'" :is-open="true">
          <menu-item v-for="menu of menuList" @click="onItemClick(menu)">{{menu.name}}</menu-item>
        </dropdown>
      </div>
      <div class="col-xs-5">
        <h4 v-if="currentMenu">current menu is:{{currentMenu.name}}</h4>
        <h4 v-if="!currentMenu">Please select menu!</h4>
        <h3>{{tips}}</h3>
      </div>
    </panel>`,
    methods: {
      onItemClick: function (menu) {
        var self = this;
        var template=`
        <h1>
          <i class="glyphicon glyphicon-alert"></i>
          Do you like suck my dick?
          <dropdown :btn-text="'open menu'" :is-open="true">
            <menu-item @click="fuck">fuck</menu-item>
          </dropdown>
        </h1>`;

        this.currentMenu = menu;

        var modal = new Modal({
          template:template,
          data:{
            title:'Warning'
          },
          methods:{
            fuck:function(){
              alert('fuck');
            }
          }
        });

        modal
          .confirm(function () {
            self.tips = 'Yes,you sure';
          })
          .cancel(
            function () {
              self.tips = 'No,you not sure';
            }
          );

        modal.open();
      }
    }
  });
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
(function(){
  Vue.validator('email', function (val/*,rule*/) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
  })
})();