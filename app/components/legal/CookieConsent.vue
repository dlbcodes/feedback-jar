<script setup lang="ts">
const { gtag, initialize } = useGtag();
const consentGiven = ref<null | boolean>(null);

onMounted(() => {
    if (process.client) {
        const savedConsent = localStorage.getItem("cookie_consent");
        consentGiven.value = savedConsent === "true";

        if (consentGiven.value) {
            grantAllConsent();
        } else {
            consentGiven.value = false; // Show banner only if consent is missing
        }
    }
});

const grantAllConsent = () => {
    initialize();
    gtag("consent", "update", {
        ad_user_data: "granted",
        ad_personalization: "granted",
        ad_storage: "granted",
        analytics_storage: "granted",
    });

    gtag("event", "test_event", {
        event_category: "consent",
        event_label: "Cookies Accepted",
    });
};

const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    consentGiven.value = true;
    grantAllConsent();
};

const rejectCookies = () => {
    localStorage.setItem("cookie_consent", "false");
    consentGiven.value = false;
};
</script>

<template>
    <div
        v-if="consentGiven === false"
        class="flex flex-col gap-y-6 fixed bottom-5 right-5 z-50 shadow p-8 rounded-xl bg-gray-200"
    >
        <p class="text-gray-500">
            We use cookies to improve your experience. <br />
            Do you accept our
            <nuxt-link to="/cookies">cookie policy</nuxt-link>?
        </p>
        <div class="flex flex-col gap-y-4">
            <Button variant="secondary" @click="rejectCookies">
                Dismiss cookies
            </Button>
            <Button @click="acceptCookies">Accept cookies</Button>
        </div>
    </div>
</template>
