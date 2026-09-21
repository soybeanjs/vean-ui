import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import SCascader from '@/components/cascader/cascader.vue';
import { MockResizeObserver, setupMock } from '../../shared';
import { getA11yViolations } from '../../shared/a11y';

const options = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '滨江区', value: 'binjiang' }
        ]
      },
      { label: '宁波', value: 'ningbo', children: [{ label: '海曙区', value: 'haishu' }] }
    ]
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        label: '南京',
        value: 'nanjing',
        children: [
          { label: '鼓楼区', value: 'gulou' },
          { label: '玄武区', value: 'xuanwu' }
        ]
      }
    ]
  }
];

const mockHTMLElementProp = <K extends keyof HTMLElement>(property: K, value: HTMLElement[K]) => {
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, property);

  Object.defineProperty(window.HTMLElement.prototype, property, {
    configurable: true,
    value
  });

  return () => {
    if (descriptor) {
      Object.defineProperty(window.HTMLElement.prototype, property, descriptor);
      return;
    }

    Reflect.deleteProperty(window.HTMLElement.prototype, property);
  };
};

let cleanupFunctions: Array<() => void> = [];

beforeEach(() => {
  cleanupFunctions = [
    mockHTMLElementProp('releasePointerCapture', vi.fn() as HTMLElement['releasePointerCapture']),
    mockHTMLElementProp('hasPointerCapture', vi.fn(() => false) as HTMLElement['hasPointerCapture']),
    mockHTMLElementProp('scrollIntoView', vi.fn() as HTMLElement['scrollIntoView'])
  ];
  cleanupFunctions.push(setupMock('ResizeObserver', MockResizeObserver as typeof ResizeObserver));
});

afterEach(() => {
  while (cleanupFunctions.length) {
    cleanupFunctions.pop()?.();
  }

  document.body.innerHTML = '';
});

const findTreeItem = (text: string) =>
  Array.from(document.body.querySelectorAll('[role="treeitem"]')).find(node => node.textContent?.includes(text));

