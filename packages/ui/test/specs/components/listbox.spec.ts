import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { DOMWrapper, mount } from '@vue/test-utils';
import { ListboxContent, ListboxItem, ListboxRoot } from '@vean/aria/listbox';

const mountListbox = () =>
  mount(
    {
      components: { ListboxRoot, ListboxContent, ListboxItem },
      template: `
        <ListboxRoot highlightOnHover>
          <ListboxContent>
            <ListboxItem value="apple">Apple</ListboxItem>
            <ListboxItem value="banana">Banana</ListboxItem>
            <ListboxItem value="orange">Orange</ListboxItem>
          </ListboxContent>
        </ListboxRoot>
      `
    },
    { attachTo: document.body }
  );

const getOptions = () => Array.from(document.body.querySelectorAll('[role="option"]')) as HTMLElement[];
const isHighlighted = (el: HTMLElement) => el.getAttribute('data-highlighted') !== null;

// Let the root's mount-time highlightSelected (from the modelValue watch) settle before interacting.
const settle = async () => {
  await nextTick();
  await nextTick();
  await nextTick();
};

describe('Listbox highlightOnHover', () => {
  it('highlights an item on hover and clears it on leave', async () => {
    const wrapper = mountListbox();
    await settle();

    const [apple, , orange] = getOptions();

    // The first item is highlighted on mount by highlightSelected.
    expect(isHighlighted(apple)).toBe(true);
    expect(isHighlighted(orange)).toBe(false);

    // Hovering a non-highlighted item highlights it and moves the highlight off the first item.
    await new DOMWrapper(orange).trigger('pointermove');
    await nextTick();

    expect(isHighlighted(orange)).toBe(true);
    expect(isHighlighted(apple)).toBe(false);

    // Moving the pointer away clears the highlight.
    const rootEl = document.body.querySelector('[data-vean-listbox-root]') as HTMLElement;
    await new DOMWrapper(rootEl).trigger('pointerleave');
    await nextTick();

    expect(getOptions().every(option => !isHighlighted(option))).toBe(true);

    wrapper.unmount();
  });

  it('does not highlight an item on hover when highlightOnHover is disabled', async () => {
    const wrapper = mount(
      {
        components: { ListboxRoot, ListboxContent, ListboxItem },
        template: `
          <ListboxRoot>
            <ListboxContent>
              <ListboxItem value="apple">Apple</ListboxItem>
              <ListboxItem value="banana">Banana</ListboxItem>
            </ListboxContent>
          </ListboxRoot>
        `
      },
      { attachTo: document.body }
    );
    await settle();

    const [, banana] = getOptions();
    await new DOMWrapper(banana).trigger('pointermove');
    await nextTick();

    expect(isHighlighted(banana)).toBe(false);

    wrapper.unmount();
  });
});
