import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick, defineComponent, h, shallowRef } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { useDismissableLayer } from '../../../../aria/src/composables/use-dismissable-layer';

// Minimal layer that wires the composable to a real element. `present` controls whether the
// layer element is rendered (mirroring how popup impls are gated by `v-if="isPresent"`).
const TestLayer = defineComponent({
  props: {
    disable: { type: Boolean, default: false },
    present: { type: Boolean, default: true },
    enable: { type: Boolean, default: true }
  },
  setup(props) {
    const layerElement = shallowRef<HTMLElement | undefined>();

    useDismissableLayer(layerElement, {
      disableOutsidePointerEvents: () => props.disable,
      enable: () => props.enable
    });

    return () => (props.present ? h('div', { ref: layerElement, 'data-dismissable-layer': '' }) : null);
  }
});

let wrappers: VueWrapper[] = [];

async function mountLayer(disable = true, present = true): Promise<VueWrapper> {
  const wrapper = mount(TestLayer, {
    props: { disable, present },
    attachTo: document.body
  });
  wrappers.push(wrapper);
  // Let the element ref settle and the layer watcher run.
  await nextTick();
  await nextTick();
  return wrapper;
}

const flush = () => Promise.resolve().then(() => nextTick());

// Outside listeners are attached on a macrotask (so the interaction that mounts a layer is never
// read as an outside one), which a test has to let through before pressing.
const flushPendingTimers = () => new Promise<void>(resolve => void setTimeout(resolve, 0));

// Layer whose closure is reported, so a test can drive `enable` independently of presence —
// mirroring a popup that stays mounted through its exit animation after `open` turns false.
const GatedLayer = defineComponent({
  props: {
    enable: { type: Boolean, default: true }
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    const layerElement = shallowRef<HTMLElement | undefined>();

    useDismissableLayer(layerElement, {
      enable: () => props.enable,
      onDismiss: () => emit('dismiss')
    });

    return () => h('div', { ref: layerElement, 'data-dismissable-layer': '' });
  }
});

const pressOutside = () => document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

describe('useDismissableLayer enable gate', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    wrappers.forEach(wrapper => wrapper.unmount());
    wrappers = [];
  });

  it('only dismisses outside presses that begin while the layer is enabled', async () => {
    const wrapper = mount(GatedLayer, { props: { enable: true }, attachTo: document.body });
    wrappers.push(wrapper);
    await nextTick();
    await nextTick();
    await flushPendingTimers();

    pressOutside();
    expect(wrapper.emitted('dismiss')).toHaveLength(1);

    // Closing keeps the layer mounted while its exit animation runs: outside presses are ignored.
    await wrapper.setProps({ enable: false });
    await nextTick();
    pressOutside();
    expect(wrapper.emitted('dismiss')).toHaveLength(1);

    // The press that re-enables the layer must not dismiss the layer it just re-opened — the
    // listener is only re-attached once the current task is over.
    await wrapper.setProps({ enable: true });
    await nextTick();
    pressOutside();
    expect(wrapper.emitted('dismiss')).toHaveLength(1);

    await flushPendingTimers();
    pressOutside();
    expect(wrapper.emitted('dismiss')).toHaveLength(2);
  });
});

describe('useDismissableLayer body pointer-events', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.pointerEvents = '';
  });

  afterEach(() => {
    // Unmounting every mounted layer drains the module-level layer registry, restoring the
    // body's pointer-events and leaving a clean slate for the next test.
    wrappers.forEach(wrapper => wrapper.unmount());
    wrappers = [];
    document.body.style.pointerEvents = '';
  });

  it('locks body pointer-events while a disabling layer is present and restores on close', async () => {
    const wrapper = await mountLayer(true, true);
    expect(document.body.style.pointerEvents).toBe('none');

    await wrapper.setProps({ present: false });
    await flush();
    expect(document.body.style.pointerEvents).toBe('');
  });

  it('releases the body lock as soon as the layer closes, not when it unmounts', async () => {
    const wrapper = await mountLayer(true, true);
    expect(document.body.style.pointerEvents).toBe('none');

    // A closed layer can still be mounted (exit animation in flight). The page has to be handed back
    // then, or the lock swallows the next press — typically the one that reopens the layer.
    await wrapper.setProps({ enable: false });
    await flush();
    expect(document.body.style.pointerEvents).toBe('');

    await wrapper.setProps({ enable: true });
    await flush();
    expect(document.body.style.pointerEvents).toBe('none');
  });

  it('keeps body pointer-events locked when a nested layer closes while an outer layer stays open', async () => {
    const outer = await mountLayer(true, true);
    expect(document.body.style.pointerEvents).toBe('none');

    // Open a nested disabling layer on top.
    const inner = await mountLayer(true, true);
    expect(document.body.style.pointerEvents).toBe('none');

    // Close the inner layer while the outer is still open (#2674).
    await inner.setProps({ present: false });
    await flush();
    expect(document.body.style.pointerEvents).toBe('none');

    // Closing the outer layer restores the body.
    await outer.setProps({ present: false });
    await flush();
    expect(document.body.style.pointerEvents).toBe('');
  });

  it('restores and re-locks the body when a single mounted layer toggles disableOutsidePointerEvents', async () => {
    const wrapper = await mountLayer(true, true);
    expect(document.body.style.pointerEvents).toBe('none');

    // Toggle the prop off without unmounting (e.g. a modal Menu closing while mounted).
    await wrapper.setProps({ disable: false });
    await flush();
    expect(document.body.style.pointerEvents).toBe('');

    // Toggling back on locks the body again (a stale entry would keep `size === 0` false).
    await wrapper.setProps({ disable: true });
    await flush();
    expect(document.body.style.pointerEvents).toBe('none');
  });
});
