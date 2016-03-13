(function(){
  function plugin(Vue){

  }

  plugin.install=function(Vue){
    var services={};
    Vue.service=function(id,service){
      if(!service){
        return services[id];
      }
      services[id]=service;
    }
  };

  Vue.use(plugin);
})();
(function(){

  var transitionEnd = 'transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd';

  Vue.component('accordion-body',{
    template:`
  <div class="panel-collapse collapse" role="tabpanel">
    <div class="panel-body">
      <slot></slot>
    </div>
  </div>
  `,
    methods:{
      expand:function(){
        var accordionBody=$(this.$el);
        var panel=accordionBody.children();
        var complete=function(){
          accordionBody
            .removeClass('collapsing')
            .addClass('collapse in')
            .height('');
        };

        accordionBody
          .removeClass('collapse')
          .addClass('collapsing')
          .attr('aria-expanded', true)
          .one(transitionEnd,complete);

        setTimeout(function(){
          accordionBody.height(panel.height());
        },50);
        this.$parent.isActive=true;
      },
      collapse:function(){
        var accordionBody=$(this.$el);
        var complete=function(){
          accordionBody
            .removeClass('collapsing')
            .addClass('collapse')
            .height('');
        };

        accordionBody
          .height(accordionBody.height())
          .one(transitionEnd,complete)
          .removeClass('collapse in')
          .addClass('collapsing')
          .attr('aria-expanded', false)
          .height(0);

        this.$parent.isActive=false;
      }
    }
  });

  Vue.component('accordion',{
    template:`
    <div class="panel panel-default">
      <div class="panel-heading" role="tab" @click="onHeadingClick">
        <h4 class="panel-title">
          <a role="button" data-toggle="collapse" data-parent="#accordion" href="javascript:;" aria-expanded="true">
            {{heading}}
          </a>
        </h4>
      </div>
      <accordion-body>
        <slot></slot>
      </accordion-body>
    </div>
  `,
    props:{
      isActive:{
        type:Boolean,
        default:false
      },
      heading:{
        type:String,
        required:true
      }
    },
    methods:{
      onHeadingClick:function(){
        this.$dispatch('$accordionHeadingClick',this);
      },
      toggle:function(){
        var method=this.isActive?'collapse':'expand';
        this.$children[0][method]();
      }
    },
    ready:function(){
      if(this.isActive){
        this.$children[0].expand();
      }
    }
  });

  Vue.component('accordion-group',{
    template:`
    <div class="panel-group" role="tablist" aria-multiselectable="true">
      <slot></slot>
    </div>
  `,
    props:{
      multiselectable:{
        type:Boolean,
        default:false
      }
    },
    created:function(){
      this.$on('$accordionHeadingClick',function(accordion){

        accordion.toggle();

        if(!this.multiselectable&&accordion.isActive){
          this.$children.forEach(function(item){
            if(accordion!==item){
              item.$children[0].collapse();
            }
          });
        }
      });
    }
  });

  Vue.component('accordion-demo',{
    template:`
    <panel :heading="'Accordion Demo'" transition="slide" class="transition-slide panel-success">
      <accordion-group>
        <accordion :heading="'accordion 1'" :is-active="true">
          <h1>Accordion 1</h1>
        </accordion>

        <accordion :heading="'accordion 2'">
          <h1>Accordion 2</h1>
        </accordion>

        <accordion :heading="'accordion 3'">
          <h1>Accordion 3</h1>
        </accordion>
      </accordion-group>
    </panel>
  `
  });
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

  Vue.component('list-item',{
    template:`
      <li class="list-group-item">
        <slot></slot>
      </li>
    `
  });

  Vue.component('list',{
    props:{
      showMoreBtn:{
        type:Boolean,
        default:true
      },
      btnText:{
        type:String,
        default:'Load More'
    }
    },
    template:`
      <ul class="list-unstyled list-group">
        <slot></slot>
        <button class="btn btn-default btn-block" v-if="showMoreBtn" @click="onMoreBtnClick">{{btnText}}</button>
      </ul>
    `,
    methods:{
      onMoreBtnClick:function(){
        this.$dispatch('load',{});
      }
    }
  });
})();
(function(){
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
        _.merge(defaults.data, option.data);

        //merge methods
        _.merge(defaults.methods, option.methods);

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

  window.Modal=Modal;

  Vue.component('modal-comp',{
    data:function(){
      return {
        title:'Modal Demo',
        tips:''
      }
    },
    template:`
      <panel :heading="title" transition="slide" class="transition-slide panel-success">
        <button class="btn btn-info" @click="onOpenBtnClick">Open Modal</button>
        <h4>{{tips}}</h4>
      </panel>
    `,
    methods:{
      onOpenBtnClick:function(){
        var self = this;
        var template=`
        <h1>
          <i class="glyphicon glyphicon-alert"></i>
          Do you like suck my dick?
          <dropdown :btn-text="'open menu'" :is-open="true">
            <menu-item @click="fuck">fuck</menu-item>
          </dropdown>
        </h1>`;

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

/**
 * Created by Zhuhan Du on 2016/3/12.
 */
Vue.component('tab-pane',{
  props:{
    isActive:{
      type:Boolean,
      default:false
    },
    heading:{
      type:String,
      required:true
    }
  },
  template:`
    <div class="tab-pane" role="tabpanel" v-bind:class="{active:isActive}">
      <slot></slot>
    </div>
  `
});
Vue.component('tabs',{
  template:`
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" v-bind:class="{active:child.isActive}" v-for="child of $children" @click="onTabItemClick(child)">
      <a href="javascript:;" aria-controls="{{child.heading}}" role="tab">{{child.heading}}</a>
    </li>
  </ul>
  <div class="tab-content">
    <slot></slot>
  </div>
  `,
  methods:{
    onTabItemClick:function(tabPane){
      this.$children.forEach(function(pane){
        pane.isActive=tabPane===pane;
      },this);
    }
  }
});

Vue.component('tab-demo',{
  template:`
    <panel :heading="'Tabs Demo'" transition="slide" class="transition-slide panel-success">
    <tabs>
      <tab-pane :heading="'Todo'" :is-active="true">
        <list>
          <list-item v-for="i of [1,2,3,4,5,6,7]">
            {{i}}
          </list-item>
        </list>
      </tab-pane>

      <tab-pane :heading="'Profile'">
        <dropdown :btn-text="'menu'">
          <menu-item v-for="i of [1,2,3,4]">
            menu{{i}}
          </menu-item>
        </dropdown>
      </tab-pane>
    </tabs>
    </panel>
  `
});
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
    <panel :heading="'Dropdown'" transition="slide" class="slide-transition panel-success">
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
    methods: {
      onItemClick: function (menu) {

        this.currentMenu = menu;
      }
    }
  });
})();

Vue.component('list-comp',{
  data:function(){
    return {
      title:'List Demo',
      list:[1,2,3,4,5,6],
      showMore:true
    }
  },
  template:`
    <panel :heading="title" transition="slide" class="slide-transition panel-success">
      <button class="btn btn-danger" @click="toggleMore">Toggle More</button>
      <list :btn-text="'加载更多'" :show-more-btn="showMore" @load="loadMore">
        <list-item v-for="item of list">{{item}}</list-item>
      </list>
    </panel>
  `,
  methods:{
    toggleMore:function(){
      this.showMore=!this.showMore;
    },
    loadMore:function(){
      alert('load more');
    }
  }
});


(function(){
  Vue.component('signup',{
    data:function(){
      return {
        title:'Signup Form'
      }
    },
    template:`
        <panel :heading="title" transition="slide" class="slide-transition panel-success">
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