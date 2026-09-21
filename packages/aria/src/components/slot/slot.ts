import { Comment, cloneVNode, defineComponent, warn } from 'vue';
import { getRawChildren } from '../../shared';

export const Slot = defineComponent(
  (_, { slots, attrs }) => {
    return () => {
      if (!slots.default) return null;

      const children = getRawChildren(slots.default());
      if (!children?.length) return null;

      // Find first non-comment child
      const firstNonCommentChild = children.find(child => child.type !== Comment);

      // In development, check if there are multiple non-comment children
      if (import.meta.env.DEV && children.filter(child => child.type !== Comment).length > 1) {
        warn('<Slot> can only be used on a single element or component.');
      }

      if (firstNonCommentChild) {
        return cloneVNode(firstNonCommentChild, attrs, true);
      }

      return null;
    };
  },
  {
    name: 'Slot'
  }
);
