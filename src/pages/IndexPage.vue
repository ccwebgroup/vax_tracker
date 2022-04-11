<template>
  <q-page class="flex flex-center">
    <q-card flat>
      <q-card-section>
        <q-btn
          to="/qr-scanner"
          size="50px"
          color="primary"
          round
          glossy
          ripple
          icon="qr_code_scanner"
        />
      </q-card-section>

      <q-card-actions align="center" class="q-mt-lg">
        <q-btn
          @click="handlerLogDialog"
          no-caps
          outline
          color="primary"
          label="Check Log Records"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script setup>
import LogRecords from "src/components/LogRecords.vue";
import { useQuasar } from "quasar";
const $q = useQuasar();

const handlerLogDialog = () => {
  $q.dialog({
    component: LogRecords,
  });
};
</script>
