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
