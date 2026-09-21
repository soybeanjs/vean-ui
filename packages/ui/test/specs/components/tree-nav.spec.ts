import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import { STreeNav } from '@/components/tree-nav';
import type { TreeNavOptionData } from '@/components/tree-nav';
import { getA11yViolations } from '../../shared/a11y';

const items: TreeNavOptionData[] = [
  {
    value: 'docs',
    label: 'Docs',
    children: [
      { value: 'getting-started', label: 'Getting Started' },
      {
        value: 'components',
        label: 'Components',
        children: [
          { value: 'button', label: 'Button' },
          { value: 'input', label: 'Input' }
        ]
      },
      { value: 'print', label: 'Print', disabled: true }
    ]
  },
  {
    value: 'blog',
    label: 'Blog',
    children: [{ value: 'announcements', label: 'Announcements' }]
  },
  { value: 'pricing', label: 'Pricing' },
  { value: 'private', label: 'Private', disabled: true },
  { value: 'github', label: 'GitHub', href: 'https://github.com/soybeanjs/vean-ui' }
];

function mountTreeNav(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { SConfigProvider, STreeNav },
      setup() {
        return { items };
      },
      template: `
        <SConfigProvider>
          <STreeNav :items="items" :portal-props="{ disabled: true }" v-bind="extraProps" />
        </SConfigProvider>
      `,
      data() {
        return { extraProps: props };
      }
    },
    { attachTo: document.body }
  );
}

function findLeafButton(wrapper: ReturnType<typeof mount>, label: string) {
  return wrapper.findAll('button').find(button => button.text() === label);
}

