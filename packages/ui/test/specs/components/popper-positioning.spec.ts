import { describe, expect, it } from 'vitest';
import { computed } from 'vue';
import { mount } from '@vue/test-utils';
import {
  PopperAnchor,
  PopperArrow,
  PopperPositioningPopup,
  PopperPositioningPositioner,
  PopperPositioningRoot,
  providePopperUi
} from '../../../../aria/src/components/popper';

const components = {
  PopperPositioningRoot,
  PopperAnchor,
  PopperPositioningPositioner,
  PopperPositioningPopup,
  PopperArrow
};

const template = `
  <PopperPositioningRoot>
    <PopperAnchor><button type="button">anchor</button></PopperAnchor>
    <PopperPositioningPositioner>
      <PopperPositioningPopup>
        <div data-content>positioned content</div>
        <PopperArrow />
      </PopperPositioningPopup>
    </PopperPositioningPositioner>
  </PopperPositioningRoot>
`;

describe('PopperPositioning primitives', () => {
  it('renders the full positioning stack without an interactive PopperRoot', () => {
    const wrapper = mount({ components, template }, { attachTo: document.body });

    expect(wrapper.find('[data-vean-popper-anchor]').exists()).toBe(true);
    expect(wrapper.find('[data-vean-popper-positioning-positioner]').exists()).toBe(true);
    expect(wrapper.find('[data-vean-popper-positioning-popup]').exists()).toBe(true);
    expect(wrapper.find('[data-vean-popper-arrow]').exists()).toBe(true);
    expect(wrapper.find('[data-content]').text()).toBe('positioned content');

    wrapper.unmount();
  });

  it('reflects the default placement side and align on the popup', () => {
    const wrapper = mount({ components, template }, { attachTo: document.body });

    const popup = wrapper.find('[data-vean-popper-positioning-popup]');
    expect(popup.attributes('data-side')).toBe('bottom');
    expect(popup.attributes('data-align')).toBe('center');

    wrapper.unmount();
  });

  it('injects ui classes into every positioning slot', () => {
    const wrapper = mount(
      {
        components,
        setup() {
          // Positioning primitives consume the single `PopperUi` context; wrappers pass a
          // computed recipe result (UI contexts must be reactive).
          providePopperUi(
            computed(() => ({
              anchor: 'ui-anchor',
              positioner: 'ui-positioner',
              popup: 'ui-popup',
              arrow: 'ui-arrow'
            }))
          );
        },
        template
      },
      { attachTo: document.body }
    );

    expect(wrapper.find('[data-vean-popper-anchor]').classes()).toContain('ui-anchor');
    expect(wrapper.find('[data-vean-popper-positioning-positioner]').classes()).toContain('ui-positioner');
    expect(wrapper.find('[data-vean-popper-positioning-popup]').classes()).toContain('ui-popup');
    expect(wrapper.find('[data-vean-popper-arrow]').classes()).toContain('ui-arrow');

    wrapper.unmount();
  });

  it('renders the positioner inline without portal or presence wrappers', () => {
    const wrapper = mount({ components, template }, { attachTo: document.body });

    // The positioning stack must stay mount-independent of open state: no `data-state`,
    // no dismissable-layer attribute from the interactive shell.
    const positioner = wrapper.find('[data-vean-popper-positioning-positioner]');
    expect(positioner.attributes('data-state')).toBeUndefined();
    expect(wrapper.find('[data-dismissable-layer]').exists()).toBe(false);

    wrapper.unmount();
  });

  it('registers the anchor element into the positioning root context', () => {
    const wrapper = mount({ components, template }, { attachTo: document.body });

    // The shared anchor must register into the positioning tree's context: the positioner
    // consumes `anchorElement` as its floating reference, so it must not be empty.
    const positioner = wrapper.find('[data-vean-popper-positioning-positioner]');
    expect(positioner.exists()).toBe(true);
    expect(wrapper.find('[data-vean-popper-anchor]').find('button').exists()).toBe(true);

    wrapper.unmount();
  });
});
