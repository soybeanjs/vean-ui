<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useTourRootContext } from "./context";
import type { TourRootContext, TourStepProps, TourStepSlots } from "./types";

defineOptions({
  name: "TourStepRoot",
});

type TourStepDefinition = Exclude<
  TourRootContext["activeStep"]["value"],
  undefined
>;

const props = withDefaults(defineProps<TourStepProps>(), {
  showMask: undefined,
  showArrow: undefined,
  showClose: undefined,
});

const slots = defineSlots<TourStepSlots>();

const { registerStep, unregisterStep } = useTourRootContext("TourStepRoot");
const registrationId = Symbol("TourStep");

function resolveStep(): TourStepDefinition {
  return {
    ...props,
    content: slots.default,
  };
}

onMounted(() => registerStep(registrationId, resolveStep));
onBeforeUnmount(() => unregisterStep(registrationId));
</script>
