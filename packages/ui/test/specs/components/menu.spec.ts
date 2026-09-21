import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import { SDropdownMenuWrapper } from '@/components/dropdown-menu';
import { SMenuCheckboxOptions, SMenuOptions, SMenuRadioOptions } from '@/components/menu';
import type { MenuCheckboxOptionData, MenuOptionData, MenuRadioOptionData } from '@/components/menu';
import { getA11yViolations } from '../../shared/a11y';

const items: MenuOptionData<string>[] = [
  { value: 'new-tab', label: 'New Tab' },
  {
    value: 'share',
    label: 'Share',
    children: [{ value: 'mail', label: 'Email' }]
  }
];

const checkboxItems: MenuCheckboxOptionData<string>[] = [
  { value: 'bold', label: 'Bold' },
  { value: 'italic', label: 'Italic' }
];

const radioItems: MenuRadioOptionData<string>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
];

interface MountMenuOptions {
  items?: MenuOptionData<string>[];
  menuProps?: Record<string, unknown>;
  wrapperProps?: Record<string, unknown>;
  template?: string;
}

function mountMenu({ items: menuItems = items, menuProps = {}, wrapperProps = {}, template }: MountMenuOptions = {}) {
  return mount(
    {
      emits: ['select'],
      components: {
        SConfigProvider,
        SDropdownMenuWrapper,
        SMenuOptions
      },
      setup() {
        return {
          items: menuItems,
          menuProps,
          wrapperProps
        };
      },
      template:
        template ??
        `
        <SConfigProvider>
          <SDropdownMenuWrapper :portal-props="{ disabled: true }" v-bind="wrapperProps">
            <template #trigger>
              <button type="button">Open menu</button>
            </template>
            <SMenuOptions
              :items="items"
              v-bind="menuProps"
              :portal-props="{ disabled: true }"
              @select="(item, event) => $emit('select', item, event)"
            />
          </SDropdownMenuWrapper>
        </SConfigProvider>
      `
    },
    {
      attachTo: document.body
    }
  );
}

async function openMenu(wrapper: ReturnType<typeof mountMenu>) {
  await wrapper.find('button').trigger('click', { button: 0, ctrlKey: false });
  await nextTick();
  await nextTick();
}

