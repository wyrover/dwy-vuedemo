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