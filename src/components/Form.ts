/* globals console, Promise */
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';
Components.setComponents(AllComponents);
import FormioForm from 'formiojs/Form';
import Formio from 'formiojs/Formio';

@Component
export class Form extends Vue {
  formio?: any;

  @Prop()
  src?: string;

  @Prop()
  url?: string;

  @Prop()
  form?: object;

  @Prop()
  submission?: object;

  @Prop()
  language?: string;

  @Prop({ default: () => {} })
  options?: object;

  @Watch('src')
  srcChange(value: string) {
    if (this.formio) {
      this.formio.src = value;
    }
  }

  @Watch('url')
  urlChange(value: string) {
    if (this.formio) {
      this.formio.url = value;
    }
  }

  @Watch('form')
  formChange(value: object) {
    if (this.formio) {
      this.formio.form = value;
    }
  }

  @Watch('submission')
  submissionChange(value: object) {
    if (this.formio) {
      this.formio.submission = value;
    }
  }

  @Watch('language')
  languageChange(value: string) {
    if (this.formio) {
      this.formio.language = value;
    }
  }

  mounted() {
    this.initializeForm()
      .then(() => {
        this.setupForm();
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  destroyed() {
    if (this.formio) {
      this.formio.destroy(true);
    }
  }

  initializeForm(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.src) {
        resolve(
          new FormioForm(this.$refs.formio, this.src, this.options)
            .ready
            .then(
              (formio: any): any => {
                this.formio = formio;
                return formio;
              },
            )
            .catch((err: Error) => {
              /* eslint-disable no-console */
              console.error(err);
              /* eslint-enable no-console */
            }),
        );
      } else if (this.form) {
        resolve(
          new FormioForm(this.$refs.formio, this.form, this.options)
            .ready
            .then(
              (formio: any): any => {
                this.formio = formio;
                return formio;
              },
            )
            .catch((err: Error) => {
              /* eslint-disable no-console */
              console.error(err);
              /* eslint-enable no-console */
            }),
        );
      } else {
        // If we get to here there is no src or form
        reject('Must set src or form attribute');
      }
    });
  }

  setupForm() {
    if (!this.formio) {
      return;
    }
    if (this.submission) {
      this.formio.submission = this.submission;
    }

    if (this.url) {
      this.formio.url = this.url;
    }

    this.formio.language = this.language ? this.language : 'en';

    this.formio.events.onAny((...args: any[]) => {
      const eventParts = args[0].split('.');

      // Only handle formio events.
      if (eventParts[0] !== 'formio' || eventParts.length !== 2) {
        return;
      }

      // Remove formio. from event.
      args[0] = eventParts[1];

      this.$emit.apply(this, args);

      // Emit custom events under their own name as well.
      if (eventParts[1] === 'customEvent') {
        args[0] = args[1].type;
        this.$emit.apply(this, args);
      }
    });
  }

  render(createElement: any) {
    return createElement('div', { ref: 'formio' });
  }
}