describe('SCascader', () => {
  describe('rendering', () => {
    it('renders placeholder text', () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          placeholder: '请选择区域'
        },
        attachTo: document.body
      });

      expect(wrapper.get('[role="combobox"]').text()).toContain('请选择区域');
      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('opens the panel and shows the root column on click', async () => {
      const wrapper = mount(SCascader, {
        props: { options },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      expect(document.body.querySelector('[role="tree"]')).toBeTruthy();
      expect(document.body.textContent).toContain('浙江');
      expect(document.body.textContent).toContain('江苏');
      wrapper.unmount();
    });

    it('expands the linked column and emits update:modelValue when selecting a leaf', async () => {
      const wrapper = mount(SCascader, {
        props: { options },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const province = findTreeItem('浙江');
      expect(province).toBeTruthy();

      await new DOMWrapper(province as Element).trigger('click');
      await nextTick();

      // The children column of 浙江 appears next to the root column.
      expect(document.body.textContent).toContain('杭州');
      expect(document.body.textContent).toContain('宁波');

      const city = findTreeItem('宁波');
      await new DOMWrapper(city as Element).trigger('click');
      await nextTick();

      const district = findTreeItem('海曙区');
      expect(district).toBeTruthy();

      await new DOMWrapper(district as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['haishu']);
      wrapper.unmount();
    });

    it('emits a path value in path mode', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          pathMode: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const province = findTreeItem('江苏');
      await new DOMWrapper(province as Element).trigger('click');
      await nextTick();

      const city = findTreeItem('南京');
      await new DOMWrapper(city as Element).trigger('click');
      await nextTick();

      const district = findTreeItem('鼓楼区');
      await new DOMWrapper(district as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['jiangsu', 'nanjing', 'gulou']]);
      wrapper.unmount();
    });

    it('treats a bare `path-mode` attribute as enabled (generic boolean casting)', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          pathMode: '' as unknown as boolean
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const province = findTreeItem('浙江');
      await new DOMWrapper(province as Element).trigger('click');
      await nextTick();

      const city = findTreeItem('杭州');
      await new DOMWrapper(city as Element).trigger('click');
      await nextTick();

      const district = findTreeItem('西湖区');
      await new DOMWrapper(district as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['zhejiang', 'hangzhou', 'xihu']]);
      wrapper.unmount();
    });

    it('closes the panel after selecting a leaf in single mode', async () => {
      const wrapper = mount(SCascader, {
        props: { options },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const province = findTreeItem('浙江');
      await new DOMWrapper(province as Element).trigger('click');
      await nextTick();

      const city = findTreeItem('宁波');
      await new DOMWrapper(city as Element).trigger('click');
      await nextTick();

      const district = findTreeItem('海曙区');
      await new DOMWrapper(district as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['haishu']);
      // Single selection of a leaf closes the panel.
      expect(document.body.querySelector('[role="tree"]')).toBeNull();
      wrapper.unmount();
    });

    it('reflects the single-selected leaf with aria-selected and data-state', async () => {
      const wrapper = mount(SCascader, {
        props: { options },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      await new DOMWrapper(findTreeItem('浙江') as Element).trigger('click');
      await nextTick();
      await new DOMWrapper(findTreeItem('宁波') as Element).trigger('click');
      await nextTick();

      const district = findTreeItem('海曙区');
      await new DOMWrapper(district as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      // Re-open to inspect the selected treeitem attributes.
      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const selected = findTreeItem('海曙区');
      expect(selected).toBeTruthy();
      expect(selected?.getAttribute('aria-selected')).toBe('true');
      expect(selected?.getAttribute('data-state')).toBe('selected');
      expect(selected?.getAttribute('data-selected')).toBeDefined();

      wrapper.unmount();
    });

    it('marks only the ancestors of the selected node with data-child-selected', async () => {
      const wrapper = mount(SCascader, {
        props: { options },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      // Expand 浙江 to reveal the second column.
      await new DOMWrapper(findTreeItem('浙江') as Element).trigger('click');
      await nextTick();

      // Hovering a child without selecting must not emphasize its parents.
      const hangzhou = findTreeItem('杭州');
      expect(hangzhou).toBeTruthy();
      await new DOMWrapper(hangzhou as Element).trigger('pointermove');
      await nextTick();
      expect(findTreeItem('浙江')?.getAttribute('data-child-selected')).toBeNull();

      // Selecting a leaf marks its ancestors (breadcrumb emphasis).
      await new DOMWrapper(findTreeItem('杭州') as Element).trigger('click');
      await nextTick();
      await new DOMWrapper(findTreeItem('西湖区') as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      // Single selection closed the panel; reopen to inspect the columns.
      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      expect(findTreeItem('浙江')?.getAttribute('data-child-selected')).toBe('');
      expect(findTreeItem('杭州')?.getAttribute('data-child-selected')).toBe('');
      expect(findTreeItem('江苏')?.getAttribute('data-child-selected')).toBeNull();
      wrapper.unmount();
    });

    it('marks leaf options with data-leaf and non-leaf options without it', async () => {
      const wrapper = mount(SCascader, {
        props: { options },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      // Root nodes are non-leaf, so no data-leaf.
      expect(findTreeItem('浙江')?.getAttribute('data-leaf')).toBeNull();
      expect(findTreeItem('江苏')?.getAttribute('data-leaf')).toBeNull();

      // Drill down to a leaf.
      await new DOMWrapper(findTreeItem('浙江') as Element).trigger('click');
      await nextTick();
      await new DOMWrapper(findTreeItem('宁波') as Element).trigger('click');
      await nextTick();

      const district = findTreeItem('海曙区');
      expect(district).toBeTruthy();
      expect(district?.getAttribute('data-leaf')).toBe('');
      wrapper.unmount();
    });

    it('selects a node with ArrowDown + Enter in checkStrictly mode', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          checkStrictly: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const trigger = wrapper.get('[role="combobox"]');
      await trigger.trigger('keydown', { key: 'ArrowDown' });
      await trigger.trigger('keydown', { key: 'Enter' });
      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['zhejiang']);
      wrapper.unmount();
    });

    it('closes the panel after selecting a leaf via keyboard Enter', async () => {
      const wrapper = mount(SCascader, {
        props: { options },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();
      expect(document.body.querySelector('[role="tree"]')).toBeTruthy();

      const trigger = wrapper.get('[role="combobox"]');
      // Drill down to the leaf: 浙江 -> 杭州 -> 西湖区.
      await trigger.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();
      await trigger.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await trigger.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await trigger.trigger('keydown', { key: 'Enter' });
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['xihu']);
      // The single leaf selection completes the interaction and closes the panel.
      expect(document.body.querySelector('[role="tree"]')).toBeNull();
      wrapper.unmount();
    });
  });

  describe('multiple', () => {
    it('toggles sibling nodes independently and emits an array', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          multiple: true,
          checkStrictly: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const zhejiang = findTreeItem('浙江');
      await new DOMWrapper(zhejiang as Element).trigger('click');
      await nextTick();
      await nextTick();

      const jiangsu = findTreeItem('江苏');
      await new DOMWrapper(jiangsu as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['zhejiang', 'jiangsu']]);
      wrapper.unmount();
    });

    it('treats a bare `multiple` attribute as enabled (generic boolean casting)', async () => {
      // Vue cannot infer a runtime Boolean type for generic `M`, so a bare attribute
      // reaches the component as `''`; it must be treated as `true`.
      const wrapper = mount(SCascader, {
        props: {
          options,
          multiple: '' as unknown as boolean,
          checkStrictly: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const zhejiang = findTreeItem('浙江');
      await new DOMWrapper(zhejiang as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['zhejiang']]);
      wrapper.unmount();
    });

    it('renders a tag remove button with a localized accessible label', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          multiple: true,
          checkStrictly: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const zhejiang = findTreeItem('浙江');
      await new DOMWrapper(zhejiang as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      const removeButton = document.body.querySelector('[data-vean-cascader-tag] button');
      expect(removeButton).toBeTruthy();
      // Default locale is `en`: the template substitutes `{label}` with the node label.
      expect(removeButton?.getAttribute('aria-label')).toBe('Remove 浙江');
      wrapper.unmount();
    });

    it('removes a single tag and updates the model value', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          multiple: true,
          checkStrictly: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const zhejiang = findTreeItem('浙江');
      await new DOMWrapper(zhejiang as Element).trigger('click');
      await nextTick();

      const jiangsu = findTreeItem('江苏');
      await new DOMWrapper(jiangsu as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['zhejiang', 'jiangsu']]);

      // Remove the 浙江 tag: the 江苏 selection remains.
      const zhejiangRemove = Array.from(document.body.querySelectorAll('[data-vean-cascader-tag] button')).find(
        button => button.getAttribute('aria-label') === 'Remove 浙江'
      );
      await new DOMWrapper(zhejiangRemove as Element).trigger('click');
      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['jiangsu']]);
      wrapper.unmount();
    });

    it('clears all tags via the clear button and emits clear', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          multiple: true,
          checkStrictly: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const zhejiang = findTreeItem('浙江');
      await new DOMWrapper(zhejiang as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(document.body.querySelector('[data-vean-cascader-tag]')).toBeTruthy();

      const clearButton = document.body.querySelector('[data-vean-cascader-clear]');
      expect(clearButton).toBeTruthy();
      await new DOMWrapper(clearButton as Element).trigger('click');
      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]]);
      expect(wrapper.emitted('clear')).toHaveLength(1);
      expect(document.body.querySelector('[data-vean-cascader-tag]')).toBeNull();
      wrapper.unmount();
    });

    it('expands a node via its arrow without toggling the check state', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          multiple: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const zhejiang = findTreeItem('浙江');
      expect(zhejiang).toBeTruthy();
      const arrow = zhejiang?.querySelector('[data-vean-cascader-option-arrow]');
      expect(arrow).toBeTruthy();

      await new DOMWrapper(arrow as Element).trigger('click');
      await nextTick();

      // The children column is expanded...
      expect(document.body.textContent).toContain('杭州');
      // ...but the click on the expand icon must not toggle the selection.
      expect(document.body.querySelector('[data-vean-cascader-tag]')).toBeNull();
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      wrapper.unmount();
    });

    it('selects a second-level node independently under a checked parent (checkStrictly + parent strategy)', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          multiple: true,
          checkStrictly: true,
          showCheckedStrategy: 'parent'
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      // Select the top-level 浙江 first.
      await new DOMWrapper(findTreeItem('浙江') as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      // Then select its second-level child 杭州 independently.
      const hangzhou = findTreeItem('杭州');
      expect(hangzhou).toBeTruthy();
      await new DOMWrapper(hangzhou as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      // checkStrictly keeps both nodes: the parent fold must not drop 杭州.
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['zhejiang', 'hangzhou']]);
      expect(findTreeItem('杭州')?.getAttribute('data-state')).toBe('selected');
      wrapper.unmount();
    });

    it('marks a fully checked non-leaf parent with data-selected (selected background applies to parents too)', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          multiple: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      // Checking a parent in non-strict mode checks the whole subtree; the
      // non-leaf parent itself is selected and must carry data-selected so
      // the selected background (not only the font color) applies to it.
      await new DOMWrapper(findTreeItem('浙江') as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      const parent = findTreeItem('浙江');
      expect(parent?.getAttribute('data-selected')).toBe('');
      expect(parent?.getAttribute('data-state')).toBe('selected');
      expect(parent?.getAttribute('data-leaf')).toBeNull();
      wrapper.unmount();
    });

    it('selects a leaf independently and marks parent rows as indeterminate', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          multiple: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      // Expand 浙江 and 杭州 via their arrows (expanding must not select).
      await new DOMWrapper(findTreeItem('浙江')?.querySelector('[data-vean-cascader-option-arrow]') as Element).trigger(
        'click'
      );
      await nextTick();
      await new DOMWrapper(findTreeItem('杭州')?.querySelector('[data-vean-cascader-option-arrow]') as Element).trigger(
        'click'
      );
      await nextTick();

      // Select a single leaf.
      await new DOMWrapper(findTreeItem('西湖区') as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      const selected = findTreeItem('西湖区');
      expect(selected?.getAttribute('data-selected')).toBe('');
      expect(selected?.getAttribute('data-leaf')).toBe('');
      // Parent rows are indeterminate and not independently selected.
      expect(findTreeItem('杭州')?.getAttribute('data-state')).toBe('indeterminate');
      expect(findTreeItem('杭州')?.getAttribute('data-selected')).toBeNull();
      wrapper.unmount();
    });
  });

  describe('filterable', () => {
    it('filters the flat results while typing', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          filterable: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const input = document.body.querySelector<HTMLInputElement>('input');
      expect(input).toBeTruthy();

      await new DOMWrapper(input as Element).setValue('西湖');
      await flushPromises();
      await nextTick();

      expect(document.body.querySelector('[role="treeitem"]')?.textContent).toContain('西湖区');
      expect(document.body.textContent).not.toContain('宁波');
      wrapper.unmount();
    });

    it('shows the selected content in the input and fades it on focus', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          filterable: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const input = document.body.querySelector<HTMLInputElement>('[data-vean-cascader-search-input]');
      expect(input).toBeTruthy();

      await new DOMWrapper(input as Element).setValue('西湖');
      await flushPromises();
      await nextTick();

      await new DOMWrapper(findTreeItem('西湖区') as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      // After selection the input shows the selected path instead of the search text.
      expect(input?.value).toBe('浙江 / 杭州 / 西湖区');

      // Focusing the input frees the value for a fresh search: the selection
      // moves to the placeholder so it only fades in the background.
      await new DOMWrapper(input as Element).trigger('focus');
      await nextTick();
      expect(input?.value).toBe('');
      expect(input?.getAttribute('placeholder')).toBe('浙江 / 杭州 / 西湖区');
      wrapper.unmount();
    });

    it('labels the search input with an accessible name', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          filterable: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const input = document.body.querySelector<HTMLInputElement>('[data-vean-cascader-search-input]');
      expect(input).toBeTruthy();
      // Default locale is `en`.
      expect(input?.getAttribute('aria-label')).toBe('Search');
      wrapper.unmount();
    });

    it('re-expands to the selected node on every reopen', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          filterable: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const input = document.body.querySelector<HTMLInputElement>('input');
      await new DOMWrapper(input as Element).setValue('西湖');
      await flushPromises();
      await nextTick();

      await new DOMWrapper(findTreeItem('西湖区') as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      // The leaf selection closed the panel.
      expect(document.body.querySelector('[role="tree"]')).toBeNull();

      const reopenAndAssertColumns = async () => {
        await new DOMWrapper(input as Element).trigger('focus');
        await nextTick();
        await nextTick();

        // The panel reopens expanded to the selected path, not just the root column.
        expect(findTreeItem('杭州')).toBeTruthy();
        expect(findTreeItem('西湖区')).toBeTruthy();
        expect(findTreeItem('西湖区')?.getAttribute('data-selected')).toBe('');

        // Close again (trigger toggle) to cycle the panel state.
        await wrapper.get('[role="combobox"]').trigger('click');
        await nextTick();
        await nextTick();
        expect(document.body.querySelector('[role="tree"]')).toBeNull();
      };

      await reopenAndAssertColumns();
      await reopenAndAssertColumns();
      wrapper.unmount();
    });

    it('shows the localized empty text when no result matches', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          filterable: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const input = document.body.querySelector<HTMLInputElement>('input');
      await new DOMWrapper(input as Element).setValue('不存在的节点');
      await flushPromises();
      await nextTick();

      // Default locale is `en`.
      expect(document.body.querySelector('[data-vean-cascader-empty]')?.textContent).toContain('No data');
      // The empty state replaces the menu columns so it can center in the panel.
      expect(document.body.querySelector('[data-vean-cascader-menu]')).toBeNull();
      wrapper.unmount();
    });

    it('shows a custom empty label when emptyLabel is provided', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          filterable: true,
          emptyLabel: '没有匹配项'
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const input = document.body.querySelector<HTMLInputElement>('input');
      await new DOMWrapper(input as Element).setValue('不存在的节点');
      await flushPromises();
      await nextTick();

      expect(document.body.querySelector('[data-vean-cascader-empty]')?.textContent).toContain('没有匹配项');
      wrapper.unmount();
    });
  });

  describe('virtual scroll', () => {
    const virtualOptions = Array.from({ length: 50 }, (_, index) => ({
      label: `分组 ${index + 1}`,
      value: `group-${index + 1}`,
      children: [{ label: `子选项 ${index + 1}`, value: `child-${index + 1}` }]
    }));

    it('renders only the visible window of a column instead of all rows', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options: virtualOptions,
          virtualScroll: true,
          itemSize: 34,
          height: 240
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const menu = document.body.querySelector('[data-vean-cascader-menu]');
      expect(menu).toBeTruthy();
      // ceil(240 / 34) + 2 = 10 rendered rows out of 50 root options.
      expect(menu?.querySelectorAll('[role="treeitem"]').length).toBe(10);
      wrapper.unmount();
    });

    it('keeps the full scroll height via spacer elements', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options: virtualOptions,
          virtualScroll: true,
          itemSize: 34,
          height: 240
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const menu = document.body.querySelector<HTMLElement>('[data-vean-cascader-menu]');
      expect(menu).toBeTruthy();
      // The bottom spacer covers the 40 unrendered rows: 40 * 34 = 1360px.
      const spacers = menu?.querySelectorAll('div[aria-hidden="true"]');
      expect(spacers?.length).toBe(1);
      expect(spacers?.[0]?.getAttribute('style')).toContain('height: 1360px');
      wrapper.unmount();
    });
  });

  describe('clearable', () => {
    it('clears the single selection via the clear button and emits clear', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          checkStrictly: true
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const zhejiang = findTreeItem('浙江');
      await new DOMWrapper(zhejiang as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['zhejiang']);

      const clearButton = document.body.querySelector<HTMLButtonElement>('[data-vean-cascader-clear]');
      expect(clearButton).toBeTruthy();
      // Default locale is `en`.
      expect(clearButton?.getAttribute('aria-label')).toBe('Clear value');

      await new DOMWrapper(clearButton as Element).trigger('click');
      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined]);
      expect(wrapper.emitted('clear')).toHaveLength(1);
      wrapper.unmount();
    });

    it('uses the clearLabel prop for the clear button aria-label', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          checkStrictly: true,
          clearLabel: '清空选择'
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();

      const zhejiang = findTreeItem('浙江');
      await new DOMWrapper(zhejiang as Element).trigger('click');
      await flushPromises();
      await nextTick();
      await nextTick();

      const clearButton = document.body.querySelector<HTMLButtonElement>('[data-vean-cascader-clear]');
      expect(clearButton?.getAttribute('aria-label')).toBe('清空选择');
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('prevents opening when disabled', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          disabled: true
        },
        attachTo: document.body
      });

      const trigger = wrapper.get('[role="combobox"]');

      await trigger.trigger('click');
      await nextTick();

      expect(document.body.querySelector('[role="tree"]')).toBeNull();
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when paired with a label', async () => {
      const wrapper = mount(
        {
          components: { SCascader },
          data() {
            return { options };
          },
          template: `
            <div>
              <label for="cascader-trigger">区域</label>
              <SCascader :options="options" :trigger-props="{ id: 'cascader-trigger', 'aria-label': '区域' }" />
            </div>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations when open (filterable mode)', async () => {
      const wrapper = mount(SCascader, {
        props: {
          options,
          filterable: true,
          triggerProps: { 'aria-label': '区域' }
        },
        attachTo: document.body
      });

      await wrapper.get('[role="combobox"]').trigger('click');
      await nextTick();
      await nextTick();

      const violations = await getA11yViolations(document.body, {
        rules: {
          region: { enabled: false }
        }
      });

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
