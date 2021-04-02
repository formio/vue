/* globals console, Promise */
import { defineComponent, onMounted, onUnmounted } from 'vue';
import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';
Components.setComponents(AllComponents);

import useFormioRef from '../composables/useFormioRef';
import useInitializeBuilder from '../composables/formBuilder/useInitializeBuilder';

export default defineComponent({
  name: 'FormBuilder',
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, context) {
    const { formioRef, render } = useFormioRef();
    const { builder, initializeBuilder, setupBuilder } = useInitializeBuilder(props, context, {
      formioRef,
    });

    onMounted(() => {
      initializeBuilder()
        .then(() => {
          setupBuilder();
        })
        .catch((err) => {
          /* eslint-disable no-console */
          console.warn(err);
          /* eslint-enable no-console */
        });
    });

    onUnmounted(() => {
      if (builder) {
        builder.value.instance.destroy(true);
      }
    });

    return render;
  },
});
