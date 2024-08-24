declare module '*.vue' {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare module '@ungap/structured-clone' {
  const structuredClone: any;
  export default structuredClone;
}
