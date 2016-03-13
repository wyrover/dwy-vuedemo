(function () {


  Vue.component('dropdown-comp', {
    data: function () {
      return {
        menuList: [
          {name: 'fuck you'},
          {name: 'fuck me'},
          {name: 'fuck her'},
          {name: 'fuck them'}
        ],
        tips: '',
        currentMenu: null
      }
    },
    template: `
    <panel :heading="'Dropdown'" transition="slide" class="slide-transition panel-success">
      <div class="col-xs-5">
        <dropdown :btn-text="'open menu'" :is-open="true">
          <menu-item v-for="menu of menuList" @click="onItemClick(menu)">{{menu.name}}</menu-item>
        </dropdown>
      </div>
      <div class="col-xs-5">
        <h4 v-if="currentMenu">current menu is:{{currentMenu.name}}</h4>
        <h4 v-if="!currentMenu">Please select menu!</h4>
      </div>
    </panel>`,
    methods: {
      onItemClick: function (menu) {

        this.currentMenu = menu;
      }
    }
  });
})();
