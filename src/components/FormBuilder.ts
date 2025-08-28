import { defineComponent, h, onMounted, onBeforeUnmount, ref, watch, PropType, toRaw } from 'vue';
import { FormBuilder as FormioFormBuilder } from '@formio/js';
import { Component } from '@formio/core';
import { cloneDeep as structuredClone } from 'lodash';
import { FormBuilderHandlers, FormBuilderProps, FormType } from '../types';
import useFormioRef from '../composables/useFormioRef';

const toggleEventHandlers = (
  builder: FormioFormBuilder,
  handlers: FormBuilderHandlers,
  shouldAttach: boolean = true,
) => {
  const fn = shouldAttach ? 'on' : 'off';
  const {
    onSaveComponent,
    onEditComponent,
    onUpdateComponent,
    onDeleteComponent,
    onChange,
  } = handlers;
  builder.instance[fn](
    'saveComponent',
    (
      component: Component,
      original: Component,
      parent: Component,
      path: string,
      index: number,
      isNew: boolean,
      originalComponentSchema: Component,
    ) => {
      onSaveComponent?.(
        component,
        original,
        parent,
        path,
        index,
        isNew,
        originalComponentSchema,
      );
      onChange?.(structuredClone(toRaw(builder.instance.form)));
    },
  );
  builder.instance[fn]('updateComponent', (component: Component) => {
    onUpdateComponent?.(component);
    onChange?.(structuredClone(toRaw(builder.instance.form)));
  });
  builder.instance[fn](
    'removeComponent',
    (
      component: Component,
      parent: Component,
      path: string,
      index: number,
    ) => {
      onDeleteComponent?.(component, parent, path, index);
      onChange?.(structuredClone(toRaw(builder.instance.form)));
    },
  );

  builder.instance[fn]('cancelComponent', (component: Component) => {
    onUpdateComponent?.(component);
    onChange?.(structuredClone(toRaw(builder.instance.form)));
  });

  builder.instance[fn]('editComponent', (component: Component) => {
    onEditComponent?.(component);
    onChange?.(structuredClone(toRaw(builder.instance.form)));
  });

  builder.instance[fn]('addComponent', () => {
    onChange?.(structuredClone(toRaw(builder.instance.form)));
  });

  builder.instance[fn]('pdfUploaded', () => {
    onChange?.(structuredClone(toRaw(builder.instance.form)));
  });
};

const createBuilderInstance = async (
  element: HTMLDivElement,
  form: FormType = { display: 'form', components: [] },
  options: FormBuilderProps['options'] = {},
): Promise<FormioFormBuilder> => {
  options = Object.assign({}, options);
  form = Object.assign({}, form);

  const instance = new FormioFormBuilder(element, form, options);

  await instance.ready;
  return instance;
};

const DEFAULT_FORM: FormType = { display: 'form' as const, components: [] };

export const FormBuilder = defineComponent({
  name: 'FormBuilder',
  props: {
    options: Object as PropType<FormBuilderProps['options']>,
    initialForm: {
      type: Object as PropType<FormType>,
      default: () => DEFAULT_FORM,
    },
    onBuilderReady: Function as PropType<FormBuilderProps['onBuilderReady']>,
    onChange: Function as PropType<FormBuilderProps['onChange']>,
    onSaveComponent: Function as PropType<FormBuilderProps['onSaveComponent']>,
    onEditComponent: Function as PropType<FormBuilderProps['onEditComponent']>,
    onUpdateComponent: Function as PropType<FormBuilderProps['onUpdateComponent']>,
    onDeleteComponent: Function as PropType<FormBuilderProps['onDeleteComponent']>,
  },
  setup(props, context) {
    const { formioRef, render } = useFormioRef();
    const builder = ref<FormioFormBuilder | null>(null);
    const instanceIsReady = ref(false);

    const createInstance = async () => {
      if (!formioRef.value) {
        console.warn(
          'FormBuilder render element not found, cannot render builder.',
        );
        return;
      }
      const instance = await createBuilderInstance(
        formioRef.value,
        structuredClone(props.initialForm),
        props.options,
      );
      if (instance) {
        if (props.onBuilderReady) {
          props.onBuilderReady(instance);
        }
        builder.value = instance;
        instanceIsReady.value = true;
      } else {
        console.warn('Failed to create FormBuilder instance');
      }
    };

    const cleanupInstance = () => {
      instanceIsReady.value = false;
      if (builder.value) {
        builder.value.instance.destroy(true);
      }
    }

    watch(
      () => [
        props.initialForm,
        props.options,
        props.onBuilderReady,
      ],
      () => {
        if (instanceIsReady.value) {
          cleanupInstance();
        }
        createInstance();
      },
    );

    onMounted(() => {
      createInstance();
    });

    onBeforeUnmount(() => {
      cleanupInstance();
    });

    watch(
      () => [
        props.initialForm,
        props.options,
        props.onBuilderReady,
      ],
      () => {
        if (instanceIsReady.value) {
          cleanupInstance();
        }
        createInstance();
      },
    );

    watch(
      () => [
        instanceIsReady.value,
        props.onChange,
        props.onDeleteComponent,
        props.onEditComponent,
        props.onSaveComponent,
        props.onUpdateComponent,
      ],
      (newValues, oldValues, onCleanup) => {
        if (instanceIsReady.value && builder.value) {
          toggleEventHandlers(builder.value, {
            onChange: props.onChange,
            onDeleteComponent: props.onDeleteComponent,
            onEditComponent: props.onEditComponent,
            onSaveComponent: props.onSaveComponent,
            onUpdateComponent: props.onUpdateComponent,
          });
        }

        onCleanup(() => {
          if (instanceIsReady.value && builder.value) {
            toggleEventHandlers(
              builder.value,
              {
                onChange: props.onChange,
                onDeleteComponent: props.onDeleteComponent,
                onEditComponent: props.onEditComponent,
                onSaveComponent: props.onSaveComponent,
                onUpdateComponent: props.onUpdateComponent,
              },
              false,
            );
          }
        });
      },
      { immediate: true },
    );

    context.expose({ builder });

    return render;
  },
});
