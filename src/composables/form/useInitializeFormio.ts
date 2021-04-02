import { ref } from 'vue';
import FormioForm from 'formiojs/Form';
import InitializeFormOptions from '../../intefaces/form/initializeFormOptions';

export default function useInitializeForm(props, context, options: InitializeFormOptions) {
  const _formio = ref(null);

  const initializeFormWithSrc = (resolve) => {
    resolve(new FormioForm(options.formioRef.value, props.src, props.options)
      .ready
      .then((formio: any): any => {
        _formio.value = formio;
        _formio.value.src = props.src;
        return _formio.value;
      })
      .catch((err: Error) => {
        /* eslint-disable no-console */
        console.error(err);
      }));
  };

  const initializeFormWithForm = (resolve) => {
    resolve(new FormioForm(options.formioRef.value, props.form, props.options)
      .ready
      .then((formio: any): any => {
        _formio.value = formio;
        _formio.value.form = props.form;

        if (props.url) {
          _formio.value.url = props.url;
        }

        return _formio.value;
      })
      .catch((err: Error) => {
        /* eslint-disable no-console */
        console.error(err);
      }));
  };

  const setupForm = () => {
    if (!_formio.value) {
      return;
    }

    if (props.submission) {
      _formio.value.submission = props.submission;
    }

    if (props.url) {
      _formio.value.url = props.url;
    }

    _formio.value.language = props.language ? props.language : 'en';

    _formio.value.events.onAny((...args: any[]) => {
      const eventParts = args[0].split('.');

      // Only handle formio events.
      const namespace: string = props.options.namespace || 'formio';
      if (eventParts[0] !== namespace || eventParts.length !== 2) {
        return;
      }

      // Remove formio. from event.
      args[0] = eventParts[1] as String;

      context.emit(...args);
      // Emit custom events under their own name as well.
      if (eventParts[1] === 'customEvent') {
        args[0] = args[1].type;
        context.emit(...args);
      }
    });
  }

  const initializeForm = (): Promise<any> => new Promise((resolve, reject) => {
    if (props.src) {
      initializeFormWithSrc(resolve);
    } else if (props.form) {
      initializeFormWithForm(resolve);
    } else {
      reject('Must set src of form attribute');
    }
  });

  return {
    formio: _formio,
    initializeForm,
    setupForm,
  };
};
