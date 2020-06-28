// eslint-disable-next-line import/no-extraneous-dependencies
import electron from 'electron';
import Vue from 'vue';
import App from './App';
import Splash from './Splash';
import { initializeReporter } from './modules/reporting';
import LoggerPlugin from './plugins/logger';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

initializeReporter();


const logger = electron.remote.getGlobal('logger');
logger.info('The renderer process got the logger');
Vue.use(LoggerPlugin, { logger });

Vue.config.productionTip = process.env.NODE_ENV !== 'production';

new Vue({
  router,
  store,
  vuetify,

  data() {
    return {
      // TODO check
      loaded: true,
    };
  },
  created() {
    logger.info('Vue registered');
    console.log('created', this.$store.restored);
    this.$store.restored.then(() => {
      console.log('loaded');
      this.loaded = true;
    });
  },
  render(h) {
    return this.loaded ? h(App) : h(Splash);
  },
}).$mount('#app');