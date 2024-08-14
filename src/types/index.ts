import {
  EventEmitter,
  Form as FormClass,
  FormBuilder as FormioFormBuilder,
  Webform,
} from '@formio/js';
import { Component, Form as CoreFormType } from '@formio/core';
import { CSSProperties } from 'vue';

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;

export type JSON = string | number | boolean | null | undefined | JSON[] | { [key: string]: JSON };
export type FormOptions = FormClass['options'] & { events?: EventEmitter };
export type FormType = PartialExcept<CoreFormType, 'components'>;
export type FormSource = string | FormType;
export type EventError = string | Error | Error[] | { message: string } | { message: string }[];

export type Submission = {
  data: { [key: string]: JSON };
  metadata?: { [key: string]: JSON };
  state?: string;
} & {
  [key: string]: JSON;
};

export interface FormConstructor {
  new (element: HTMLElement, formSource: FormSource, options: FormOptions): FormClass;
}

export type FormProps = {
  className?: string;
  style?: CSSProperties;
  src?: FormSource;
  url?: string;
  form?: FormType;
  submission?: Submission;
  options?: FormOptions;
  formioform?: FormConstructor;
  FormClass?: FormConstructor;
  formReady?: (instance: Webform) => void;
  onFormReady?: (instance: Webform) => void;
  onPrevPage?: (page: number, submission: Submission) => void;
  onNextPage?: (page: number, submission: Submission) => void;
  onCancelSubmit?: () => void;
  onCancelComponent?: (component: Component) => void;
  onChange?: (value: any, flags: any, modified: boolean) => void;
  onCustomEvent?: (event: {
      type: string;
      component: Component;
      data: { [key: string]: JSON };
      event?: Event;
  }) => void;
  onComponentChange?: (changed: {
      instance: Webform;
      component: Component;
      value: any;
      flags: any;
  }) => void;
  onSubmit?: (submission: Submission, saved?: boolean) => void;
  onSubmitDone?: (submission: Submission) => void;
  onSubmitError?: (error: EventError) => void;
  onFormLoad?: (form: JSON) => void;
  onError?: (error: EventError | false) => void;
  onRender?: (param: any) => void;
  onAttach?: (param: any) => void;
  onBuild?: (param: any) => void;
  onFocus?: (instance: Webform) => void;
  onBlur?: (instance: Webform) => void;
  onInitialized?: () => void;
  onLanguageChanged?: () => void;
  onBeforeSetSubmission?: (submission: Submission) => void;
  onSaveDraftBegin?: () => void;
  onSaveDraft?: (submission: Submission) => void;
  onRestoreDraft?: (submission: Submission | null) => void;
  onSubmissionDeleted?: (submission: Submission) => void;
  onRequestDone?: () => void;
  otherEvents?: { [event: string]: (...args: any[]) => void };
};

export type FormHandlers = Omit<
  FormProps,
  | 'className'
  | 'style'
  | 'src'
  | 'url'
  | 'form'
  | 'submission'
  | 'options'
  | 'formioform'
  | 'FormClass'
  | 'formReady'
>;

export type FormBuilderProps = {
  options?: FormioFormBuilder['options'];
  initialForm?: FormType;
  onBuilderReady?: (builder: FormioFormBuilder) => void;
  onChange?: (form: FormType) => void;
  onSaveComponent?: (
      component: Component,
      original: Component,
      parent: Component,
      path: string,
      index: number,
      isNew: boolean,
      originalComponentSchema: Component,
  ) => void;
  onEditComponent?: (component: Component) => void;
  onUpdateComponent?: (component: Component) => void;
  onDeleteComponent?: (
      component: Component,
      parent: Component,
      path: string,
      index: number,
  ) => void;
};

export type FormBuilderHandlers = Omit<
  FormBuilderProps,
  'options' | 'form' | 'Builder' | 'initialForm'
>;
