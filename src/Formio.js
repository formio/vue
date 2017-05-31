import Vue from 'vue';
import { FormioFactory } from 'formiojs/factory';

export const Formio = {
  props: {
    src: {
      type: String
    },
    form: {
      type: Object
    },
    submission: {
      type: Object
    },
    options: {
      type: Object,
      default: {}
    }
  },

  mounted() {
    if (this.src) {
      this.createPromise = FormioFactory.createForm(this.$refs.formio, this.src, this.options).then(formio => this.formio = formio);
    }
    if (this.form) {
      this.createPromise = FormioFactory.createForm(this.$refs.formio, this.form, this.options).then(formio => this.formio = formio);
    }
    this.initializeFormio();
  },

  watch: {
    src: function(value) {
      this.createPromise = FormioFactory.createForm(this.element, value, this.options).then(formio => this.formio = formio);
      this.initializeFormio();
    },
    form: function(value) {
      this.createPromise = FormioFactory.createForm(this.element, value, this.options).then(formio => this.formio = formio);
      this.initializeFormio();
    },
    submission: function(value) {
      this.formio.submission = value;
    }
  },

  initializeFormio() {
    if (this.createPromise) {
      this.createPromise.then(() => {
        if (this.submission) {
          this.formio.submission = this.submission;
        }
        this.formio.on('prevPage', this.emit('prevPage'));
        this.formio.on('nextPage', this.emit('nextPage'));
        this.formio.on('change', this.emit('change'));
        this.formio.on('customEvent', this.emit('customEvent'));
        this.formio.on('submit', this.emit('submit'));
        this.formio.on('submitDone', this.emit('submitDone'));
        this.formio.on('error', this.emit('error'));
        this.formio.on('render', this.emit('render'));
      });
    }
  },

  emit(eventName) {
    return (...args) => {
      this.$emit(eventName, ...args);
    }
  },

  template: '<div ref="formio" />'
};

Vue.component('formio', Formio);