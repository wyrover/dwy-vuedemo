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
