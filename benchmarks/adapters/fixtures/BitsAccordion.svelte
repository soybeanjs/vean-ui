<script lang="ts">
  import { Accordion } from 'bits-ui';

  const { items = 10 }: { items?: number } = $props();

  const list = $derived(Array.from({ length: items }, (_, index) => ({
    title: `Section ${index}`,
    value: `s${index}`
  })));
</script>

<Accordion.Root type="single" collapsible>
  {#each list as item (item.value)}
    <Accordion.Item value={item.value}>
      <Accordion.Header>
        <Accordion.Trigger>{item.title}</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>Content {item.value}</Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
