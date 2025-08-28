import { defineComponent, ref, onMounted, onBeforeUnmount, watch, CSSProperties, PropType, Prop, toRefs, toRaw } from 'vue';
import { EventEmitter, Form as FormClass, Webform } from '@formio/js';
import structuredClone from '@ungap/structured-clone';
import { FormConstructor, FormHandlers, FormProps, FormSource } from '../types';
import useFormioRef from '../composables/useFormioRef';

const getDefaultEmitter = () => {
  return new EventEmitter({
    wildcard: false,
    maxListeners: 0,
  });
};

const onAnyEvent = (
  handlers: FormHandlers,
  ...args: [string, ...any[]]
) => {
  const [event, ...outputArgs] = args;
  if (event.startsWith('formio.')) {
    const funcName = `on${event.charAt(7).toUpperCase()}${event.slice(8)}`;
    switch (funcName) {
      case 'onPrevPage':
        if (handlers.onPrevPage) handlers.onPrevPage(outputArgs[0], outputArgs[1]);
        break;
      case 'onNextPage':
        if (handlers.onNextPage) handlers.onNextPage(outputArgs[0], outputArgs[1]);
        break;
      case 'onCancelSubmit':
        if (handlers.onCancelSubmit) handlers.onCancelSubmit();
        break;
      case 'onCancelComponent':
        if (handlers.onCancelComponent) handlers.onCancelComponent(outputArgs[0]);
        break;
      case 'onChange':
        if (handlers.onChange) handlers.onChange(outputArgs[0], outputArgs[1], outputArgs[2]);
        break;
      case 'onCustomEvent':
        if (handlers.onCustomEvent) handlers.onCustomEvent(outputArgs[0]);
        break;
      case 'onComponentChange':
        if (handlers.onComponentChange) handlers.onComponentChange(outputArgs[0]);
        break;
      case 'onSubmit':
        if (handlers.onSubmit) handlers.onSubmit(outputArgs[0], outputArgs[1]);
        break;
      case 'onSubmitDone':
        if (handlers.onSubmitDone) handlers.onSubmitDone(outputArgs[0]);
        break;
      case 'onSubmitError':
        if (handlers.onSubmitError) handlers.onSubmitError(outputArgs[0]);
        break;
      case 'onFormLoad':
        if (handlers.onFormLoad) handlers.onFormLoad(outputArgs[0]);
        break;
      case 'onError':
        if (handlers.onError) handlers.onError(outputArgs[0]);
        break;
      case 'onRender':
        if (handlers.onRender) handlers.onRender(outputArgs[0]);
        break;
      case 'onAttach':
        if (handlers.onAttach) handlers.onAttach(outputArgs[0]);
        break;
      case 'onBuild':
        if (handlers.onBuild) handlers.onBuild(outputArgs[0]);
        break;
      case 'onFocus':
        if (handlers.onFocus) handlers.onFocus(outputArgs[0]);
        break;
      case 'onBlur':
        if (handlers.onBlur) handlers.onBlur(outputArgs[0]);
        break;
      case 'onInitialized':
        if (handlers.onInitialized) handlers.onInitialized();
        break;
      case 'onLanguageChanged':
        if (handlers.onLanguageChanged) handlers.onLanguageChanged();
        break;
      case 'onBeforeSetSubmission':
        if (handlers.onBeforeSetSubmission) handlers.onBeforeSetSubmission(outputArgs[0]);
        break;
      case 'onSaveDraftBegin':
        if (handlers.onSaveDraftBegin) handlers.onSaveDraftBegin();
        break;
      case 'onSaveDraft':
        if (handlers.onSaveDraft) handlers.onSaveDraft(outputArgs[0]);
        break;
      case 'onRestoreDraft':
        if (handlers.onRestoreDraft) handlers.onRestoreDraft(outputArgs[0]);
        break;
      case 'onSubmissionDeleted':
        if (handlers.onSubmissionDeleted) handlers.onSubmissionDeleted(outputArgs[0]);
        break;
      case 'onRequestDone':
        if (handlers.onRequestDone) handlers.onRequestDone();
        break;
      default:
        break;
    }
  }
  if (handlers.otherEvents && handlers.otherEvents[event]) {
    handlers.otherEvents[event](...outputArgs);
  }
};

const createWebformInstance = async (
  FormConstructor: FormConstructor | undefined,
  formSource: FormSource,
  element: HTMLDivElement,
  options: FormProps['options'] = {}
) => {
  if (!options?.events) {
    options.events = getDefaultEmitter();
  }
  if (typeof formSource !== 'string') {
    formSource = structuredClone(toRaw(formSource));
  }
  const promise = FormConstructor
    ? new FormConstructor(element, formSource, options)
    : new FormClass(element, formSource, options);
  const instance = await promise.ready;
  return instance;
};

const getEffectiveProps = (props: FormProps) => {
  const { FormClass, formioform, form, src, formReady, onFormReady } = props;
  const formConstructor = FormClass !== undefined ? FormClass : formioform;
  const formSource = form !== undefined ? form : src;
  const formReadyCallback = onFormReady !== undefined ? onFormReady : formReady;
  return { formConstructor, formSource, formReadyCallback };
};

