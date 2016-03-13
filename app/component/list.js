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