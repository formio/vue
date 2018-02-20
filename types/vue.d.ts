/**
 * Augment the typings of Vue.js
 */

import Vue from "vue";
import formiojs from 'formiojs';

declare module "vue/types/vue" {
  interface Vue {
    $formio: formiojs;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    formio?: formiojs;
  }
}