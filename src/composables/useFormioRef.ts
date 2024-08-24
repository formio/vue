import { ref, Ref, h } from 'vue';

export default function useFormioRef() {
  const formioRef = ref() as Ref<HTMLDivElement>;

  const render = () => h('div', { ref: formioRef });

  return {
    formioRef,
    render,
  };
};
