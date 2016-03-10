
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