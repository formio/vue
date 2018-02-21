import Formio from './components/Formio';
import { Provider } from './Provider';
import formiojs from 'formiojs';
import Vue from 'vue';

// Provide a plugin by default that will register all components.
export class Plugin {
  // Vue Plugin
  static install (Vue: Vue, { providers, store, router }: { providers: Provider[], store: any, router: any }) {
    Vue.$formio = formiojs;

    Vue.component('Formio', Formio);

    providers.forEach(provider => {
      provider.init(Vue);
      provider.registerRoutes(router);
      provider.registerStore(store);
    });
  }
};
