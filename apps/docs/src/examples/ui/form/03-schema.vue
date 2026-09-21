<script setup lang="ts">
import { z } from 'zod';
import {
  SButton,
  SButtonIcon,
  SCheckboxGroup,
  SForm,
  SFormFieldBase,
  SInput,
  SRadioGroup,
  SSelect,
  SSwitch,
  useForm
} from '@vean/ui';
import type { CheckboxGroupOptionData, RadioGroupOptionData, SelectOptionData } from '@vean/ui';

const user = z.object({
  username: z.string('Username is required').nonempty('Username is required'),
  gender: z.enum(['male', 'female'], 'Gender is required'),
  remember: z.boolean('Remember is required'),
  hobbies: z.array(z.string(), 'Hobbies is required').min(1, 'Hobbies is required'),
  city: z.string('City is required'),
  social: z
    .array(
      z.object({
        name: z.string('Name is required').nonempty('Name is required'),
        url: z.string('URL is required').nonempty('URL is required')
      }),
      'Social is required'
    )
    .min(1, 'Social is required')
});

const { handleSubmit, SFormField, SFormFieldArray } = useForm({
  schema: user,
  onSubmit: async vals => {
    console.log(vals);
  },
  onInvalid: errors => {
    console.log(errors);
  }
});

type Gender = 'male' | 'female';

const genderItems: RadioGroupOptionData<Gender>[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
];

const hobbiesItems: CheckboxGroupOptionData<string>[] = [
  { label: 'Reading', value: 'reading' },
  { label: 'Traveling', value: 'traveling' },
  { label: 'Sports', value: 'sports' },
  { label: 'Music', value: 'music' }
];

const citiesItems: SelectOptionData<string>[] = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Guangzhou', value: 'guangzhou' }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <SForm class="w-90 gap-3" @submit="handleSubmit">
      <SFormField name="username" label="Username" description="This is FormField description">
        <SInput placeholder="Please input username" />
      </SFormField>
      <SFormField name="gender" label="Gender">
        <SRadioGroup :items="genderItems" />
      </SFormField>
      <SFormField name="remember" label="Remember">
        <SSwitch />
      </SFormField>
      <SFormField name="hobbies" label="Hobbies">
        <SCheckboxGroup :items="hobbiesItems" />
      </SFormField>
      <SFormField name="city" label="City">
        <SSelect :items="citiesItems" />
      </SFormField>
      <SFormFieldArray name="social">
        <template #label="{ fields, append }">
          <span>Social</span>
          <SButtonIcon v-if="!fields.length" icon="lucide:plus" @click="append({ name: '', url: '' })" />
        </template>
        <template #default="{ fields, append, remove }">
          <div v-for="(field, index) in fields" :key="index" class="flex gap-12px">
            <SFormField :name="`${field.name}[${index}].name`" label="Name">
              <SInput />
            </SFormField>
            <SFormField :name="`${field.name}[${index}].url`" label="URL">
              <SInput />
            </SFormField>
            <SButtonIcon icon="lucide:minus" class="shrink-0" @click="remove(index)" />
            <SButtonIcon icon="lucide:plus" class="shrink-0" @click="append({ name: '', url: '' })" />
          </div>
        </template>
      </SFormFieldArray>
      <SFormFieldBase>
        <SButton type="submit">Submit</SButton>
      </SFormFieldBase>
    </SForm>
  </div>
</template>
