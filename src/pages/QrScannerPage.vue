<template>
  <q-page padding class="flex flex-center">
    <q-card flat style="max-width: 600px" class="q-mx-auto">
      <q-card-section>
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <qr-stream
            v-show="!visible"
            @init="onInit"
            @decode="onDecode"
          ></qr-stream>
        </transition>

        <q-inner-loading size="100px" :showing="visible">
          <q-spinner-grid size="50px" color="primary" />
        </q-inner-loading>
      </q-card-section>
      <q-card-actions align="center" class="q-mt-md">
        <q-btn
          to="/"
          padding="md xl"
          color="primary"
          ripple
          glossy
          rounded
          label="Close Scanner"
        />
        <q-btn
          @click="$router.go()"
          size="lg"
          round
          color="accent"
          icon="refresh"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { date } from "quasar";

// Import Stores
import { useVaxLogStore } from "src/stores/vaccination-logs";
// Define Stores
const vaxLogStore = useVaxLogStore();

const visible = ref(false);
const onInit = async () => {
  visible.value = true;
  try {
    const { capabilities } = await promise;
    // successfully initialized
  } catch (error) {
    if (error.name === "NotAllowedError") {
      // user denied camera access permisson
    } else if (error.name === "NotFoundError") {
      // no suitable camera device installed
    } else if (error.name === "NotSupportedError") {
      // page is not served over HTTPS (or localhost)
    } else if (error.name === "NotReadableError") {
      // maybe camera is already in use
    } else if (error.name === "OverconstrainedError") {
      // did you requested the front camera although there is none?
    } else if (error.name === "StreamApiNotSupportedError") {
      // browser seems to be lacking features
    }
  } finally {
    // hide loading indicator
    visible.value = false;
  }
};

const dialog = ref(false);
const studentData = ref();
const result = ref("");
const onDecode = async (data) => {
  result.value = data;
  const response = await vaxLogStore.checkQrCode({ id: data });
  if (response !== undefined) {
    studentData.value = response;
    const timeIn = await Swal.fire({
      title: "<strong>Vaccinated</strong>",
      icon: "success",
      text: "The student is vaccinated and registered. Please input temperature.",
      showCancelButton: true,
      focusConfirm: false,
      input: "number",
      inputAttributes: {
        step: "any",
      },
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: async (temperature) => {
        try {
          const log = await vaxLogStore.addVaxLog({
            ...studentData.value,
            temperature: temperature,
          });
          return log;
        } catch (err) {
          Swal.showValidationMessage(`Request failed: ${err}`);
        }
      },
    });

    if (timeIn.value) {
      const logData = timeIn.value;
      const logTime = date.formatDate(logData.timestamp, "h:mm a");
      Swal.fire({
        title: "Time-in success!",
        text: `${logData.name} has timed in ${logTime}`,
        icon: "success",
        allowOutsideClick: false,
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Not Registered!",
      text: "The QR code is not registered. Please contact MIS office.",
      footer:
        '<a href="https://www.facebook.com/groups/1614745368803833">Why do I have this issue?</a>',
      allowOutsideClick: false,
    });
  }
};
</script>
