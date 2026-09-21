<script setup lang="ts">
import { z } from 'zod';
import { SButton, SButtonIcon, SForm, SInput, useForm } from '@vean/ui';

const user = z.object({
  name: z.string().nonempty('Name is required'),
  emails: z.array(z.string().email('Email is invalid'))
});

const { handleSubmit, SFormField, SFormFieldArray } = useForm({
  schema: user,
  defaultValues: {
    name: '',
    emails: ['a@example.com']
  },
  onSubmit: async vals => {
    console.log(vals);
  }
});
</script>

<template>
  <div class="flex justify-center w-full">
    <SForm class="w-90 gap-4" @submit="handleSubmit">
      <SFormField name="name" label="Name">
        <SInput placeholder="Your name" />
      </SFormField>
      <!-- 动态数组：append / remove / insert / move / swap / update -->
      <SFormFieldArray name="emails" label="Emails" :ui="{ control: 'flex-c gap-3' }">
        <template #label="{ append }">
          <span>Emails</span>
          <SButtonIcon icon="lucide:plus" @click="append('')" />
        </template>
        <template #default="{ fields, append, remove, move }">
          <div v-for="(_, index) in fields" :key="index" class="flex items-center gap-8px">
            <span class="w-20px text-right text-sm">{{ index + 1 }}.</span>
            <SInput :placeholder="`Email ${index + 1}`" />
            <SButtonIcon icon="lucide:minus" class="shrink-0" @click="remove(index)" />
            <SButtonIcon icon="lucide:plus" class="shrink-0" @click="append('')" />
            <div class="flex flex-col">
              <SButtonIcon icon="lucide:chevron-up" size="xs" :disabled="index === 0" @click="move(index, index - 1)" />
              <SButtonIcon
                icon="lucide:chevron-down"
                size="xs"
                :disabled="index === fields.length - 1"
                @click="move(index, index + 1)"
              />
            </div>
          </div>
        </template>
      </SFormFieldArray>
      <SButton type="submit" class="mt-4">Submit</SButton>
    </SForm>
  </div>
</template>
