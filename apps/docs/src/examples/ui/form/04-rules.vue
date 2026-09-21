<script setup lang="ts">
import { z } from 'zod';
import { SButton, SForm, SFormFieldBase, SInput, useForm } from '@vean/ui';

const user = z.object({
  username: z.string().nonempty('Username is required'),
  age: z.number('Age is required').min(18, 'Age must be at least 18'),
  email: z.string('Email is required').email('Email is invalid')
});

const { handleSubmit, SFormField } = useForm({
  schema: user,
  onSubmit: async vals => {
    console.log(vals);
  },
  onInvalid: errors => {
    console.log(errors);
  }
});
</script>

<template>
  <div class="flex justify-center w-full">
    <SForm class="w-80 gap-4" @submit="handleSubmit">
      <!-- 字段级校验：validate 返回 undefined 表示通过，返回字符串表示错误 -->
      <SFormField
        name="username"
        label="Username"
        :validate="value => (String(value).length >= 3 ? undefined : 'At least 3 characters')"
      >
        <SInput placeholder="Field-level validate" />
      </SFormField>
      <!-- 字段级校验 + schema 校验叠加 -->
      <SFormField
        name="age"
        label="Age"
        :validate="value => (Number(value) > 0 ? undefined : 'Positive number required')"
      >
        <SInput type="number" placeholder="Schema + validate" />
      </SFormField>
      <SFormField name="email" label="Email">
        <SInput type="email" placeholder="Schema only" />
      </SFormField>
      <SFormFieldBase>
        <SButton type="submit">Submit</SButton>
      </SFormFieldBase>
    </SForm>
  </div>
</template>
