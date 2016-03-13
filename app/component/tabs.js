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