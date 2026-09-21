import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import SButtonGroup from '@/components/button/button-group.vue';
import SButtonIcon from '@/components/button/button-icon.vue';
import SButtonLink from '@/components/button/button-link.vue';
import SButtonLoading from '@/components/button/button-loading.vue';
import SButton from '@/components/button/button.vue';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SButton', () => {
  describe('rendering', () => {
    it('renders default slot content', () => {
      const wrapper = mount(SButton, { slots: { default: 'Click me' } });
      expect(wrapper.text()).toContain('Click me');
    });

    it('renders as a button element by default', () => {
      const wrapper = mount(SButton);
      expect(wrapper.find('button').exists()).toBe(true);
    });

    it('applies custom class', () => {
      const wrapper = mount(SButton, { props: { class: 'my-custom-class' } });
      expect(wrapper.find('button').classes()).toContain('my-custom-class');
    });

    it('renders leading and trailing slots', () => {
      const wrapper = mount(SButton, {
        slots: {
          leading: '<span data-testid="leading">L</span>',
          default: 'Text',
          trailing: '<span data-testid="trailing">R</span>'
        }
      });
      expect(wrapper.find('[data-testid="leading"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="trailing"]').exists()).toBe(true);
    });

    it('carries the data-vean-button attribute', () => {
      const wrapper = mount(SButton);
      expect(wrapper.find('button').attributes('data-vean-button')).toBeDefined();
    });
  });

  describe('disabled state', () => {
    it('is not disabled by default', () => {
      const wrapper = mount(SButton);
      expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    });

    it('applies aria-disabled when disabled prop is true', () => {
      const wrapper = mount(SButton, { props: { disabled: true } });
      // Aria Button uses aria-disabled (not native disabled) to preserve focusability
      expect(wrapper.find('button').attributes('aria-disabled')).toBe('true');
    });

    it('does not emit click event when disabled', async () => {
      const wrapper = mount(SButton, { props: { disabled: true } });
      await wrapper.find('button').trigger('click');
      // SButton emits 'click' only when Aria Button is not disabled
      expect(wrapper.emitted('click')).toBeFalsy();
    });
  });

  describe('events', () => {
    it('emits click event when clicked', async () => {
      const wrapper = mount(SButton);
      await wrapper.find('button').trigger('click');
      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')).toHaveLength(1);
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations for a default button', async () => {
      const wrapper = mount(SButton, {
        slots: { default: 'Submit' },
        attachTo: document.body
      });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations when disabled', async () => {
      const wrapper = mount(SButton, {
        props: { disabled: true },
        slots: { default: 'Submit' },
        attachTo: document.body
      });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});

describe('SButtonLoading', () => {
  describe('rendering', () => {
    it('renders default slot content when not loading', () => {
      const wrapper = mount(SButtonLoading, { slots: { default: 'Save' } });
      expect(wrapper.find('button').text()).toContain('Save');
    });

    it('does not set aria-busy when not loading', () => {
      const wrapper = mount(SButtonLoading, { slots: { default: 'Save' } });
      expect(wrapper.find('button').attributes('aria-busy')).toBeUndefined();
    });

    it('sets aria-busy="true" when loading is true', async () => {
      const wrapper = mount(SButtonLoading, {
        props: { loading: true },
        slots: { default: 'Save' }
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('button').attributes('aria-busy')).toBe('true');
      wrapper.unmount();
    });

    it('disables the button while loading', async () => {
      const wrapper = mount(SButtonLoading, {
        props: { loading: true },
        slots: { default: 'Save' }
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('button').attributes('disabled')).toBeDefined();
      wrapper.unmount();
    });

    it('marks the loading icon as aria-hidden', async () => {
      const wrapper = mount(SButtonLoading, {
        props: { loading: true, loadingPosition: 'start' },
        slots: { default: 'Save' }
      });
      await wrapper.vm.$nextTick();
      // The Icon component renders an svg/span; assert the aria-hidden attr is forwarded
      expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true);
      wrapper.unmount();
    });
  });

  describe('autoLoading', () => {
    // Restore real timers after each autoLoading test so fake timers never leak
    // into the subsequent accessibility suite (which would otherwise time out
    // because axe.run schedules macrotasks that never fire under fake timers).
    afterEach(() => {
      vi.useRealTimers();
    });

    it('toggles loading state during click and clears it after the duration', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SButtonLoading, {
        props: { autoLoading: true, loadingDuration: 1000 },
        slots: { default: 'Save' },
        attachTo: document.body
      });

      await wrapper.find('button').trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('button').attributes('aria-busy')).toBe('true');

      // advanceTimersByTimeAsync flushes both the timer and the microtask queue
      // (the `await new Promise(...)` inside onClick resolves after the timeout).
      await vi.advanceTimersByTimeAsync(1000);
      await wrapper.vm.$nextTick();
      expect(wrapper.find('button').attributes('aria-busy')).toBeUndefined();

      wrapper.unmount();
    });

    it('invokes the click handler even when autoLoading is false', async () => {
      const onClick = vi.fn();
      const wrapper = mount(SButtonLoading, {
        props: { autoLoading: false, onClick },
        slots: { default: 'Save' }
      });

      await wrapper.find('button').trigger('click');
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(wrapper.find('button').attributes('aria-busy')).toBeUndefined();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when not loading', async () => {
      const wrapper = mount(SButtonLoading, {
        slots: { default: 'Save' },
        attachTo: document.body
      });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});

describe('SButtonIcon', () => {
  it('renders a button element', () => {
    const wrapper = mount(SButtonIcon, { props: { icon: 'lucide:plus' } });
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('applies the default ghost/square/accent variant classes', () => {
    const wrapper = mount(SButtonIcon, { props: { icon: 'lucide:plus' } });
    const classes = wrapper.find('button').classes();
    // buttonVariants base always includes these
    expect(classes.some(c => c.includes('inline-flex'))).toBe(true);
  });

  it('forwards iconClass to the icon element', () => {
    const wrapper = mount(SButtonIcon, {
      props: { icon: 'lucide:plus', iconClass: 'my-icon-class' }
    });
    expect(wrapper.find('.my-icon-class').exists()).toBe(true);
  });

  it('respects the disabled prop', () => {
    const wrapper = mount(SButtonIcon, { props: { icon: 'lucide:plus', disabled: true } });
    expect(wrapper.find('button').attributes('aria-disabled')).toBe('true');
  });
});

describe('SButtonLink', () => {
  it('renders an anchor when given an href', () => {
    const wrapper = mount(SButtonLink, {
      props: { href: 'https://soybeanjs.cn' },
      slots: { default: 'Visit' }
    });
    const anchor = wrapper.find('a');
    expect(anchor.exists()).toBe(true);
    expect(anchor.attributes('href')).toBe('https://soybeanjs.cn');
  });

  it('renders an anchor when given a `to` string', () => {
    const wrapper = mount(SButtonLink, {
      props: { to: '/about' },
      slots: { default: 'Go' }
    });
    expect(wrapper.find('a').exists()).toBe(true);
  });

  it('applies button variant classes to the anchor', () => {
    const wrapper = mount(SButtonLink, {
      props: { href: 'https://soybeanjs.cn', variant: 'link' },
      slots: { default: 'Visit' }
    });
    expect(
      wrapper
        .find('a')
        .classes()
        .some(c => c.includes('inline-flex'))
    ).toBe(true);
  });

  it('marks the link as aria-disabled when disabled', () => {
    const wrapper = mount(SButtonLink, {
      props: { href: 'https://soybeanjs.cn', disabled: true },
      slots: { default: 'Visit' }
    });
    expect(wrapper.find('a').attributes('aria-disabled')).toBe('true');
  });
});

describe('SButtonGroup', () => {
  const mountGroup = (options: Record<string, unknown> = {}) =>
    mount(SConfigProvider, {
      slots: {
        default: () =>
          h(
            SButtonGroup,
            { class: 'group-root', ...(options.props as object) },
            () => options.slots ?? [h(SButton, () => 'A'), h(SButton, () => 'B')]
          )
      },
      attachTo: document.body
    });

  it('renders its children', () => {
    const wrapper = mountGroup();
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].text()).toBe('A');
    expect(buttons[1].text()).toBe('B');
    wrapper.unmount();
  });

  it('applies the group root class', () => {
    const wrapper = mountGroup();
    expect(wrapper.find('.group-root').exists()).toBe(true);
    wrapper.unmount();
  });

  it('propagates disabled to descendant buttons', () => {
    const wrapper = mountGroup({ props: { disabled: true } });
    const buttons = wrapper.findAll('button');
    expect(buttons[0].attributes('aria-disabled')).toBe('true');
    expect(buttons[1].attributes('aria-disabled')).toBe('true');
    wrapper.unmount();
  });

  it('propagates color and variant to descendant buttons', () => {
    const wrapper = mountGroup({ props: { color: 'destructive', variant: 'outline' } });
    const buttons = wrapper.findAll('button');
    // outline + destructive adds a `border-destructive` class via compoundVariants
    expect(buttons[0].classes()).toContain('border-destructive');
    expect(buttons[1].classes()).toContain('border-destructive');
    wrapper.unmount();
  });

  it('a child own prop takes precedence over the group value', () => {
    const wrapper = mount(SConfigProvider, {
      slots: {
        default: () =>
          h(SButtonGroup, { color: 'destructive' }, () => [
            h(SButton, { color: 'success' }, () => 'Override'),
            h(SButton, () => 'Inherit')
          ])
      },
      attachTo: document.body
    });

    const buttons = wrapper.findAll('button');
    // The first child sets color="success"; outline/solid solid variant for success
    // uses bg-success, while destructive would use bg-destructive.
    expect(buttons[0].classes()).toContain('bg-success');
    expect(buttons[1].classes()).toContain('bg-destructive');
    wrapper.unmount();
  });

  it('defaults to horizontal orientation', () => {
    const wrapper = mountGroup();
    // horizontal base adds `inline-flex`
    expect(wrapper.find('.group-root').classes()).toContain('inline-flex');
    wrapper.unmount();
  });

  it('supports vertical orientation', () => {
    const wrapper = mountGroup({ props: { orientation: 'vertical' } });
    const root = wrapper.find('.group-root');
    expect(root.classes()).toContain('flex');
    expect(root.classes()).toContain('flex-col');
    wrapper.unmount();
  });

  it('sets role="group" on the root element', () => {
    const wrapper = mountGroup();
    expect(wrapper.find('.group-root').attributes('role')).toBe('group');
    wrapper.unmount();
  });

  it('carries the data-vean-button-group attribute', () => {
    const wrapper = mountGroup();
    expect(wrapper.find('.group-root').attributes('data-vean-button-group')).toBeDefined();
    wrapper.unmount();
  });

  it('reflects orientation via data-orientation', () => {
    const horizontal = mountGroup();
    expect(horizontal.find('.group-root').attributes('data-orientation')).toBe('horizontal');
    horizontal.unmount();

    const vertical = mountGroup({ props: { orientation: 'vertical' } });
    expect(vertical.find('.group-root').attributes('data-orientation')).toBe('vertical');
    vertical.unmount();
  });

  it('reflects dir prop on the root element', () => {
    const wrapper = mountGroup({ props: { dir: 'rtl' } });
    expect(wrapper.find('.group-root').attributes('dir')).toBe('rtl');
    wrapper.unmount();
  });

  it('does not leak style props to the DOM', () => {
    const wrapper = mountGroup({
      props: { color: 'destructive', fitContent: true, shape: 'circle' }
    });
    const root = wrapper.find('.group-root');
    expect(root.attributes('color')).toBeUndefined();
    expect(root.attributes('fitcontent')).toBeUndefined();
    expect(root.attributes('shape')).toBeUndefined();
    expect(root.attributes('variant')).toBeUndefined();
    expect(root.attributes('shadow')).toBeUndefined();
    expect(root.attributes('size')).toBeUndefined();
    wrapper.unmount();
  });

  it('supports `as` polymorphism', () => {
    const wrapper = mountGroup({ props: { as: 'div' } });
    expect(wrapper.find('.group-root').element.tagName).toBe('DIV');
    wrapper.unmount();
  });

  it('has no a11y violations', async () => {
    const wrapper = mountGroup();
    const violations = await getA11yViolations(wrapper.element);
    expect(violations).toEqual([]);
    wrapper.unmount();
  });
});
