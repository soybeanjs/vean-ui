<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import * as v from 'valibot';
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
import type {
  CheckboxGroupOptionData,
  DataOrientation,
  RadioGroupOptionData,
  SelectOptionData,
  ThemeSize
} from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  orientation: DataOrientation;
  size: ThemeSize;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  orientation: 'vertical',
  size: 'md',
  disabled: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ORIENTATION_KEYS: readonly DataOrientation[] = ['vertical', 'horizontal'];

const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);

const orientation = shallowRef(DEFAULTS.orientation);
const size = shallowRef(DEFAULTS.size);
const disabled = shallowRef(DEFAULTS.disabled);

/** 水平布局需要更宽的表单和固定宽度的标签列，垂直布局回到窄卡片。 */
const formClass = computed(() => (orientation.value === 'horizontal' ? 'w-150 gap-7' : 'w-90 gap-7'));

const formUi = computed(() =>
  orientation.value === 'horizontal' ? { label: 'w-25', description: 'ps-30' } : undefined
);

const reset = (): void => {
  orientation.value = DEFAULTS.orientation;
  size.value = DEFAULTS.size;
  disabled.value = DEFAULTS.disabled;
};

const user = v.object({
  username: v.pipe(v.string('Username is required'), v.nonEmpty('Username is required')),
  gender: v.picklist(['male', 'female'], 'Gender is required'),
  remember: v.boolean('Remember is required'),
  hobbies: v.pipe(v.array(v.string(), 'Hobbies is required'), v.minLength(1, 'Hobbies is required')),
  city: v.string('City is required'),
  social: v.pipe(
    v.array(
      v.object({
        name: v.pipe(v.string('Name is required'), v.nonEmpty('Name is required')),
        url: v.pipe(v.string('URL is required'), v.nonEmpty('URL is required'))
      }),
      'Social is required'
    ),
    v.minLength(1, 'Social is required')
  )
});

const state = useForm({
  schema: user,
  onSubmit: async values => {
    console.log(values);
  },
  onInvalid: errors => {
    console.log(errors);
    console.log(state);
  }
});

const { handleSubmit, SFormField, SFormFieldArray } = state;

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
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="orientation">
        <SSelect
          v-model="orientation"
          :items="orientationItems"
          :trigger-props="{ 'aria-label': 'Orientation' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SForm :orientation="orientation" :size="size" :ui="formUi" :class="formClass" @submit="handleSubmit">
      <SFormField name="username" label="Username" description="This is FormField description">
        <SInput :disabled="disabled" placeholder="Please input username" />
      </SFormField>
      <SFormField name="gender" label="Gender">
        <SRadioGroup :items="genderItems" :disabled="disabled" />
      </SFormField>
      <SFormField name="remember" label="Remember">
        <SSwitch :disabled="disabled" />
      </SFormField>
      <SFormField name="hobbies" label="Hobbies">
        <SCheckboxGroup :items="hobbiesItems" :disabled="disabled" />
      </SFormField>
      <SFormField name="city" label="City">
        <SSelect :items="citiesItems" :disabled="disabled" />
      </SFormField>
      <SFormFieldArray name="social" :ui="{ control: 'flex-c gap-6' }">
        <template #label="{ fields, append }">
          <span>Social</span>
          <SButtonIcon v-if="!fields.length" icon="lucide:plus" @click="append({ name: '', url: '' })" />
        </template>
        <template #default="{ fields, append, remove }">
          <div v-for="(_, index) in fields" :key="index" class="flex gap-12px">
            <SFormField :name="`social[${index}].name`" label="Name">
              <SInput :disabled="disabled" />
            </SFormField>
            <SFormField :name="`social[${index}].url`" label="URL">
              <SInput :disabled="disabled" />
            </SFormField>
            <SButtonIcon icon="lucide:minus" class="mt-7 shrink-0" @click="remove(index)" />
            <SButtonIcon icon="lucide:plus" class="mt-7 shrink-0" @click="append({ name: '', url: '' })" />
          </div>
        </template>
      </SFormFieldArray>
      <SFormFieldBase>
        <SButton type="submit" :disabled="disabled">Submit</SButton>
      </SFormFieldBase>
    </SForm>
  </div>
</template>