export const Form = defineComponent({
  name: 'FormComponent',
  props: {
    className: String as PropType<FormProps['className']>,
    style: Object as PropType<FormProps['style']>,
    src: [String, Object] as PropType<FormProps['src']>,
    url: String as PropType<FormProps['url']>,
    form: Object as PropType<FormProps['form']>,
    submission: Object as PropType<FormProps['submission']>,
    options: Object as PropType<FormProps['options']>,
    formioform: Object as PropType<FormProps['formioform']>,
    FormClass: Object as PropType<FormProps['FormClass']>,
    formReady: Function as PropType<FormProps['formReady']>,
    onFormReady: Function as PropType<FormProps['onFormReady']>,
    onPrevPage: Function as PropType<FormProps['onPrevPage']>,
    onNextPage: Function as PropType<FormProps['onNextPage']>,
    onCancelSubmit: Function as PropType<FormProps['onCancelSubmit']>,
    onCancelComponent: Function as PropType<FormProps['onCancelComponent']>,
    onChange: Function as PropType<FormProps['onChange']>,
    onCustomEvent: Function as PropType<FormProps['onCustomEvent']>,
    onComponentChange: Function as PropType<FormProps['onComponentChange']>,
    onSubmit: Function as PropType<FormProps['onSubmit']>,
    onSubmitDone: Function as PropType<FormProps['onSubmitDone']>,
    onSubmitError: Function as PropType<FormProps['onSubmitError']>,
    onFormLoad: Function as PropType<FormProps['onFormLoad']>,
    onError: Function as PropType<FormProps['onError']>,
    onRender: Function as PropType<FormProps['onRender']>,
    onAttach: Function as PropType<FormProps['onAttach']>,
    onBuild: Function as PropType<FormProps['onBuild']>,
    onFocus: Function as PropType<FormProps['onFocus']>,
    onBlur: Function as PropType<FormProps['onBlur']>,
    onInitialized: Function as PropType<FormProps['onInitialized']>,
    onLanguageChanged: Function as PropType<FormProps['onLanguageChanged']>,
    onBeforeSetSubmission: Function as PropType<FormProps['onBeforeSetSubmission']>,
    onSaveDraftBegin: Function as PropType<FormProps['onSaveDraftBegin']>,
    onSaveDraft: Function as PropType<FormProps['onSaveDraft']>,
    onRestoreDraft: Function as PropType<FormProps['onRestoreDraft']>,
    onSubmissionDeleted: Function as PropType<FormProps['onSubmissionDeleted']>,
    onRequestDone: Function as PropType<FormProps['onRequestDone']>,
    otherEvents: Object as PropType<FormProps['otherEvents']>,
  },
  setup(props, context) {
    const { formioRef, render } = useFormioRef();
    const formInstance = ref<Webform | null>(null);
    const instanceIsReady = ref(false);

    const {
      src,
      form,
      submission,
      url,
      options,
      formioform,
      formReady,
      FormClass,
      style,
      className,
      ...handlers
    } = props;

    const createInstance = async () => {
      const { formConstructor, formSource, formReadyCallback } = getEffectiveProps(props);

      if (formioRef.value === null) {
        console.warn('Form element not found');
        return;
      }
      if (typeof formSource === 'undefined') {
        console.warn('Form source not found');
        return;
      }
      const instance = await createWebformInstance(formConstructor, formSource, formioRef.value, props.options);
      if (instance) {
        if (typeof formSource === 'string') {
          instance.src = formSource;
        } else if (typeof formSource === 'object') {
          instance.form = formSource;
          if (props.url) {
            instance.url = props.url;
          }
        }
        formReadyCallback?.(instance);
        formInstance.value = instance;
        instanceIsReady.value = true;
      } else {
        console.warn('Failed to create form instance');
      }
    };

    const cleanupInstance = () => {
      instanceIsReady.value = false;
      if (formInstance.value) {
        formInstance.value.destroy(true);
      }
    };

    onMounted(() => {
      createInstance();
    });

    onBeforeUnmount(() => {
      cleanupInstance();
    });

    watch(
      () => [
        props.FormClass,
        props.formioform,
        props.onFormReady,
        props.formReady,
        props.src,
        props.options,
        props.url,
      ],
      () => {
        if (instanceIsReady.value) {
          cleanupInstance();
        }
        createInstance();
      },
    );

    // Handle form schema updates intelligently
    watch(
      () => props.form,
      (newForm, oldForm) => {
        if (instanceIsReady.value && formInstance.value && newForm && oldForm) {
          // Update the form schema without recreating the instance
          formInstance.value.form = newForm;
          // Trigger a rebuild to apply schema changes
          formInstance.value.build();
        } else if (
          instanceIsReady.value &&
          formInstance.value &&
          newForm &&
          !oldForm
        ) {
          // Initial form load
          formInstance.value.form = newForm;
        }
      },
      { deep: true },
    );

    watch(
      () => [
        instanceIsReady.value,
        props.submission
      ],
      () => {
        if (instanceIsReady.value && formInstance.value && props.submission) {
          formInstance.value.submission = props.submission;
        }
      }
    );

    watch(
      () => [
        instanceIsReady.value,
        handlers,
      ],
      (newValue, oldValue, onCleanup) => {
        if (instanceIsReady.value && formInstance.value && Object.keys(handlers).length > 0) {
          formInstance.value.onAny((...args: [string, ...any[]]) => onAnyEvent(handlers, ...args));
        }
        onCleanup(() => {
          if (instanceIsReady.value && formInstance.value && Object.keys(handlers).length > 0) {
            formInstance.value.offAny((...args: [string, ...any[]]) => onAnyEvent(handlers, ...args));
          }
        });
      },
      { immediate: true }
    );

    context.expose({ formio: formInstance });

    return render;
  }
});
