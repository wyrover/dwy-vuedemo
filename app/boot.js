(function(){
  Vue.config.debug=true;

  Vue.http.interceptors.push({

    request: function (request) {
      return request;
    },

    response: function (response) {
      debugger;
      return response;
    }

  });

  Vue.service('User',{
    signin:function(account){

    },
    signout:function(){

    }
  });

  var user=Vue.service('User');

  var App = Vue.extend({
    data: function () {
      return {
        appName: 'Vue Demo',
        author: 'William Du',
        links:[
          {name:'signup',linkText:'Signup'},
          {name:'dropdown',linkText:'Dropdown'},
          {name:'list',linkText:'List'},
          {name:'modal',linkText:'Modal'},
          {name:'tabs',linkText:'Tabs'},
          {name:'accordion',linkText:'Accordion'}
        ]
      }
    },
    replace:false,
    template:`
    <nav class="navbar navbar-default bg-success">

      <div class="navbar-header">
        <a class="navbar-brand" href="#">{{appName}}</a>
      </div>

      <ul class="nav navbar-nav">
          <li v-for="link of links">
            <a v-link="{name:link.name}" v-cloak>{{link.linkText}}</a>
          </li>
        </ul>
    </nav>

    <div class="container-fluid">
      <router-view></router-view>
    </div>
    `
  });

  var router=new VueRouter();

  router.map({
    '/signup':{
      name:'signup',
      component:Vue.component('signup')
    },
    '/dropdown':{
      name:'dropdown',
      component:Vue.component('dropdown-comp')
    },
    '/list':{
      name:'list',
      component:Vue.component('list-comp')
    },
    '/modal':{
      name:'modal',
      component:Vue.component('modal-comp')
    },
    '/tabs':{
      name:'tabs',
      component:Vue.component('tab-demo')
    },
    '/accordion':{
      name:'accordion',
      component:Vue.component('accordion-demo')
    }
  });

  router.redirect({
    '*':'/signup'
  });

  window.addEventListener('DOMContentLoaded',function(){
    router.start(App,'#app');
  });
})();