import { ref, Ref, onMounted, h } from 'vue';

export default function useFormioRef() {
  const formioRef = ref() as Ref<HTMLElement>;

  const render = () => h('div', { ref: formioRef });

  return {
    formioRef,
    render,
  };
};
