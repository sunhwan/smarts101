
import {createApp, Vue} from 'vue';
import App from './App.vue';

const app = createApp(App);
app.config.productionTip = false;

// global mixin to make static files available on the inner objects
// https://stackoverflow.com/a/40897670/8207
app.mixin({
  data: function() {
    return {
      staticFiles: STATIC_FILES,  // STATIC_FILES must be defined in the template above vue bundle import.
    };
  }
});

app.mount('#object-lifecycle-home');
