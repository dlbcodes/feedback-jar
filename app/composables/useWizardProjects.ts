import { getAllTimezones, getUserTimezone } from "~/utils/timezones";
import { createProjectSchema, type CreateProjectDto } from "~/types/project";
import useValidation from "~/composables/useValidation";
import { getFaviconUrl } from "~/utils/domain";

export function useProjectWizard() {
  const projectsStore = useProjectsStore();
  const route = useRoute();
  const router = useRouter();
  const { errors, validate, resetErrors } = useValidation(createProjectSchema);

  const currentStep = computed(() => Number(route.query.step) || 1);
  const websiteId = computed(() => route.query.websiteId as string | undefined);

  const completedSteps = reactive({ 1: false, 2: false, 3: false });

  const goToStep = (step: number, extraParams: Record<string, any> = {}) => {
    router.replace({
      query: {
        ...route.query,
        step,
        ...extraParams,
      },
    });
  };

  const handleScriptInstalled = () => {
    completedSteps[2] = true;
    goToStep(3, { websiteId: websiteId.value });
  };

  // Reactive form
  const form = reactive<CreateProjectDto>({
    name: "",
    domain: "",
    timezone: "",
  });

  const timezones = getAllTimezones();

  const extractNameFromDomain = (url: string) => {
    try {
      const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      const parts = cleanUrl.split(".");
      if (!parts.length) return "";
      if (parts.length > 2) return parts[parts.length - 2];
      return parts[0];
    } catch {
      return "";
    }
  };

  const favicon = computed(() => getFaviconUrl(form.domain));

  const handleSubmit = async () => {
    resetErrors();

    if (!form.name) {
      form.name = extractNameFromDomain(form.domain);
    }

    if (!validate(form)) return;

    try {
      const newProject = await projectsStore.createProject(form);
      const websiteId = newProject?.id; // assuming backend returns { id: '...' }

      completedSteps[1] = true;
      goToStep(2, { websiteId });
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  onMounted(async () => {
    await nextTick();
    form.timezone = getUserTimezone();
  });

  return {
    currentStep,
    completedSteps,
    websiteId,
    goToStep,
    handleScriptInstalled,
    handleSubmit,
    favicon,
    form,
    errors,
    timezones,
  };
}
