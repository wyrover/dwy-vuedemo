(function(){
  Vue.config.debug=true;

  var App = Vue.extend({
    data: function () {
      return {
        appName: 'Vue Demo',
        author: 'William Du',
        links:[
          {name:'signup',linkText:'Signup'},
          {name:'dropdown',linkText:'Dropdown'}
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
    }
  });

  router.redirect({
    '*':'/signup'
  });

  window.addEventListener('DOMContentLoaded',function(){
    router.start(App,'#app');
  });
})();