import Vue from 'vue';
import Formio from 'formiojs';
import * as components from './components';
export * from './components';

// Vue.$formio = Formio;

Object.keys(components).forEach((name) => {
  Vue.component(name, components[name]);
});

export {Components, Formio, Utils, Templates} from 'formiojs';
