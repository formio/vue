declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue/types/vue' {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor {
    $formio: any
  }
}

// ComponentOptions is declared in types/options.d.ts
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    formio?: any
  }
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