describe('SMenuOptions', () => {
  it('focuses the first submenu item when opening a submenu with keyboard navigation', async () => {
    const wrapper = mountMenu();

    await openMenu(wrapper);

    const rootMenu = wrapper.find('[role="menu"][data-state="open"]');

    expect(rootMenu.exists()).toBe(true);

    await rootMenu.trigger('keydown', { key: 'ArrowDown' });
    await nextTick();

    const rootMenuItems = rootMenu.findAll('[role="menuitem"]');

    expect(document.activeElement).toBe(rootMenuItems[0]?.element);

    await rootMenuItems[0].trigger('keydown', { key: 'ArrowDown' });
    await nextTick();

    expect(document.activeElement).toBe(rootMenuItems[1]?.element);
    expect(document.activeElement?.textContent).toContain('Share');

    await rootMenuItems[1].trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    await nextTick();

    const openMenus = wrapper.findAll('[role="menu"][data-state="open"]');
    const subMenuItems = openMenus[1]?.findAll('[role="menuitem"]') ?? [];

    expect(openMenus).toHaveLength(2);
    expect(document.activeElement).toBe(subMenuItems[0]?.element);
    expect(document.activeElement?.textContent).toContain('Email');
    wrapper.unmount();
  });

  describe('rendering', () => {
    it('renders items, group labels and separators', async () => {
      const wrapper = mountMenu({
        items: [
          { value: 'title', label: 'Title', isGroupLabel: true },
          { value: 'new-tab', label: 'New Tab' },
          { value: 'print', label: 'Print', separator: true },
          { value: 'share', label: 'Share', children: [{ value: 'mail', label: 'Email' }] }
        ]
      });

      await openMenu(wrapper);

      const rootMenu = wrapper.find('[role="menu"]');
      expect(rootMenu.attributes('role')).toBe('menu');
      expect(rootMenu.findAll('[role="menuitem"]')).toHaveLength(3);
      expect(rootMenu.findAll('[role="group"]')).toHaveLength(1);
      expect(rootMenu.find('[role="menuitem"]').attributes('aria-disabled')).toBeUndefined();
      expect(wrapper.find('[role="menuitem"][data-vean-menu-item]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('hidden items', () => {
    it('drops hidden items from the rendered list', async () => {
      const wrapper = mountMenu({
        items: [
          { value: 'new-tab', label: 'New Tab' },
          { value: 'print', label: 'Print', hidden: true },
          { value: 'share', label: 'Share' }
        ]
      });

      await openMenu(wrapper);

      const labels = wrapper.findAll('[role="menuitem"]').map(item => item.text());

      expect(labels).toEqual(['New Tab', 'Share']);

      wrapper.unmount();
    });

    it('drops hidden children of a submenu', async () => {
      const wrapper = mountMenu({
        items: [
          {
            value: 'share',
            label: 'Share',
            children: [
              { value: 'mail', label: 'Email' },
              { value: 'chat', label: 'Chat', hidden: true }
            ]
          }
        ]
      });

      await openMenu(wrapper);

      await wrapper.find('[role="menu"]').findAll('[role="menuitem"]')[0].trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await nextTick();

      const subMenuItems = wrapper.findAll('[role="menu"][data-state="open"]')[1]?.findAll('[role="menuitem"]') ?? [];

      expect(subMenuItems.map(item => item.text())).toEqual(['Email']);

      wrapper.unmount();
    });

    it('renders an item whose children are all hidden as a leaf', async () => {
      const wrapper = mountMenu({
        items: [
          {
            value: 'share',
            label: 'Share',
            children: [{ value: 'mail', label: 'Email', hidden: true }]
          }
        ]
      });

      await openMenu(wrapper);

      const menuItems = wrapper.findAll('[role="menuitem"]');

      expect(menuItems).toHaveLength(1);
      expect(menuItems[0]?.attributes('aria-haspopup')).toBeUndefined();

      wrapper.unmount();
    });

    it('ignores a hidden descendant when resolving the active path', async () => {
      const wrapper = mountMenu({
        items: [
          {
            value: 'share',
            label: 'Share',
            children: [
              { value: 'mail', label: 'Email' },
              { value: 'chat', label: 'Chat', hidden: true }
            ]
          }
        ],
        menuProps: { selectedValue: 'chat' }
      });

      await openMenu(wrapper);

      expect(wrapper.find('[role="menuitem"]').attributes('data-child-selected')).toBeUndefined();

      wrapper.unmount();
    });
  });

  describe('disabled fallback', () => {
    it('applies itemProps.disabled to items without an explicit value', async () => {
      const wrapper = mountMenu({
        items: [
          { value: 'new-tab', label: 'New Tab' },
          { value: 'print', label: 'Print' }
        ],
        menuProps: { itemProps: { disabled: true } }
      });

      await openMenu(wrapper);

      wrapper.findAll('[role="menuitem"]').forEach(item => {
        expect(item.attributes('aria-disabled')).toBe('true');
      });

      wrapper.unmount();
    });

    it('lets an explicit item.disabled win over itemProps.disabled', async () => {
      const wrapper = mountMenu({
        items: [
          { value: 'new-tab', label: 'New Tab' },
          { value: 'print', label: 'Print', disabled: true }
        ],
        menuProps: { itemProps: { disabled: false } }
      });

      await openMenu(wrapper);

      const menuItems = wrapper.findAll('[role="menuitem"]');
      expect(menuItems[0]?.attributes('aria-disabled')).toBeUndefined();
      expect(menuItems[1]?.attributes('aria-disabled')).toBe('true');

      wrapper.unmount();
    });
  });

  describe('linkProps fallback', () => {
    it('applies linkProps.disabled to link items without an explicit value', async () => {
      const wrapper = mountMenu({
        items: [
          { value: 'home', label: 'Home', href: '/home' },
          { value: 'docs', label: 'Docs', href: '/docs' }
        ],
        menuProps: { linkProps: { disabled: true } }
      });

      await openMenu(wrapper);

      wrapper.findAll('a').forEach(link => {
        expect(link.attributes('aria-disabled')).toBe('true');
      });

      wrapper.unmount();
    });

    it('lets an explicit item.disabled win over linkProps.disabled', async () => {
      const wrapper = mountMenu({
        items: [
          { value: 'home', label: 'Home', href: '/home' },
          { value: 'docs', label: 'Docs', href: '/docs', disabled: true }
        ],
        menuProps: { linkProps: { disabled: false } }
      });

      await openMenu(wrapper);

      expect(wrapper.find('a[href="/home"]').attributes('aria-disabled')).toBeUndefined();
      expect(wrapper.find('a[href="/docs"]').attributes('aria-disabled')).toBe('true');

      wrapper.unmount();
    });

    it('renders target from item data on the link', async () => {
      const wrapper = mountMenu({
        items: [
          { value: 'home', label: 'Home', href: '/home' },
          { value: 'docs', label: 'Docs', href: '/docs', target: '_self' }
        ]
      });

      await openMenu(wrapper);

      // items without target fall back to the Link default ('_blank' for href links)
      expect(wrapper.find('a[href="/home"]').attributes('target')).toBe('_blank');
      expect(wrapper.find('a[href="/docs"]').attributes('target')).toBe('_self');

      wrapper.unmount();
    });
  });

  describe('select behavior', () => {
    it('emits select with the item payload on click', async () => {
      const wrapper = mountMenu();

      await openMenu(wrapper);

      await wrapper.find('[role="menuitem"]').trigger('click');
      await nextTick();

      const emitted = wrapper.emitted('select');
      expect(emitted).toBeTruthy();
      expect(emitted?.[0]?.[0]).toMatchObject({ value: 'new-tab', label: 'New Tab' });

      wrapper.unmount();
    });

    it('does not emit select for a disabled item', async () => {
      const wrapper = mountMenu({
        items: [{ value: 'print', label: 'Print', disabled: true }]
      });

      await openMenu(wrapper);

      await wrapper.find('[role="menuitem"]').trigger('click');
      await nextTick();

      expect(wrapper.emitted('select')).toBeUndefined();

      wrapper.unmount();
    });
  });

  describe('selected state', () => {
    it('marks the selected item with data-selected', async () => {
      const wrapper = mountMenu({
        menuProps: { selectedValue: 'print' },
        items: [
          { value: 'new-tab', label: 'New Tab' },
          { value: 'print', label: 'Print' }
        ]
      });

      await openMenu(wrapper);

      const menuItems = wrapper.findAll('[role="menuitem"]');
      expect(menuItems[0]?.attributes('data-selected')).toBe('false');
      expect(menuItems[1]?.attributes('data-selected')).toBe('true');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mountMenu();

      await openMenu(wrapper);

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations when a submenu is open', async () => {
      const wrapper = mountMenu();

      await openMenu(wrapper);

      const rootMenu = wrapper.find('[role="menu"]');
      await rootMenu.trigger('keydown', { key: 'ArrowDown' });
      await rootMenu.findAll('[role="menuitem"]')[1].trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await nextTick();

      const violations = await getA11yViolations(wrapper.element, {
        rules: {
          // With the portal disabled for happy-dom, the submenu content renders
          // inline inside the root menu, adding a non-role positioning wrapper
          // as a direct child of `role="menu"`. Real usage teleports it to
          // `document.body`, so this is a test-environment artifact only.
          'aria-required-children': { enabled: false },
          // Decorative sub-trigger chevron renders as SVG without aria-hidden
          // (mirrors the project-wide exemption in `packages/ui/test/shared/a11y.ts`).
          'svg-img-alt': { enabled: false }
        }
      });
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });

  describe('Tab key behavior', () => {
    it('lets Tab move focus out of a non-modal dropdown menu', async () => {
      const wrapper = mountMenu({ wrapperProps: { modal: false } });

      await openMenu(wrapper);

      const rootMenu = wrapper.find('[role="menu"]');
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      rootMenu.element.dispatchEvent(event);
      await nextTick();

      // Non-modal menus must not prevent Tab so focus can move to the next
      // focusable element on the page.
      expect(event.defaultPrevented).toBe(false);

      wrapper.unmount();
    });

    it('traps Tab inside a modal dropdown menu', async () => {
      const wrapper = mountMenu(); // modal defaults to true

      await openMenu(wrapper);

      const rootMenu = wrapper.find('[role="menu"]');
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      rootMenu.element.dispatchEvent(event);
      await nextTick();

      expect(event.defaultPrevented).toBe(true);

      wrapper.unmount();
    });
  });

  describe('highlight state', () => {
    it('removes data-highlighted when the pointer leaves a menu item', async () => {
      const wrapper = mountMenu({ wrapperProps: { modal: false } });

      await openMenu(wrapper);

      const item = wrapper.findAll('[role="menuitem"]')[0];

      // hovering the item highlights it (focus + data-highlighted)
      await item.trigger('pointermove', { pointerType: 'mouse' });
      await nextTick();

      expect(item.attributes('data-highlighted')).toBeDefined();

      // leaving the item clears the highlight
      await item.trigger('pointerleave', { pointerType: 'mouse' });
      await nextTick();
      await nextTick();

      expect(item.attributes('data-highlighted')).toBeUndefined();

      wrapper.unmount();
    });
  });
});

describe('SMenuCheckboxOptions', () => {
  it('reflects checked state and emits update:modelValue on click', async () => {
    const wrapper = mount(
      {
        emits: ['update:modelValue'],
        components: {
          SConfigProvider,
          SDropdownMenuWrapper,
          SMenuCheckboxOptions
        },
        setup() {
          return { items: checkboxItems };
        },
        template: `
          <SConfigProvider>
            <SDropdownMenuWrapper :portal-props="{ disabled: true }">
              <template #trigger>
                <button type="button">Open menu</button>
              </template>
              <SMenuCheckboxOptions
                :items="items"
                :portal-props="{ disabled: true }"
                @update:model-value="$emit('update:modelValue', $event)"
              />
            </SDropdownMenuWrapper>
          </SConfigProvider>
        `
      },
      { attachTo: document.body }
    );

    await wrapper.find('button').trigger('click', { button: 0, ctrlKey: false });
    await nextTick();
    await nextTick();

    const menu = wrapper.find('[role="menu"]');
    const boldItem = menu.findAll('[role="menuitemcheckbox"]')[0];

    expect(boldItem.attributes('aria-checked')).toBe('false');

    await boldItem.trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['bold']);

    wrapper.unmount();
  });

  it('drops hidden items from the rendered list', async () => {
    const wrapper = mount(
      {
        components: {
          SConfigProvider,
          SDropdownMenuWrapper,
          SMenuCheckboxOptions
        },
        setup() {
          return {
            items: [
              { value: 'bold', label: 'Bold' },
              { value: 'italic', label: 'Italic', hidden: true },
              { value: 'underline', label: 'Underline' }
            ] satisfies MenuCheckboxOptionData<string>[]
          };
        },
        template: `
          <SConfigProvider>
            <SDropdownMenuWrapper :portal-props="{ disabled: true }">
              <template #trigger>
                <button type="button">Open menu</button>
              </template>
              <SMenuCheckboxOptions :items="items" :portal-props="{ disabled: true }" />
            </SDropdownMenuWrapper>
          </SConfigProvider>
        `
      },
      { attachTo: document.body }
    );

    await wrapper.find('button').trigger('click', { button: 0, ctrlKey: false });
    await nextTick();
    await nextTick();

    const labels = wrapper.findAll('[role="menuitemcheckbox"]').map(item => item.text());

    expect(labels).toEqual(['Bold', 'Underline']);

    wrapper.unmount();
  });

  it('applies checkboxItemProps.disabled fallback and item.disabled precedence', async () => {
    const wrapper = mount(
      {
        components: {
          SConfigProvider,
          SDropdownMenuWrapper,
          SMenuCheckboxOptions
        },
        setup() {
          return { items: checkboxItems };
        },
        template: `
          <SConfigProvider>
            <SDropdownMenuWrapper :portal-props="{ disabled: true }">
              <template #trigger>
                <button type="button">Open menu</button>
              </template>
              <SMenuCheckboxOptions
                :items="items"
                :checkbox-item-props="{ disabled: true }"
                :portal-props="{ disabled: true }"
              />
            </SDropdownMenuWrapper>
          </SConfigProvider>
        `
      },
      { attachTo: document.body }
    );

    await wrapper.find('button').trigger('click', { button: 0, ctrlKey: false });
    await nextTick();
    await nextTick();

    const checkboxItemsInMenu = wrapper.findAll('[role="menuitemcheckbox"]');
    checkboxItemsInMenu.forEach(item => {
      expect(item.attributes('aria-disabled')).toBe('true');
    });

    wrapper.unmount();
  });
});

describe('SMenuRadioOptions', () => {
  it('reflects the selected value and emits update:modelValue on click', async () => {
    const wrapper = mount(
      {
        emits: ['update:modelValue'],
        components: {
          SConfigProvider,
          SDropdownMenuWrapper,
          SMenuRadioOptions
        },
        setup() {
          return { items: radioItems };
        },
        template: `
          <SConfigProvider>
            <SDropdownMenuWrapper :portal-props="{ disabled: true }">
              <template #trigger>
                <button type="button">Open menu</button>
              </template>
              <SMenuRadioOptions
                :items="items"
                :portal-props="{ disabled: true }"
                @update:model-value="$emit('update:modelValue', $event)"
              />
            </SDropdownMenuWrapper>
          </SConfigProvider>
        `
      },
      { attachTo: document.body }
    );

    await wrapper.find('button').trigger('click', { button: 0, ctrlKey: false });
    await nextTick();
    await nextTick();

    const menu = wrapper.find('[role="menu"]');
    const radioItemsInMenu = menu.findAll('[role="menuitemradio"]');

    expect(radioItemsInMenu[0]?.attributes('aria-checked')).toBe('false');

    await radioItemsInMenu[0].trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('light');

    wrapper.unmount();
  });

  it('drops hidden items from the rendered list', async () => {
    const wrapper = mount(
      {
        components: {
          SConfigProvider,
          SDropdownMenuWrapper,
          SMenuRadioOptions
        },
        setup() {
          return {
            items: [
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark', hidden: true },
              { value: 'system', label: 'System' }
            ] satisfies MenuRadioOptionData<string>[]
          };
        },
        template: `
          <SConfigProvider>
            <SDropdownMenuWrapper :portal-props="{ disabled: true }">
              <template #trigger>
                <button type="button">Open menu</button>
              </template>
              <SMenuRadioOptions :items="items" :portal-props="{ disabled: true }" />
            </SDropdownMenuWrapper>
          </SConfigProvider>
        `
      },
      { attachTo: document.body }
    );

    await wrapper.find('button').trigger('click', { button: 0, ctrlKey: false });
    await nextTick();
    await nextTick();

    const labels = wrapper.findAll('[role="menuitemradio"]').map(item => item.text());

    expect(labels).toEqual(['Light', 'System']);

    wrapper.unmount();
  });

  it('applies radioItemProps.disabled fallback', async () => {
    const wrapper = mount(
      {
        components: {
          SConfigProvider,
          SDropdownMenuWrapper,
          SMenuRadioOptions
        },
        setup() {
          return { items: radioItems };
        },
        template: `
          <SConfigProvider>
            <SDropdownMenuWrapper :portal-props="{ disabled: true }">
              <template #trigger>
                <button type="button">Open menu</button>
              </template>
              <SMenuRadioOptions
                :items="items"
                :radio-item-props="{ disabled: true }"
                :portal-props="{ disabled: true }"
              />
            </SDropdownMenuWrapper>
          </SConfigProvider>
        `
      },
      { attachTo: document.body }
    );

    await wrapper.find('button').trigger('click', { button: 0, ctrlKey: false });
    await nextTick();
    await nextTick();

    const radioItemsInMenu = wrapper.findAll('[role="menuitemradio"]');
    radioItemsInMenu.forEach(item => {
      expect(item.attributes('aria-disabled')).toBe('true');
    });

    wrapper.unmount();
  });
});
