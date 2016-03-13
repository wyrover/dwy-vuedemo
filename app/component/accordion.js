(function(){

  var transitionEnd = 'transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd';

  Vue.component('accordion-body',{
    template:`
  <div class="panel-collapse collapse" role="tabpanel">
    <div class="panel-body">
      <slot></slot>
    </div>
  </div>
  `,
    methods:{
      expand:function(){
        var accordionBody=$(this.$el);
        var panel=accordionBody.children();
        var complete=function(){
          accordionBody
            .removeClass('collapsing')
            .addClass('collapse in')
            .height('');
        };

        accordionBody
          .removeClass('collapse')
          .addClass('collapsing')
          .attr('aria-expanded', true)
          .one(transitionEnd,complete);

        setTimeout(function(){
          accordionBody.height(panel.height());
        },50);
        this.$parent.isActive=true;
      },
      collapse:function(){
        var accordionBody=$(this.$el);
        var complete=function(){
          accordionBody
            .removeClass('collapsing')
            .addClass('collapse')
            .height('');
        };

        accordionBody
          .height(accordionBody.height())
          .one(transitionEnd,complete)
          .removeClass('collapse in')
          .addClass('collapsing')
          .attr('aria-expanded', false)
          .height(0);

        this.$parent.isActive=false;
      }
    }
  });

  Vue.component('accordion',{
    template:`
    <div class="panel panel-default">
      <div class="panel-heading" role="tab" @click="onHeadingClick">
        <h4 class="panel-title">
          <a role="button" data-toggle="collapse" data-parent="#accordion" href="javascript:;" aria-expanded="true">
            {{heading}}
          </a>
        </h4>
      </div>
      <accordion-body>
        <slot></slot>
      </accordion-body>
    </div>
  `,
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
    methods:{
      onHeadingClick:function(){
        this.$dispatch('$accordionHeadingClick',this);
      },
      toggle:function(){
        var method=this.isActive?'collapse':'expand';
        this.$children[0][method]();
      }
    },
    ready:function(){
      if(this.isActive){
        this.$children[0].expand();
      }
    }
  });

  Vue.component('accordion-group',{
    template:`
    <div class="panel-group" role="tablist" aria-multiselectable="true">
      <slot></slot>
    </div>
  `,
    props:{
      multiselectable:{
        type:Boolean,
        default:false
      }
    },
    created:function(){
      this.$on('$accordionHeadingClick',function(accordion){

        accordion.toggle();

        if(!this.multiselectable&&accordion.isActive){
          this.$children.forEach(function(item){
            if(accordion!==item){
              item.$children[0].collapse();
            }
          });
        }
      });
    }
  });

  Vue.component('accordion-demo',{
    template:`
    <panel :heading="'Accordion Demo'" transition="slide" class="transition-slide panel-success">
      <accordion-group>
        <accordion :heading="'accordion 1'" :is-active="true">
          <h1>Accordion 1</h1>
        </accordion>

        <accordion :heading="'accordion 2'">
          <h1>Accordion 2</h1>
        </accordion>

        <accordion :heading="'accordion 3'">
          <h1>Accordion 3</h1>
        </accordion>
      </accordion-group>
    </panel>
  `
  });
})();
