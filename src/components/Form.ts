import { defineComponent, onMounted, onUnmounted } from 'vue';
import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';
Components.setComponents(AllComponents);

import useFormioRef from '../composables/useFormioRef';
import useInitializeForm from '../composables/form/useInitializeFormio';

export default defineComponent({
  name: 'Form',
  props: {
    src: String,
    url: String,
    form: Object,
    submission: Object,
    language: String,
    options: {
      type: Object,
      default: () => ({ }),
    },
  },
  setup(props, context) {
    const { formioRef, render } = useFormioRef();
    const { formio, initializeForm, setupForm } = useInitializeForm(props, context, {
      formioRef,
    });

    onMounted(() => {
      initializeForm()
        .then(() => {
          setupForm();
        })
        .catch((err) => {
          console.warn(err);
        });
    });

    onUnmounted(() => {
      if (formio.value) {
        formio.value.destroy(true);
      }
    });

    return render;
  },
});
