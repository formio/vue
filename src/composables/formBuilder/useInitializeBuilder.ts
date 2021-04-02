import { ref } from 'vue';
import FormioFormBuilder from 'formiojs/FormBuilder';
import InitializeFormBuilderOptions from '../../intefaces/formBuilder/initializeFormBuilderOptions';

export default function useInitializeBuilder(props, context, options: InitializeFormBuilderOptions) {
  const _builder = ref(null);

  const setupBuilder = () => {
    _builder.value.instance.events.onAny((...args: any[]) => {
      const eventParts = args[0].split('.');

      // Only handle formio events.
      const namespace: string = props.options.namespace || 'formio';
      if (eventParts[0] !== namespace || eventParts.length !== 2) {
        return;
      }

      // Remove formio. from event.
      args[0] = eventParts[1];

      context.emit(...args);

      // Emit a change event if the schema changes.
      if (['saveComponent', 'updateComponent', 'deleteComponent'].includes(eventParts[1])) {
        args[0] = 'change';
        context.emit(...args);
      }
    });
  };

  const initializeBuilder = (): Promise<any> => {
    if (_builder.value) {
      _builder.instance.destroy(true);
    }

    _builder.value = new FormioFormBuilder(options.formioRef.value, props.form, props.options);
    return _builder.value.ready;
  };

  return {
    builder: _builder,
    initializeBuilder,
    setupBuilder,
  };
};
