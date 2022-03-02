declare module '*.vue' {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare module 'formiojs';

declare module 'formiojs/Formio';
