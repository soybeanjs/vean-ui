import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle } from '@/components/splitter';
import { getA11yViolations } from '../../shared/a11y';

function mockRect(element: Element, rect: { x?: number; y?: number; width?: number; height?: number }) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: rect.x ?? 0,
      y: rect.y ?? 0,
      top: rect.y ?? 0,
      left: rect.x ?? 0,
      right: (rect.x ?? 0) + (rect.width ?? 0),
      bottom: (rect.y ?? 0) + (rect.height ?? 0),
      width: rect.width ?? 0,
      height: rect.height ?? 0,
      toJSON: () => ({})
    })
  });
}

function dispatchPointerEvent(target: EventTarget, type: string, init: PointerEventInit) {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
}

describe('Splitter', () => {
  describe('rendering', () => {
    it('renders panels and custom class', () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup class="my-splitter">
              <SSplitterPanel :default-size="30">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize panels" />
              <SSplitterPanel :default-size="70">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.text()).toContain('A');
      expect(wrapper.text()).toContain('B');
      expect(wrapper.html()).toContain('my-splitter');
      wrapper.unmount();
    });

    it('reflects default panel sizes', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="30">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize panels" :tabindex="-1" />
              <SSplitterPanel :default-size="70">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const panels = wrapper.findAll('[data-panel]');

      expect(Number(panels[0]?.attributes('data-panel-size'))).toBeCloseTo(30, 1);
      expect(Number(panels[1]?.attributes('data-panel-size'))).toBeCloseTo(70, 1);
      wrapper.unmount();
    });

    it('applies resize cursors for handle orientations', () => {
      const horizontalWrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="30">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize panels" />
              <SSplitterPanel :default-size="70">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      const verticalWrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup direction="vertical">
              <SSplitterPanel :default-size="30">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize panels" />
              <SSplitterPanel :default-size="70">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      const horizontalHandle = horizontalWrapper.find('[data-splitter-resize-handle]');
      const verticalHandle = verticalWrapper.find('[data-splitter-resize-handle]');

      expect(horizontalHandle.classes()).toContain('cursor-col-resize');
      expect(horizontalHandle.classes()).toContain('data-[state=hover]:bg-accent');
      expect(horizontalHandle.classes()).toContain('data-[state=drag]:bg-accent');
      expect(verticalHandle.attributes('data-orientation')).toBe('vertical');
      expect(verticalHandle.classes()).toContain('data-[orientation=vertical]:cursor-row-resize');

      horizontalWrapper.unmount();
      verticalWrapper.unmount();
    });
  });

  describe('layout state', () => {
    it('emits layout when dragging the resize handle', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize panels" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const group = wrapper.findComponent(SSplitterGroup);
      const groupElement = wrapper.find('[data-splitter-group-id]');
      const handle = wrapper.find('[data-splitter-resize-handle]');

      mockRect(groupElement.element, { x: 0, y: 0, width: 100, height: 40 });
      dispatchPointerEvent(handle.element, 'pointerdown', {
        clientX: 50,
        clientY: 20,
        pointerId: 1
      });
      dispatchPointerEvent(document, 'pointermove', { clientX: 70, clientY: 20, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 70, clientY: 20, pointerId: 1 });

      const lastLayout = group.emitted('layout')?.at(-1)?.[0] as number[] | undefined;

      expect(lastLayout?.[0]).toBeCloseTo(70, 1);
      expect(lastLayout?.[1]).toBeCloseTo(30, 1);
      wrapper.unmount();
    });

    it('supports keyboard resizing', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize panels" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const group = wrapper.findComponent(SSplitterGroup);
      const handle = wrapper.find('[data-splitter-resize-handle]');

      await handle.trigger('keydown', { key: 'ArrowRight' });

      const lastLayout = group.emitted('layout')?.at(-1)?.[0] as number[] | undefined;

      expect(lastLayout?.[0]).toBeCloseTo(60, 1);
      expect(lastLayout?.[1]).toBeCloseTo(40, 1);
      wrapper.unmount();
    });

    it('collapses a collapsible panel with Enter', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel collapsible :collapsed-size="0" :min-size="20" :default-size="30">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize panels" />
              <SSplitterPanel :default-size="70">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      const handle = wrapper.find('[data-splitter-resize-handle]');
      const panel = wrapper.find('[data-panel]');

      await handle.trigger('keydown', { key: 'Enter' });

      expect(panel.attributes('data-state')).toBe('collapsed');
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('prevents dragging when disabled', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle disabled aria-label="Resize panels" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const group = wrapper.findComponent(SSplitterGroup);
      const groupElement = wrapper.find('[data-splitter-group-id]');
      const handle = wrapper.find('[data-splitter-resize-handle]');

      mockRect(groupElement.element, { x: 0, y: 0, width: 100, height: 40 });
      dispatchPointerEvent(handle.element, 'pointerdown', {
        clientX: 50,
        clientY: 20,
        pointerId: 1
      });
      dispatchPointerEvent(document, 'pointermove', { clientX: 70, clientY: 20, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 70, clientY: 20, pointerId: 1 });

      expect(handle.attributes('data-disabled')).toBe('');
      expect(group.emitted('layout')?.at(-1)?.[0]).toEqual([50, 50]);
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="30">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize panels" />
              <SSplitterPanel :default-size="70">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);
      // axe/happy-dom currently reports a false-positive required aria-valuenow violation for focusable separator patterns.
      const actionableViolations = violations.filter(violation => violation.id !== 'aria-required-attr');

      expect(actionableViolations).toHaveLength(0);
      wrapper.unmount();
    });

    it('exposes aria-valuenow / aria-valuemin / aria-valuemax on handle', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="30" :min-size="10" :max-size="90">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize panels" />
              <SSplitterPanel :default-size="70">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const handle = wrapper.find('[data-splitter-resize-handle]');

      expect(handle.attributes('role')).toBe('separator');
      expect(handle.attributes('aria-orientation')).toBe('horizontal');
      expect(handle.attributes('aria-controls')).toBeTruthy();
      expect(Number(handle.attributes('aria-valuenow'))).toBeCloseTo(30, 0);
      expect(Number(handle.attributes('aria-valuemin'))).toBeCloseTo(10, 0);
      expect(Number(handle.attributes('aria-valuemax'))).toBeCloseTo(90, 0);

      wrapper.unmount();
    });
  });

  describe('defaultLayout prop', () => {
    it('uses defaultLayout when provided', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup :default-layout="[40, 60]">
              <SSplitterPanel>A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" :tabindex="-1" />
              <SSplitterPanel>B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const panels = wrapper.findAll('[data-panel]');

      expect(Number(panels[0]?.attributes('data-panel-size'))).toBeCloseTo(40, 1);
      expect(Number(panels[1]?.attributes('data-panel-size'))).toBeCloseTo(60, 1);
      wrapper.unmount();
    });
  });

  describe('size constraints', () => {
    it('respects minSize during drag', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50" :min-size="30">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="50" :min-size="20">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const groupElement = wrapper.find('[data-splitter-group-id]');
      const handle = wrapper.find('[data-splitter-resize-handle]');

      mockRect(groupElement.element, { x: 0, y: 0, width: 100, height: 40 });
      dispatchPointerEvent(handle.element, 'pointerdown', {
        clientX: 50,
        clientY: 20,
        pointerId: 1
      });
      dispatchPointerEvent(document, 'pointermove', { clientX: 0, clientY: 20, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 0, clientY: 20, pointerId: 1 });

      const panels = wrapper.findAll('[data-panel]');

      expect(Number(panels[0]?.attributes('data-panel-size'))).toBeGreaterThanOrEqual(30 - 0.1);
      wrapper.unmount();
    });

    it('respects maxSize during drag', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50" :max-size="60">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const groupElement = wrapper.find('[data-splitter-group-id]');
      const handle = wrapper.find('[data-splitter-resize-handle]');

      mockRect(groupElement.element, { x: 0, y: 0, width: 100, height: 40 });
      dispatchPointerEvent(handle.element, 'pointerdown', {
        clientX: 50,
        clientY: 20,
        pointerId: 1
      });
      dispatchPointerEvent(document, 'pointermove', { clientX: 100, clientY: 20, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 100, clientY: 20, pointerId: 1 });

      const panels = wrapper.findAll('[data-panel]');

      expect(Number(panels[0]?.attributes('data-panel-size'))).toBeLessThanOrEqual(60 + 0.1);
      wrapper.unmount();
    });
  });

  describe('panel events', () => {
    it('emits resize on panel when layout changes', async () => {
      const onResize = vi.fn();
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50" @resize="onResize">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `,
          setup() {
            return { onResize };
          }
        },
        { attachTo: document.body }
      );

      await nextTick();

      const groupElement = wrapper.find('[data-splitter-group-id]');
      const handle = wrapper.find('[data-splitter-resize-handle]');

      mockRect(groupElement.element, { x: 0, y: 0, width: 100, height: 40 });
      dispatchPointerEvent(handle.element, 'pointerdown', {
        clientX: 50,
        clientY: 20,
        pointerId: 1
      });
      dispatchPointerEvent(document, 'pointermove', { clientX: 60, clientY: 20, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 60, clientY: 20, pointerId: 1 });

      expect(onResize).toHaveBeenCalled();
      wrapper.unmount();
    });

    it('emits collapse and expand on collapsible panel', async () => {
      const onCollapse = vi.fn();
      const onExpand = vi.fn();
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel collapsible :collapsed-size="0" :min-size="20" :default-size="30" @collapse="onCollapse" @expand="onExpand">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="70">B</SSplitterPanel>
            </SSplitterGroup>
          `,
          setup() {
            return { onCollapse, onExpand };
          }
        },
        { attachTo: document.body }
      );

      await nextTick();

      const handle = wrapper.find('[data-splitter-resize-handle]');

      await handle.trigger('keydown', { key: 'Enter' });
      expect(onCollapse).toHaveBeenCalled();

      await handle.trigger('keydown', { key: 'Enter' });
      expect(onExpand).toHaveBeenCalled();

      wrapper.unmount();
    });
  });

  describe('keyboard resize', () => {
    it('resizes by keyboardResizeBy step', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup :keyboard-resize-by="5">
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const group = wrapper.findComponent(SSplitterGroup);
      const handle = wrapper.find('[data-splitter-resize-handle]');

      await handle.trigger('keydown', { key: 'ArrowRight' });

      const lastLayout = group.emitted('layout')?.at(-1)?.[0] as number[] | undefined;

      expect(lastLayout?.[0]).toBeCloseTo(55, 1);
      expect(lastLayout?.[1]).toBeCloseTo(45, 1);
      wrapper.unmount();
    });

    it('Home sets panel to min size', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50" :min-size="20">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="50" :min-size="20">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const group = wrapper.findComponent(SSplitterGroup);
      const handle = wrapper.find('[data-splitter-resize-handle]');

      await handle.trigger('keydown', { key: 'Home' });

      const lastLayout = group.emitted('layout')?.at(-1)?.[0] as number[] | undefined;

      expect(lastLayout?.[0]).toBeCloseTo(20, 0);
      wrapper.unmount();
    });

    it('End sets panel to max size', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50" :max-size="80">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const group = wrapper.findComponent(SSplitterGroup);
      const handle = wrapper.find('[data-splitter-resize-handle]');

      await handle.trigger('keydown', { key: 'End' });

      const lastLayout = group.emitted('layout')?.at(-1)?.[0] as number[] | undefined;

      expect(lastLayout?.[0]).toBeCloseTo(80, 0);
      wrapper.unmount();
    });

    it('ArrowUp/ArrowDown resize in vertical direction', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup direction="vertical">
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const group = wrapper.findComponent(SSplitterGroup);
      const handle = wrapper.find('[data-splitter-resize-handle]');

      await handle.trigger('keydown', { key: 'ArrowDown' });

      const lastLayout = group.emitted('layout')?.at(-1)?.[0] as number[] | undefined;

      expect(lastLayout?.[0]).toBeCloseTo(60, 1);
      wrapper.unmount();
    });
  });

  describe('panel order', () => {
    it('respects order prop for defaultLayout mapping', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup :default-layout="[70, 30]">
              <SSplitterPanel :order="2">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" :tabindex="-1" />
              <SSplitterPanel :order="1">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const panels = wrapper.findAll('[data-panel]');

      // DOM order is [A, B], but sorted order is [B(1), A(2)]
      // defaultLayout [70, 30] maps to sorted panels: B=70, A=30
      expect(panels[0]?.text()).toBe('A');
      expect(Number(panels[0]?.attributes('data-panel-size'))).toBeCloseTo(30, 1);
      expect(panels[1]?.text()).toBe('B');
      expect(Number(panels[1]?.attributes('data-panel-size'))).toBeCloseTo(70, 1);
      wrapper.unmount();
    });
  });

  describe('state reflection', () => {
    it('reflects data-state on collapsible panel', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel collapsible :collapsed-size="0" :min-size="20" :default-size="30">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="70">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const panel = wrapper.find('[data-panel]');

      expect(panel.attributes('data-state')).toBe('expanded');

      const handle = wrapper.find('[data-splitter-resize-handle]');
      await handle.trigger('keydown', { key: 'Enter' });

      expect(panel.attributes('data-state')).toBe('collapsed');
      wrapper.unmount();
    });

    // Regression: a collapsed panel must reflect data-state="collapsed" even
    // when its reported size settles at a float epsilon from collapsedSize
    // (mirrors reka-ui fix: fuzzy-compare panelSize against collapsedSize
    // instead of strict equality).
    it('reflects data-state="collapsed" for a collapsed panel with a non-zero collapsed size', async () => {
      const panelRef = ref<{ collapse: () => void } | null>(null);
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel ref="panelRef" collapsible :collapsed-size="20" :min-size="30" :default-size="60">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="40">B</SSplitterPanel>
            </SSplitterGroup>
          `,
          setup() {
            return { panelRef };
          }
        },
        { attachTo: document.body }
      );

      await nextTick();

      const panel = wrapper.find('[data-panel]');

      expect(panel.attributes('data-state')).toBe('expanded');

      panelRef.value?.collapse();
      await nextTick();

      expect(panel.attributes('data-state')).toBe('collapsed');
      expect(Number(panel.attributes('data-panel-size'))).toBeCloseTo(20, 1);
      wrapper.unmount();
    });

    it('does not set data-state on non-collapsible panel', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" :tabindex="-1" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const panel = wrapper.find('[data-panel]');

      expect(panel.attributes('data-state')).toBeUndefined();
      wrapper.unmount();
    });
  });

  describe('withHandle', () => {
    it('renders default handle grip when withHandle is true', () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle with-handle aria-label="Resize" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      const handle = wrapper.find('[data-splitter-resize-handle]');

      // The default grip is a decorative div with aria-hidden
      const grip = handle.find('[aria-hidden="true"]');
      expect(grip.exists()).toBe(true);
      wrapper.unmount();
    });

    it('renders custom slot content when provided', () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize">
              <div data-custom-grip>Grip</div>
              </SSplitterResizeHandle>
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-custom-grip]').exists()).toBe(true);
      wrapper.unmount();
    });
  });

  describe('imperative API', () => {
    it('exposes collapse / expand / resize / isCollapsed on panel', async () => {
      const panelRef = ref<any>(null);
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup>
              <SSplitterPanel ref="panelRef" collapsible :collapsed-size="0" :min-size="20" :default-size="30">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" :tabindex="-1" />
              <SSplitterPanel :default-size="70">B</SSplitterPanel>
            </SSplitterGroup>
          `,
          setup() {
            return { panelRef };
          }
        },
        { attachTo: document.body }
      );

      await nextTick();

      const panel = panelRef.value;
      expect(panel).toBeTruthy();
      expect(panel.isCollapsed).toBe(false);

      panel.collapse();
      await nextTick();

      expect(panel.isCollapsed).toBe(true);

      panel.expand();
      await nextTick();

      expect(panel.isCollapsed).toBe(false);
      wrapper.unmount();
    });
  });

  describe('RTL direction', () => {
    it('inverts horizontal drag delta in RTL', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup dir="rtl">
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const group = wrapper.findComponent(SSplitterGroup);
      const groupElement = wrapper.find('[data-splitter-group-id]');
      const handle = wrapper.find('[data-splitter-resize-handle]');

      mockRect(groupElement.element, { x: 0, y: 0, width: 100, height: 40 });
      dispatchPointerEvent(handle.element, 'pointerdown', {
        clientX: 50,
        clientY: 20,
        pointerId: 1
      });
      // Drag right in RTL should shrink the first panel (delta inverted)
      dispatchPointerEvent(document, 'pointermove', { clientX: 70, clientY: 20, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 70, clientY: 20, pointerId: 1 });

      const lastLayout = group.emitted('layout')?.at(-1)?.[0] as number[] | undefined;

      // In RTL, dragging right decreases the first panel size (30 instead of 70)
      expect(lastLayout?.[0]).toBeCloseTo(30, 1);
      expect(lastLayout?.[1]).toBeCloseTo(70, 1);
      wrapper.unmount();
    });

    it('inverts arrow keys in RTL', async () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup dir="rtl">
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const group = wrapper.findComponent(SSplitterGroup);
      const handle = wrapper.find('[data-splitter-resize-handle]');

      // In RTL, ArrowLeft increases the first panel (opposite of LTR)
      await handle.trigger('keydown', { key: 'ArrowLeft' });

      const lastLayout = group.emitted('layout')?.at(-1)?.[0] as number[] | undefined;

      expect(lastLayout?.[0]).toBeCloseTo(60, 1);
      wrapper.unmount();
    });

    it('sets dir attribute on root', () => {
      const wrapper = mount(
        {
          components: { SSplitterGroup, SSplitterPanel, SSplitterResizeHandle },
          template: `
            <SSplitterGroup dir="rtl">
              <SSplitterPanel :default-size="50">A</SSplitterPanel>
              <SSplitterResizeHandle aria-label="Resize" :tabindex="-1" />
              <SSplitterPanel :default-size="50">B</SSplitterPanel>
            </SSplitterGroup>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-vean-splitter-group]').attributes('dir')).toBe('rtl');
      wrapper.unmount();
    });
  });
});
