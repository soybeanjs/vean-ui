import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { WatermarkCompact, WatermarkRoot } from '@vean/aria/watermark';
import SWatermark from '@/components/watermark/watermark.vue';

async function flushMutationObserver() {
  await Promise.resolve();
  await nextTick();
  await Promise.resolve();
  await nextTick();
  await Promise.resolve();
  await nextTick();
}

// Mock canvas API for happy-dom test environment
function setupCanvasMock() {
  const originalCreateElement = document.createElement.bind(document);

  vi.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
    const el = originalCreateElement(tagName, options);

    if (tagName === 'canvas') {
      const canvasEl = el as HTMLCanvasElement;

      vi.spyOn(canvasEl, 'getContext').mockImplementation((contextId: string) => {
        if (contextId === '2d') {
          return {
            save: vi.fn(),
            restore: vi.fn(),
            translate: vi.fn(),
            rotate: vi.fn(),
            fillText: vi.fn(),
            drawImage: vi.fn(),
            measureText: vi.fn(() => ({ width: 100 })),
            font: '',
            fillStyle: '',
            textAlign: 'start',
            textBaseline: 'alphabetic'
          } as unknown as CanvasRenderingContext2D;
        }

        return null;
      });

      vi.spyOn(canvasEl, 'toDataURL').mockReturnValue('data:image/png;base64,mock');
    }

    return el;
  });
}

describe('SWatermark', () => {
  beforeEach(() => {
    setupCanvasMock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('rendering', () => {
    it('renders default slot content', () => {
      const wrapper = mount(SWatermark, {
        props: { content: 'CONFIDENTIAL' },
        slots: { default: 'Protected content' },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Protected content');
      wrapper.unmount();
    });

    it('renders the overlay element when content is provided', () => {
      const wrapper = mount(SWatermark, {
        props: { content: 'CONFIDENTIAL' },
        slots: { default: 'Protected content' },
        attachTo: document.body
      });

      const overlay = wrapper.find('[data-vean-watermark-overlay]');

      expect(overlay.exists()).toBe(true);
      wrapper.unmount();
    });

    it('does not render the overlay when no content or image is provided', () => {
      const wrapper = mount(SWatermark, {
        slots: { default: 'Protected content' },
        attachTo: document.body
      });

      const overlay = wrapper.find('[data-vean-watermark-overlay]');

      expect(overlay.exists()).toBe(false);
      wrapper.unmount();
    });

    it('applies custom class to the root element', () => {
      const wrapper = mount(SWatermark, {
        props: { content: 'DRAFT', class: 'my-custom-class' },
        slots: { default: 'Protected content' },
        attachTo: document.body
      });

      const root = wrapper.find('[data-vean-watermark-root]');

      expect(root.classes()).toContain('my-custom-class');
      wrapper.unmount();
    });
  });

  describe('Aria primitives', () => {
    it('WatermarkRoot renders content slot', () => {
      const wrapper = mount(WatermarkRoot, {
        props: { content: 'TEST' },
        slots: { default: 'Slotted content' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-watermark-root]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Slotted content');
      wrapper.unmount();
    });

    it('WatermarkCompact composes Root and Overlay', () => {
      const wrapper = mount(WatermarkCompact, {
        props: { content: 'TEST' },
        slots: { default: 'Slotted content' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-watermark-root]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-watermark-overlay]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Slotted content');
      wrapper.unmount();
    });

    it('WatermarkOverlay has aria-hidden', () => {
      const wrapper = mount(WatermarkCompact, {
        props: { content: 'TEST' },
        slots: { default: 'Content' },
        attachTo: document.body
      });

      const overlay = wrapper.find('[data-vean-watermark-overlay]');

      expect(overlay.attributes('aria-hidden')).toBe('true');
      wrapper.unmount();
    });

    it('repairs a tampered overlay when defense is enabled', async () => {
      const wrapper = mount(WatermarkCompact, {
        props: { content: 'TEST', defense: true },
        slots: { default: 'Content' },
        attachTo: document.body
      });

      const overlay = wrapper.find('[data-vean-watermark-overlay]').element as HTMLDivElement;

      overlay.removeAttribute('data-vean-watermark-overlay');
      overlay.removeAttribute('aria-hidden');
      overlay.className = 'tampered';
      overlay.style.cssText = 'display: none;';
      overlay.setAttribute('hidden', '');

      await flushMutationObserver();

      const repairedOverlay = wrapper.find('[data-vean-watermark-overlay]');

      expect(repairedOverlay.exists()).toBe(true);
      expect(repairedOverlay.attributes('aria-hidden')).toBe('true');
      expect(repairedOverlay.attributes()).not.toHaveProperty('hidden');
      expect((repairedOverlay.element as HTMLDivElement).style.backgroundImage).toContain('url(');
      expect((repairedOverlay.element as HTMLDivElement).className).toBe('');
      wrapper.unmount();
    });
  });

  describe('props', () => {
    it('accepts font configuration props', () => {
      const wrapper = mount(SWatermark, {
        props: {
          content: 'CONFIDENTIAL',
          fontSize: 24,
          fontColor: 'rgba(255, 0, 0, 0.15)',
          fontWeight: 'bold',
          fontFamily: 'serif'
        },
        slots: { default: 'Content' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-watermark-overlay]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('accepts rotation and gap props', () => {
      const wrapper = mount(SWatermark, {
        props: {
          content: 'WATERMARK',
          rotate: -45,
          gap: [200, 150]
        },
        slots: { default: 'Content' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-watermark-overlay]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('accepts cross pattern prop', () => {
      const wrapper = mount(SWatermark, {
        props: {
          content: 'CROSS',
          cross: true
        },
        slots: { default: 'Content' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-watermark-overlay]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('accepts fixed width and height', () => {
      const wrapper = mount(SWatermark, {
        props: {
          content: 'FIXED',
          width: 200,
          height: 100
        },
        slots: { default: 'Content' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-watermark-overlay]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('accepts fullscreen prop', () => {
      const wrapper = mount(SWatermark, {
        props: {
          content: 'FULLSCREEN',
          fullscreen: true
        },
        slots: { default: 'Content' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-watermark-overlay]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('restores a removed overlay when defense is enabled', async () => {
      const wrapper = mount(SWatermark, {
        props: {
          content: 'DEFENSE',
          defense: true
        },
        slots: { default: 'Content' },
        attachTo: document.body
      });

      wrapper.find('[data-vean-watermark-overlay]').element.remove();

      await flushMutationObserver();

      expect(wrapper.find('[data-vean-watermark-overlay]').exists()).toBe(true);
      wrapper.unmount();
    });
  });
});
