import Formio from './components/Formio';
import { registerProviders, Provider } from './Provider';
import formiojs from 'formiojs';
import Vue from 'vue';

// Provide a plugin by default that will register all components.
export class Plugin {
  // Vue Plugin
  static install (Vue: Vue, { providers }: { providers: Provider[] }) {
    Vue.$formio = formiojs;

    Vue.component('Formio', Formio);
  }
};
