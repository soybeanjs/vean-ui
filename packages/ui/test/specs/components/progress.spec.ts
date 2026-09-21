import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import { progress } from '@/components/progress';
import SProgressCircle from '@/components/progress/progress-circle.vue';
import SProgress from '@/components/progress/progress.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SProgress', () => {
  afterEach(() => {
    progress.reset();
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders progressbar semantics and custom class', () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SProgress },
          template: `
          <SConfigProvider>
            <SProgress class="my-progress" :model-value="45" />
          </SConfigProvider>
        `
        },
        {
          attachTo: document.body
        }
      );

      const progressbar = wrapper.get('[role="progressbar"]');

      expect(progressbar.classes()).toContain('my-progress');
      expect(progressbar.attributes('aria-valuenow')).toBe('45');
      wrapper.unmount();
    });

    it('falls back to a localized aria-label when indeterminate', () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SProgress },
          template: `
          <SConfigProvider>
            <SProgress />
          </SConfigProvider>
        `
        },
        {
          attachTo: document.body
        }
      );

      const progressbar = wrapper.get('[role="progressbar"]');
      expect(progressbar.attributes('aria-label')).toBe('Progress');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SProgress },
          template: `
          <SConfigProvider>
            <SProgress :model-value="45" />
          </SConfigProvider>
        `
        },
        {
          attachTo: document.body
        }
      );

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('renders circle progress slot content without a11y violations', async () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SProgressCircle },
          template: `
          <SConfigProvider>
            <SProgressCircle class="my-circle-progress" :model-value="72">
              <template #default="{ valuePercent }">
                <span>{{ Math.round(valuePercent ?? 0) }}%</span>
              </template>
            </SProgressCircle>
          </SConfigProvider>
        `
        },
        {
          attachTo: document.body
        }
      );

      const progressbar = wrapper.get('[role="progressbar"]');
      const label = wrapper.get('[data-vean-progress-label]');
      const violations = await getA11yViolations(wrapper.element);

      expect(progressbar.classes()).toContain('my-circle-progress');
      expect(label.text()).toBe('72%');
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
