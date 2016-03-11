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