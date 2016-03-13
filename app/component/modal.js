(function(){
  function _handleEvent (el, events, method, listener) {
    events.split(/\s|\,|\;/).forEach(function (evt) {
      el[method](evt, listener);
    });
  }

  function Backdrop(){
    this._backdrop=new Vue({
      el:document.createElement('div'),
      template:`<div class="modal-backdrop fade"></div>`
    });
  }

  Backdrop.prototype={
    show:function(){
      var $el=this._backdrop.$el;

      this._backdrop.$appendTo('body');
      setTimeout(function(){
        $el.classList.add('in');
      },0);

    },
    hide:function(){
      var backdrop=this._backdrop;
      var $el=backdrop.$el;

      var onTransitionEnd=function(){
        _handleEvent($el,transitionEnd,'removeEventListener',onTransitionEnd);
        backdrop.$destroy(true);
      };

      _handleEvent($el,transitionEnd,'addEventListener',onTransitionEnd);

      $el.classList.remove('in');
    }
  };

  function Modal(option) {
    var self = this;
    var defaults = {
      data:{
        title: 'Are you sure',
        okText: 'Yes,I\'m sure',
        cancelText: 'No,I am not'
      },
      methods:{
        onCancelBtnClick:function(){
          self.close()._onCancel();

        },
        onOkBtnClick:function(){
          self.close()._onConfirm();
        }
      },
      template: '',
      isOpen: false
    };

    this._handleOption(defaults,option);


    //set modal's container element
    this._modalContainer=document.querySelector('body');

    this._modal = this._getModalInstance(defaults);
  }

  var transitionEnd = 'transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd';

  Modal.prototype = {
    constructor:Modal,
    open: function () {
      var modal = this._modal;
      var $el = modal.$el;

      this.backdrop=new Backdrop();

      this._modalContainer.classList.add('modal-open');

      modal.$data.isOpen = true;
      modal.$appendTo('body');

      $el.setAttribute('style', 'display:block');

      setTimeout(function () {
        $el.classList.add('in');
      }, 0);

      this.backdrop.show();
      return this;
    },
    close: function () {
      var self = this;
      var modal = this._modal;
      var $el = modal.$el;

      var onTransitionEnd = function () {
        self._off(onTransitionEnd);
        modal.$destroy(true);
      };

      modal.$data.isOpen = false;

      self._on(onTransitionEnd);

      $el.classList.remove('in');

      this._modalContainer.classList.remove('modal-open');
      this.backdrop.hide();
      return this;
    },
    confirm: function (onConfirm) {
      if (typeof onConfirm === 'function') {
        this._onConfirm = onConfirm;
      }
      return this;
    },
    cancel: function (onCancel) {
      if (typeof onCancel === 'function') {
        this._onCancel = onCancel;
      }
      return this;
    },
    _on: function (listener) {
      _handleEvent(this._modal.$el, transitionEnd, 'addEventListener', listener);
    },
    _off: function (listener) {
      _handleEvent(this._modal.$el, transitionEnd, 'removeEventListener', listener);
    },
    _onConfirm:function(){},
    _onCancel:function(){},
    _handleOption:function(defaults,option){
      if (typeof option === 'string') {
        option = {
          template: option
        };
      }

      if(typeof option==='object'){
        defaults.template=option.template;

        //merge data
        _.merge(defaults.data, option.data);

        //merge methods
        _.merge(defaults.methods, option.methods);

        //set the onConfirm callback
        if (typeof option.confirm === 'function') {
          this._onConfirm = option.confirm;
        }

        //set the onCancel callback
        if (typeof option.cancel === 'function') {
          this._onCancel = option.cancel;
        }

      }
    },
    _getModalInstance:function(option){
      return new Vue({
        el: document.createElement('div'),
        data: option.data,
        template:this._tpl.replace('{{{template}}}',option.template),
        methods: option.methods
      })
    },
    _tpl: `
        <div class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" @click="onCancelBtnClick" aria-label="Close">
                <span aria-hidden="{{isOpen}}">&times;</span>
              </button>
              <h4 class="modal-title">{{title}}</h4>
            </div>
            <div class="modal-body">
              {{{template}}}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" @click="onCancelBtnClick">{{cancelText}}</button>
              <button type="button" class="btn btn-primary" @click="onOkBtnClick">{{okText}}</button>
            </div>
          </div>
        </div>
      </div>
      `
  };

  window.Modal=Modal;

  Vue.component('modal-comp',{
    data:function(){
      return {
        title:'Modal Demo',
        tips:''
      }
    },
    template:`
      <panel :heading="title" transition="slide" class="transition-slide panel-success">
        <button class="btn btn-info" @click="onOpenBtnClick">Open Modal</button>
        <h4>{{tips}}</h4>
      </panel>
    `,
    methods:{
      onOpenBtnClick:function(){
        var self = this;
        var template=`
        <h1>
          <i class="glyphicon glyphicon-alert"></i>
          Do you like suck my dick?
          <dropdown :btn-text="'open menu'" :is-open="true">
            <menu-item @click="fuck">fuck</menu-item>
          </dropdown>
        </h1>`;

        var modal = new Modal({
          template:template,
          data:{
            title:'Warning'
          },
          methods:{
            fuck:function(){
              alert('fuck');
            }
          }
        });

        modal
          .confirm(function () {
            self.tips = 'Yes,you sure';
          })
          .cancel(
            function () {
              self.tips = 'No,you not sure';
            }
          );

        modal.open();
      }
    }
  });
})();
