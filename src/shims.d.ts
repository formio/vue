declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'formiojs' {
  const createForm: (element: any, formOrSrc: any, options: any) => Promise<any>

  export default class Formiojs {
    src: string;
    url: string;
    form: object;
    submission: object;
    destroy: (all: boolean) => null;
    events: {
      onAny: (args: any) => null
    }
  }
};

declare module 'vue-expose-inject';
