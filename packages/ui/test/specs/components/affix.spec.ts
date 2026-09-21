import { describe, expect, it } from 'vitest';
import { computed, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { AffixContent, AffixPlaceholder, AffixRoot, provideAffixUi } from '@vean/aria/affix';
import SAffix from '@/components/affix/affix.vue';
import { getA11yViolations } from '../../shared/a11y';

function createRect(rect: Partial<DOMRect>): DOMRect {
  return {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON() {
      return {};
    },
    ...rect
  } as DOMRect;
}

function mockRect(element: HTMLElement, rect: () => DOMRect) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: rect
  });
}

async function waitForAffixUpdate() {
  await nextTick();
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => resolve());
  });
  await nextTick();
}

function getAffixRoot(wrapper: ReturnType<typeof mount>) {
  return wrapper.findComponent({ name: 'AffixRoot' }).vm;
}

describe('SAffix', () => {
  describe('rendering', () => {
    it('renders default slot content', () => {
      const wrapper = mount(SAffix, {
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Pinned content');
      wrapper.unmount();
    });

    it('applies custom class to the affixed container', () => {
      const wrapper = mount(SAffix, {
        props: { class: 'my-affix-class' },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-state]').classes()).toContain('my-affix-class');
      wrapper.unmount();
    });
  });

  describe('affixed state', () => {
    it('accepts a direct element target', async () => {
      let targetTop = 0;
      const target = document.createElement('div');
      document.body.appendChild(target);

      const wrapper = mount(SAffix, {
        props: { offsetTop: 16, target },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      mockRect(wrapper.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width: 120, height: 40, right: 132 })
      );
      mockRect(target, () => createRect({ top: targetTop, bottom: targetTop + 300, width: 400, height: 300 }));

      getAffixRoot(wrapper).updatePosition();
      await waitForAffixUpdate();

      expect(wrapper.find('[data-state]').attributes('data-state')).toBe('static');

      targetTop = 50;
      target.dispatchEvent(new Event('scroll'));
      await waitForAffixUpdate();

      const fixed = wrapper.find('[data-state]');

      expect(fixed.attributes('data-state')).toBe('fixed');
      expect(fixed.attributes('style')).toContain('top: 66px');

      wrapper.unmount();
      target.remove();
    });

    it('resolves a string selector target', async () => {
      let targetTop = 0;
      const wrapper = mount(
        {
          components: { SAffix },
          template: `
            <div id="affix-selector-target">
              <SAffix :offset-top="16" target="#affix-selector-target">
                Pinned content
              </SAffix>
            </div>
          `
        },
        {
          attachTo: document.body
        }
      );

      const target = wrapper.find('#affix-selector-target').element as HTMLElement;
      const affix = wrapper.findComponent(SAffix);

      mockRect(affix.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width: 120, height: 40, right: 132 })
      );
      mockRect(target, () => createRect({ top: targetTop, bottom: targetTop + 300, width: 400, height: 300 }));

      getAffixRoot(wrapper).updatePosition();
      await waitForAffixUpdate();

      expect(wrapper.find('[data-state]').attributes('data-state')).toBe('static');

      targetTop = 50;
      target.dispatchEvent(new Event('scroll'));
      await waitForAffixUpdate();

      const fixed = wrapper.find('[data-state]');

      expect(fixed.attributes('data-state')).toBe('fixed');
      expect(fixed.attributes('style')).toContain('top: 66px');
      expect(affix.emitted('change')).toEqual([[true]]);

      wrapper.unmount();
    });

    it('updates when the target prop changes', async () => {
      let firstTargetTop = 0;
      let secondTargetTop = 0;
      const firstTarget = document.createElement('div');
      const secondTarget = document.createElement('div');

      document.body.appendChild(firstTarget);
      document.body.appendChild(secondTarget);

      const wrapper = mount(SAffix, {
        props: { offsetTop: 16, target: firstTarget },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      mockRect(wrapper.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width: 120, height: 40, right: 132 })
      );
      mockRect(firstTarget, () =>
        createRect({ top: firstTargetTop, bottom: firstTargetTop + 300, width: 400, height: 300 })
      );
      mockRect(secondTarget, () =>
        createRect({
          top: secondTargetTop,
          bottom: secondTargetTop + 300,
          width: 400,
          height: 300
        })
      );

      getAffixRoot(wrapper).updatePosition();
      await waitForAffixUpdate();

      expect(wrapper.find('[data-state]').attributes('data-state')).toBe('static');

      await wrapper.setProps({ target: secondTarget });
      await waitForAffixUpdate();

      secondTargetTop = 50;
      secondTarget.dispatchEvent(new Event('scroll'));
      await waitForAffixUpdate();

      const fixed = wrapper.find('[data-state]');

      expect(fixed.attributes('data-state')).toBe('fixed');
      expect(fixed.attributes('style')).toContain('top: 66px');

      wrapper.unmount();
      firstTarget.remove();
      secondTarget.remove();
    });

    it('affixes to the top when the offset threshold is reached', async () => {
      let targetTop = 0;
      const target = document.createElement('div');
      document.body.appendChild(target);

      const wrapper = mount(SAffix, {
        props: { offsetTop: 16, target },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      mockRect(wrapper.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width: 120, height: 40, right: 132 })
      );
      mockRect(target, () => createRect({ top: targetTop, bottom: targetTop + 300, width: 400, height: 300 }));

      getAffixRoot(wrapper).updatePosition();
      await waitForAffixUpdate();

      expect(wrapper.find('[data-state]').attributes('data-state')).toBe('static');

      targetTop = 50;
      target.dispatchEvent(new Event('scroll'));
      await waitForAffixUpdate();

      const fixed = wrapper.find('[data-state]');
      const placeholder = wrapper.find('[role="presentation"]');

      expect(fixed.attributes('data-state')).toBe('fixed');
      expect(fixed.attributes('style')).toContain('position: fixed');
      expect(fixed.attributes('style')).toContain('top: 66px');
      expect(fixed.attributes('style')).toContain('left: 12px');
      expect(fixed.attributes('style')).not.toContain('height: 40px');
      expect(placeholder.attributes('style')).toContain('height: 40px');
      expect(wrapper.emitted('change')).toEqual([[true]]);

      wrapper.unmount();
      target.remove();
    });

    it('affixes to the bottom when the bottom offset threshold is reached', async () => {
      let targetBottom = 800;
      const target = document.createElement('div');
      document.body.appendChild(target);

      const wrapper = mount(SAffix, {
        props: { offsetBottom: 24, target },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      mockRect(wrapper.element as HTMLElement, () =>
        createRect({ top: 720, bottom: 760, left: 24, width: 180, height: 40, right: 204 })
      );
      mockRect(target, () => createRect({ top: 0, bottom: targetBottom, width: 400, height: 800 }));

      getAffixRoot(wrapper).updatePosition();
      await waitForAffixUpdate();

      expect(wrapper.find('[data-state]').attributes('data-state')).toBe('static');

      targetBottom = 700;
      target.dispatchEvent(new Event('scroll'));
      await waitForAffixUpdate();

      const fixed = wrapper.find('[data-state]');
      const expectedBottom = 24 + window.innerHeight - targetBottom;

      expect(fixed.attributes('data-state')).toBe('fixed');
      expect(fixed.attributes('style')).toContain(`bottom: ${expectedBottom}px`);

      wrapper.unmount();
      target.remove();
    });

    it('supports Aria composition with placeholder and content', async () => {
      let targetTop = 0;
      const target = document.createElement('div');

      document.body.appendChild(target);

      const wrapper = mount(
        {
          components: {
            AffixContent,
            AffixPlaceholder,
            AffixRoot
          },
          setup() {
            provideAffixUi(
              computed(() => ({
                content: 'aria-affix-class'
              }))
            );

            return { target };
          },
          template: `
            <AffixRoot :offset-top="16" :target="target">
              <AffixPlaceholder />
              <AffixContent>Pinned content</AffixContent>
            </AffixRoot>
          `
        },
        {
          attachTo: document.body
        }
      );

      const affixRoot = wrapper.findComponent({ name: 'AffixRoot' });

      mockRect(affixRoot.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width: 120, height: 40, right: 132 })
      );
      mockRect(target, () => createRect({ top: targetTop, bottom: targetTop + 300, width: 400, height: 300 }));

      getAffixRoot(wrapper).updatePosition();
      await waitForAffixUpdate();

      targetTop = 50;
      target.dispatchEvent(new Event('scroll'));
      await waitForAffixUpdate();

      expect(wrapper.find('[data-state]').classes()).toContain('aria-affix-class');
      expect(wrapper.find('[role="presentation"]').exists()).toBe(true);

      wrapper.unmount();
      target.remove();
    });
  });

  describe('change event', () => {
    it('emits change only on state transitions, not repeated updates', async () => {
      let targetTop = 0;
      const target = document.createElement('div');
      document.body.appendChild(target);

      const wrapper = mount(SAffix, {
        props: { offsetTop: 16, target },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      mockRect(wrapper.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width: 120, height: 40, right: 132 })
      );
      mockRect(target, () => createRect({ top: targetTop, bottom: targetTop + 300, width: 400, height: 300 }));

      const affixRoot = getAffixRoot(wrapper);

      affixRoot.updatePosition();
      await waitForAffixUpdate();
      // Second update in the same static state must not emit
      affixRoot.updatePosition();
      await waitForAffixUpdate();

      expect(wrapper.emitted('change')).toBeUndefined();

      targetTop = 50;
      target.dispatchEvent(new Event('scroll'));
      await waitForAffixUpdate();
      // Repeated updates while still fixed must not emit again
      affixRoot.updatePosition();
      await waitForAffixUpdate();

      expect(wrapper.emitted('change')).toEqual([[true]]);

      wrapper.unmount();
      target.remove();
    });

    it('emits change with false when un-affixed', async () => {
      let targetTop = 50;
      const target = document.createElement('div');
      document.body.appendChild(target);

      const wrapper = mount(SAffix, {
        props: { offsetTop: 16, target },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      mockRect(wrapper.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width: 120, height: 40, right: 132 })
      );
      mockRect(target, () => createRect({ top: targetTop, bottom: targetTop + 300, width: 400, height: 300 }));

      const affixRoot = getAffixRoot(wrapper);

      affixRoot.updatePosition();
      await waitForAffixUpdate();

      expect(wrapper.find('[data-state]').attributes('data-state')).toBe('fixed');

      targetTop = 0;
      target.dispatchEvent(new Event('scroll'));
      await waitForAffixUpdate();

      expect(wrapper.find('[data-state]').attributes('data-state')).toBe('static');
      expect(wrapper.emitted('change')).toEqual([[true], [false]]);

      wrapper.unmount();
      target.remove();
    });
  });

  describe('placeholder', () => {
    it('renders placeholder only when affixed', async () => {
      let targetTop = 0;
      const target = document.createElement('div');
      document.body.appendChild(target);

      const wrapper = mount(SAffix, {
        props: { offsetTop: 16, target },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      mockRect(wrapper.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width: 120, height: 40, right: 132 })
      );
      mockRect(target, () => createRect({ top: targetTop, bottom: targetTop + 300, width: 400, height: 300 }));

      const affixRoot = getAffixRoot(wrapper);

      affixRoot.updatePosition();
      await waitForAffixUpdate();

      expect(wrapper.find('[role="presentation"]').exists()).toBe(false);

      targetTop = 50;
      target.dispatchEvent(new Event('scroll'));
      await waitForAffixUpdate();

      const placeholder = wrapper.find('[role="presentation"]');

      expect(placeholder.exists()).toBe(true);
      expect(placeholder.attributes('aria-hidden')).toBe('true');
      expect(placeholder.attributes('style')).toContain('width: 120px');

      wrapper.unmount();
      target.remove();
    });
  });

  describe('default offset', () => {
    it('affixes to the target top by default when no offset is provided', async () => {
      const target = document.createElement('div');
      document.body.appendChild(target);

      const wrapper = mount(SAffix, {
        props: { target },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      mockRect(wrapper.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width: 120, height: 40, right: 132 })
      );
      mockRect(target, () => createRect({ top: 50, bottom: 350, width: 400, height: 300 }));

      getAffixRoot(wrapper).updatePosition();
      await waitForAffixUpdate();

      const fixed = wrapper.find('[data-state]');

      // internalOffsetTop defaults to 0 → top = 0 + targetRect.top = 50
      expect(fixed.attributes('data-state')).toBe('fixed');
      expect(fixed.attributes('style')).toContain('top: 50px');
      expect(fixed.attributes('style')).toContain('position: fixed');
      expect(fixed.attributes('style')).toContain('left: 12px');

      wrapper.unmount();
      target.remove();
    });
  });

  describe('resize', () => {
    it('updates the fixed width on window resize', async () => {
      let width = 120;
      const target = document.createElement('div');
      document.body.appendChild(target);

      const wrapper = mount(SAffix, {
        props: { offsetTop: 16, target },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      mockRect(wrapper.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width, height: 40, right: 12 + width })
      );
      mockRect(target, () => createRect({ top: 50, bottom: 350, width: 400, height: 300 }));

      getAffixRoot(wrapper).updatePosition();
      await waitForAffixUpdate();

      expect(wrapper.find('[data-state]').attributes('style')).toContain('width: 120px');

      width = 200;
      window.dispatchEvent(new Event('resize'));
      await waitForAffixUpdate();

      const fixed = wrapper.find('[data-state]');

      expect(fixed.attributes('style')).toContain('width: 200px');
      expect(fixed.attributes('style')).toContain('left: 12px');

      wrapper.unmount();
      target.remove();
    });
  });

  describe('unmount safety', () => {
    it('removes scroll listeners from the target on unmount', async () => {
      const target = document.createElement('div');
      document.body.appendChild(target);

      const wrapper = mount(SAffix, {
        props: { offsetTop: 16, target },
        slots: { default: 'Pinned content' },
        attachTo: document.body
      });

      mockRect(wrapper.element as HTMLElement, () =>
        createRect({ top: 40, bottom: 80, left: 12, width: 120, height: 40, right: 132 })
      );
      mockRect(target, () => createRect({ top: 50, bottom: 350, width: 400, height: 300 }));

      wrapper.unmount();

      // Dispatching scroll after unmount must not throw (listeners removed)
      expect(() => target.dispatchEvent(new Event('scroll'))).not.toThrow();
      target.remove();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SAffix, {
        slots: {
          default: '<button type="button">Pinned action</button>'
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
