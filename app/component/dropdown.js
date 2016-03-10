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