describe('STreeNav', () => {
  describe('rendering', () => {
    it('renders the nav root with branch triggers, plain leaves and link leaves', () => {
      const wrapper = mountTreeNav();

      expect(wrapper.find('[data-vean-tree-nav]').exists()).toBe(true);
      // Branch entries render dropdown triggers for "docs" and "blog".
      expect(wrapper.findAll('[data-vean-dropdown-menu-trigger]')).toHaveLength(2);
      // Plain leaf and disabled leaf render as buttons.
      expect(findLeafButton(wrapper, 'Pricing')).toBeTruthy();
      const privateLeaf = findLeafButton(wrapper, 'Private');
      expect(privateLeaf).toBeTruthy();
      expect(privateLeaf?.attributes('aria-disabled')).toBe('true');
      // Link leaf renders an anchor.
      expect(wrapper.find('a[href="https://github.com/soybeanjs/vean-ui"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('applies the size variant class to the root', () => {
      const wrapper = mountTreeNav({ size: 'sm' });

      expect(wrapper.find('[data-vean-tree-nav]').classes()).toContain('text-xs');

      wrapper.unmount();
    });

    it('renders a chevron icon inside branch triggers', () => {
      const wrapper = mountTreeNav();

      const docsTrigger = wrapper.find('[data-vean-dropdown-menu-trigger]');
      expect(docsTrigger.find('svg').exists()).toBe(true);

      wrapper.unmount();
    });

    it('filters hidden options from the bar and branch popups', async () => {
      const wrapper = mount(STreeNav, {
        props: {
          trigger: 'click',
          portalProps: { disabled: true },
          items: [
            { value: 'visible', label: 'Visible' },
            { value: 'hidden', label: 'Hidden', hidden: true },
            {
              value: 'branch',
              label: 'Branch',
              children: [
                { value: 'kept', label: 'Kept' },
                { value: 'dropped', label: 'Dropped', hidden: true }
              ]
            }
          ]
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Visible');
      expect(wrapper.text()).not.toContain('Hidden');

      const branchTrigger = wrapper.find('[data-vean-dropdown-menu-trigger]');
      await branchTrigger.trigger('click');
      await nextTick();
      await nextTick();

      expect(wrapper.text()).toContain('Kept');
      expect(wrapper.text()).not.toContain('Dropped');

      // Hidden options must not break selection derivation.
      const keptItem = wrapper.findAll('[role="menuitem"]').find(item => item.text() === 'Kept');
      await keptItem!.trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['kept']);

      wrapper.unmount();
    });

    it('renders a branch whose children are all hidden as a plain leaf', async () => {
      const wrapper = mount(STreeNav, {
        props: {
          trigger: 'click',
          portalProps: { disabled: true },
          items: [
            { value: 'visible', label: 'Visible' },
            {
              value: 'hidden-only-branch',
              label: 'Hidden Only Branch',
              children: [{ value: 'dropped', label: 'Dropped', hidden: true }]
            }
          ]
        },
        attachTo: document.body
      });

      // No dropdown trigger is left for a branch with nothing visible to show.
      expect(wrapper.findAll('[data-vean-dropdown-menu-trigger]')).toHaveLength(0);

      const leaf = wrapper.findAll('button').find(button => button.text() === 'Hidden Only Branch');
      expect(leaf).toBeTruthy();

      await leaf!.trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['hidden-only-branch']);

      wrapper.unmount();
    });
  });

  describe('selection state', () => {
    it('marks the selected top-level leaf as selected via data-selected', () => {
      const wrapper = mountTreeNav({ defaultValue: 'pricing' });

      const pricing = findLeafButton(wrapper, 'Pricing');
      expect(pricing?.attributes('data-selected')).toBe('true');
      expect(pricing?.attributes('data-child-selected')).toBeUndefined();

      // Siblings are marked inactive.
      const githubLink = wrapper.find('a[href="https://github.com/soybeanjs/vean-ui"]');
      expect(githubLink.attributes('data-selected')).toBe('false');

      wrapper.unmount();
    });

    it('highlights the ancestor chain of a selected nested leaf via data-child-selected', () => {
      const wrapper = mountTreeNav({ defaultValue: 'button' });

      const [docsTrigger, blogTrigger] = wrapper.findAll('[data-vean-dropdown-menu-trigger]');
      expect(docsTrigger.attributes('data-child-selected')).toBe('');
      expect(blogTrigger.attributes('data-child-selected')).toBeUndefined();

      wrapper.unmount();
    });

    it('never marks branch triggers selected even when their own value matches', () => {
      // Container nodes carry no selected state, aligned with TreeMenu.
      const wrapper = mountTreeNav({ defaultValue: 'docs' });

      const docsTrigger = wrapper.find('[data-vean-dropdown-menu-trigger]');
      expect(docsTrigger.attributes('data-selected')).toBe('false');

      wrapper.unmount();
    });
  });

  describe('interaction', () => {
    it('emits update:modelValue and select when a plain leaf is clicked', async () => {
      const wrapper = mount(STreeNav, {
        props: { items, portalProps: { disabled: true } },
        attachTo: document.body
      });

      await findLeafButton(wrapper, 'Pricing')!.trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['pricing']);
      expect(wrapper.emitted('select')?.at(-1)?.[0]).toMatchObject({ value: 'pricing' });

      wrapper.unmount();
    });

    it('marks the clicked leaf as selected in uncontrolled mode', async () => {
      const wrapper = mountTreeNav();

      const pricing = findLeafButton(wrapper, 'Pricing');
      await pricing!.trigger('click');

      expect(pricing!.attributes('data-selected')).toBe('true');

      wrapper.unmount();
    });

    it('ignores clicks on disabled leaves', async () => {
      const wrapper = mountTreeNav();

      await findLeafButton(wrapper, 'Private')!.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      expect(wrapper.emitted('select')).toBeUndefined();

      wrapper.unmount();
    });

    it('respects controlled mode and keeps the bound selection unchanged', async () => {
      const wrapper = mount(STreeNav, {
        props: { items, modelValue: 'pricing', portalProps: { disabled: true } },
        attachTo: document.body
      });

      const githubLink = wrapper.find('a[href="https://github.com/soybeanjs/vean-ui"]');
      await githubLink.trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['github']);

      // The controlled value stays "pricing": only the emit happens.
      expect(findLeafButton(wrapper, 'Pricing')?.attributes('data-selected')).toBe('true');
      expect(githubLink.attributes('data-selected')).toBe('false');

      wrapper.unmount();
    });

    it('emits update:modelValue for a nested leaf clicked inside a branch popup', async () => {
      const wrapper = mount(STreeNav, {
        props: { items, trigger: 'click', portalProps: { disabled: true } },
        attachTo: document.body
      });

      const docsTrigger = wrapper.find('[data-vean-dropdown-menu-trigger]');
      await docsTrigger.trigger('click');
      await nextTick();
      await nextTick();

      expect(docsTrigger.attributes('aria-expanded')).toBe('true');
      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(true);

      const startedItem = wrapper.findAll('[role="menuitem"]').find(item => item.text() === 'Getting Started');
      expect(startedItem).toBeTruthy();
      await startedItem!.trigger('click');
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['getting-started']);

      // The ancestor chain stays highlighted after selection.
      expect(docsTrigger.attributes('data-child-selected')).toBe('');

      wrapper.unmount();
    });
  });

  describe('collapsible', () => {
    it('renders the overflow measurement container when collapsible', () => {
      const wrapper = mountTreeNav({ collapsible: true });

      expect(wrapper.find('[data-vean-tree-nav-overflow]').exists()).toBe(true);

      // In the test environment content does not overflow, so no "more"
      // trigger is rendered and all items stay visible.
      expect(wrapper.findAll('[data-vean-dropdown-menu-trigger]')).toHaveLength(2);
      expect(wrapper.text()).toContain('Pricing');
      expect(wrapper.text()).toContain('GitHub');

      wrapper.unmount();
    });

    it('does not render the overflow container without collapsible', () => {
      const wrapper = mountTreeNav();

      expect(wrapper.find('[data-vean-tree-nav-overflow]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('drops the trailing "more" branch when collapsible is turned off', async () => {
      const wrapper = mount(STreeNav, {
        props: {
          trigger: 'click',
          portalProps: { disabled: true },
          collapsible: true,
          moreLabel: 'More',
          items: items.slice(0, 2)
        },
        attachTo: document.body
      });

      const container = wrapper.find('[data-vean-tree-nav-overflow]').element as HTMLElement;
      const root = wrapper.find('[data-vean-tree-nav]').element as HTMLElement;

      // happy-dom performs no layout, so force the measured overflow the reflow
      // loop reads: the bar always overflows its container.
      Object.defineProperty(container, 'clientWidth', { configurable: true, get: () => 80 });
      Object.defineProperty(root, 'scrollWidth', { configurable: true, get: () => 800 });

      // A new items array re-runs the reflow, which now sees an overflowing bar.
      await wrapper.setProps({ items });
      await flushPromises();

      expect(wrapper.text()).toContain('More');

      await wrapper.setProps({ collapsible: false });
      await flushPromises();

      // Regression guard: the measured overflow count leaked out of collapsible
      // mode and kept rendering the "more" branch over a bar that now holds
      // every entry.
      expect(wrapper.find('[data-vean-tree-nav-overflow]').exists()).toBe(false);
      expect(wrapper.text()).not.toContain('More');
      expect(findLeafButton(wrapper, 'Pricing')).toBeTruthy();
      expect(wrapper.findAll('[data-vean-dropdown-menu-trigger]')).toHaveLength(2);

      wrapper.unmount();
    });
  });

  describe('keyboard navigation', () => {
    it('turns the top level into a single roving tab stop', async () => {
      const wrapper = mountTreeNav({ trigger: 'click' });

      const root = wrapper.find('[data-vean-tree-nav]');

      // The group's tabbability settles after the items register themselves.
      await nextTick();

      expect(root.attributes('tabindex')).toBe('0');

      // Every top-level entry (branch triggers, leaves, the link) is removed
      // from the natural tab order until it becomes the roving target.
      root.findAll('button, a').forEach(item => {
        expect(item.attributes('tabindex')).toBe('-1');
      });

      wrapper.unmount();
    });

    it('focuses the selected item when the bar receives focus', async () => {
      const wrapper = mountTreeNav({ trigger: 'click', defaultValue: 'pricing' });

      await wrapper.find('[data-vean-tree-nav]').trigger('focus');
      await nextTick();

      expect(document.activeElement?.textContent).toContain('Pricing');
      expect(findLeafButton(wrapper, 'Pricing')?.attributes('tabindex')).toBe('0');

      wrapper.unmount();
    });

    it('roams top-level items with ←/→ and Home/End, skipping disabled items', async () => {
      const wrapper = mountTreeNav({ trigger: 'click', defaultValue: 'pricing' });

      const pricing = findLeafButton(wrapper, 'Pricing')!;
      (pricing.element as HTMLElement).focus();

      // The disabled "private" leaf is skipped.
      await pricing.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();

      expect(document.activeElement?.textContent).toContain('GitHub');

      await pricing.trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();

      expect(document.activeElement?.textContent).toContain('Blog');

      await pricing.trigger('keydown', { key: 'Home' });
      await nextTick();

      expect(document.activeElement?.textContent).toContain('Docs');

      await pricing.trigger('keydown', { key: 'End' });
      await nextTick();

      expect(document.activeElement?.textContent).toContain('GitHub');

      wrapper.unmount();
    });

    it('roams across branch triggers with ←/→ without opening popups', async () => {
      const wrapper = mountTreeNav({ trigger: 'click' });

      const [docsTrigger, blogTrigger] = wrapper.findAll('[data-vean-dropdown-menu-trigger]');
      (docsTrigger.element as HTMLElement).focus();

      // Branch triggers are roam targets like any other entry: → moves on.
      await docsTrigger.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();

      expect(document.activeElement).toBe(blogTrigger.element);
      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(false);

      await blogTrigger.trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();

      expect(document.activeElement).toBe(docsTrigger.element);
      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('opens a branch popup with ArrowDown and keeps popup keys with the menu', async () => {
      const wrapper = mountTreeNav({ trigger: 'click' });

      const docsTrigger = wrapper.find('[data-vean-dropdown-menu-trigger]');
      (docsTrigger.element as HTMLElement).focus();

      // Opening stays on the explicit keys: ArrowDown (or Enter/Space).
      await docsTrigger.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();
      await nextTick();

      expect(docsTrigger.attributes('aria-expanded')).toBe('true');
      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(true);

      const menuItem = wrapper.findAll('[role="menuitem"]').find(item => item.text() === 'Getting Started');

      expect(menuItem).toBeTruthy();

      // Non-switching popup keys stay with the menu machinery.
      await menuItem!.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();

      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(true);
      expect(docsTrigger.attributes('aria-expanded')).toBe('true');

      wrapper.unmount();
    });

    it('switches branch popups with ←/→ from inside an open popup', async () => {
      const wrapper = mountTreeNav({ trigger: 'click' });

      const [docsTrigger, blogTrigger] = wrapper.findAll('[data-vean-dropdown-menu-trigger]');
      (docsTrigger.element as HTMLElement).focus();

      await docsTrigger.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();
      await nextTick();

      // ArrowRight on a plain item without a submenu moves to the next
      // trigger and opens its popup. Menubar convention: focus rests on the
      // trigger; ↓ walks into the menu items.
      const menuItem = wrapper.findAll('[role="menuitem"]').find(item => item.text() === 'Getting Started');
      await menuItem!.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await nextTick();

      expect(blogTrigger.attributes('aria-expanded')).toBe('true');
      expect(docsTrigger.attributes('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(blogTrigger.element);

      // ArrowLeft walks back to the previous trigger and reopens its popup.
      await blogTrigger.trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();
      await nextTick();

      expect(docsTrigger.attributes('aria-expanded')).toBe('true');
      expect(blogTrigger.attributes('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(docsTrigger.element);

      wrapper.unmount();
    });

    it('closes the popup and focuses a following leaf with ArrowRight', async () => {
      const wrapper = mountTreeNav({ trigger: 'click' });

      const [, blogTrigger] = wrapper.findAll('[data-vean-dropdown-menu-trigger]');
      (blogTrigger.element as HTMLElement).focus();

      await blogTrigger.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();
      await nextTick();

      expect(blogTrigger.attributes('aria-expanded')).toBe('true');

      // The next entry is a plain leaf: the popup closes and only the focus
      // moves on.
      await blogTrigger.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await nextTick();

      expect(document.activeElement?.textContent).toContain('Pricing');
      expect(blogTrigger.attributes('aria-expanded')).toBe('false');
      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('lets a submenu trigger own ArrowRight to expand its own submenu', async () => {
      const wrapper = mountTreeNav({ trigger: 'click' });

      const [docsTrigger, blogTrigger] = wrapper.findAll('[data-vean-dropdown-menu-trigger]');
      (docsTrigger.element as HTMLElement).focus();

      await docsTrigger.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();
      await nextTick();

      const subTrigger = wrapper.findAll('[data-vean-menu-sub-trigger]').find(item => item.text() === 'Components');
      expect(subTrigger).toBeTruthy();

      await subTrigger!.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await nextTick();

      // The submenu expands instead of switching to the next bar entry.
      expect(subTrigger!.attributes('aria-expanded')).toBe('true');
      expect(document.activeElement).not.toBe(blogTrigger.element);
      expect(blogTrigger.attributes('aria-expanded')).toBe('false');

      wrapper.unmount();
    });

    it('switches to the next trigger from inside an open submenu with ArrowRight', async () => {
      const wrapper = mountTreeNav({ trigger: 'click' });

      const [docsTrigger, blogTrigger] = wrapper.findAll('[data-vean-dropdown-menu-trigger]');
      (docsTrigger.element as HTMLElement).focus();

      await docsTrigger.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();
      await nextTick();

      const subTrigger = wrapper.findAll('[data-vean-menu-sub-trigger]').find(item => item.text() === 'Components');
      await subTrigger!.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await nextTick();

      const buttonItem = wrapper.findAll('[role="menuitem"]').find(item => item.text() === 'Button');
      expect(buttonItem).toBeTruthy();

      // ArrowRight on a nested leaf closes every popup and moves to the next
      // trigger, opening its popup. Focus rests on the trigger (menubar).
      await buttonItem!.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await nextTick();

      expect(blogTrigger.attributes('aria-expanded')).toBe('true');
      expect(docsTrigger.attributes('aria-expanded')).toBe('false');
      expect(subTrigger!.attributes('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(blogTrigger.element);

      wrapper.unmount();
    });

    it('closes only the submenu with ArrowLeft inside it', async () => {
      const wrapper = mountTreeNav({ trigger: 'click' });

      const [docsTrigger] = wrapper.findAll('[data-vean-dropdown-menu-trigger]');
      (docsTrigger.element as HTMLElement).focus();

      await docsTrigger.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();
      await nextTick();

      const subTrigger = wrapper.findAll('[data-vean-menu-sub-trigger]').find(item => item.text() === 'Components');
      await subTrigger!.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await nextTick();

      const buttonItem = wrapper.findAll('[role="menuitem"]').find(item => item.text() === 'Button');
      await buttonItem!.trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();
      await nextTick();

      // Only the submenu closes; the parent popup stays open and focus
      // returns to the submenu trigger.
      expect(subTrigger!.attributes('aria-expanded')).toBe('false');
      expect(docsTrigger.attributes('aria-expanded')).toBe('true');
      expect(document.activeElement).toBe(subTrigger!.element);

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in the closed state', async () => {
      const wrapper = mountTreeNav();

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
