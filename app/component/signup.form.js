(function () {
  Vue.component('signup-form', {
    data: function () {
      return {
        account: {
          email: 'parox2014@gmail.com',
          nickname: 'William nicolas',
          password: '25415257',
          confirmation:'5245454'
        }
      }
    },
    template: `
    <validator name="signupValidator">
      <form @submit.prevent="onSubmit($event)" novalidate>
          <div class="form-group">
            <input class="form-control"
            placeholder="example@google.com"
            v-validate:email="{required:true,email:true}"
            type="email"
            v-autofocus
            v-autoselect
            v-model="account.email">
          </div>

          <div class="alert alert-danger" v-show="$signupValidator.email.invalid&&!$signupValidator.email.pristine">
            <p v-show="$signupValidator.email.required&&!$signupValidator.email.pristine">email required</p>
            <p v-show="$signupValidator.email.email&&!$signupValidator.email.pristine">invalid email format</p>
          </div>

          <div class="form-group">
            <input
            v-validate:nickname="{required:true,minlength:6,maxlength:50}"
            class="form-control"
            placeholder="William"
            type="text"
            v-model="account.nickname">
          </div>

          <div class="alert alert-danger" v-show="$signupValidator.nickname.invalid&&!$signupValidator.nickname.pristine">
            <p v-show="$signupValidator.nickname.required&&!$signupValidator.nickname.pristine">nickname required</p>
            <p v-show="$signupValidator.nickname.minlength&&!$signupValidator.nickname.pristine">nickname too short</p>
            <p v-show="$signupValidator.nickname.maxlength&&!$signupValidator.nickname.pristine">nickname too long</p>
          </div>

          <div class="form-group">
            <input class="form-control"
            v-validate:password="{required:true,minlength:6,maxlength:50}"
            placeholder="password" type="password" v-model="account.password">
          </div>

          <div class="alert alert-danger" v-show="$signupValidator.password.invalid&&!$signupValidator.password.pristine">
            <p v-show="$signupValidator.password.required&&!$signupValidator.password.pristine">password required</p>
            <p v-show="$signupValidator.password.minlength&&!$signupValidator.password.pristine">password too short</p>
            <p v-show="$signupValidator.password.maxlength&&!$signupValidator.password.pristine">password too long</p>
          </div>

          <div class="form-group">
            <input class="form-control"
              v-confirmation="account.confirmation"
              v-bind:origin="account.password"
              name="confirmation"
              v-validate:confirmation="{required:true,minlength:6,maxlength:50}"
              placeholder="password"
              type="password"
              v-model="account.confirmation">

          </div>

          <div class="alert alert-danger" v-show="$signupValidator.confirmation.invalid&&!$signupValidator.confirmation.pristine">
            <p v-show="$signupValidator.confirmation.required&&!$signupValidator.confirmation.pristine">password required</p>
            <p v-show="$signupValidator.confirmation.minlength&&!$signupValidator.confirmation.pristine">password too short</p>
            <p v-show="$signupValidator.confirmation.maxlength&&!$signupValidator.confirmation.pristine">password too long</p>
            <p v-show="$signupValidator.confirmation.confirmation&&!$signupValidator.confirmation.pristine">password is diff with origin</p>
          </div>
      <div class="errors">
        <validator-errors :validation="$signupValidator"></validator-errors>
      </div>
          <button class="btn btn-success btn-block" type="submit" :disabled="$signupValidator.invalid">Signup</button>
        </form>
    </validator>
      `,
    created:function(){

    },
    methods: {
      onSubmit: function (e) {
        this
          .$http
          .post('/signup',this.account)
        .then(function(resp){
          this.$dispatch('success',resp)
        })
        .catch(function(err){
          this.$dispatch('fail',err);
        });

      }
    }
  });
})();
