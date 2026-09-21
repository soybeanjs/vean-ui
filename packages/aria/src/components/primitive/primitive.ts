import { defineComponent, h } from 'vue';
import { Slot } from '../slot';
import type { PrimitiveProps } from './types';

const SELF_CLOSING_TAGS = new Set(['area', 'input', 'img']);

export const Primitive = defineComponent<PrimitiveProps>(
  (props, { slots, attrs }) => {
    const asTag = props.asChild ? 'template' : props.as;

    if (typeof asTag === 'string' && SELF_CLOSING_TAGS.has(asTag)) {
      return () => h(asTag, attrs);
    }

    if (asTag !== 'template') {
      return () => h(props.as || 'div', attrs, { default: slots.default });
    }

    return () => h(Slot, attrs, { default: slots.default });
  },
  {
    name: 'Primitive',
    inheritAttrs: false,
    props: ['as', 'asChild']
  }
);
