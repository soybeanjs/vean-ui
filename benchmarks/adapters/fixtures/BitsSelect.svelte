<script lang="ts">
  import { Select } from 'bits-ui';

  const { open = false, options = 10 }: { open?: boolean; options?: number } = $props();

  const list = $derived(Array.from({ length: options }, (_, index) => ({
    label: `Option ${index}`,
    value: `o${index}`
  })));
</script>

<Select.Root type="single" {open} onOpenChange={() => {}}>
  <Select.Trigger aria-label="Pick">
    <Select.Value placeholder="Pick" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Viewport>
        {#each list as option (option.value)}
          <Select.Item value={option.value} label={option.label}>
            <Select.ItemText>{option.label}</Select.ItemText>
          </Select.Item>
        {/each}
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
