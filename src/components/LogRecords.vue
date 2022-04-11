<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    maximized
  >
    <q-card>
      <q-card-section>
        <q-table
          :pagination="{ rowsPerPage: 15 }"
          flat
          title="Log Records"
          :rows="vaxLogs"
          :columns="logCols"
          :filter="filter"
          row-key="id"
          no-results-label="Search not found."
        >
          <template v-slot:top-right>
            <q-input
              rounded
              outlined
              dense
              debounce="300"
              color="primary"
              v-model="filter"
              placeholder="Search here"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr>
              <q-td>{{
                `${props.row.studentInfo.lname}, ${props.row.studentInfo.fname} ${props.row.studentInfo.mname[0]}.`
              }}</q-td>
              <q-td>{{ logDateFormat(props.row.timeIn) }}</q-td>
              <q-td>{{ logTimeFormat(props.row.timeIn) }}</q-td>
              <q-td>{{ props.row.temperature }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right" class="q-mt-xl q-mr-md">
        <q-btn color="primary" label="Close" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { computed, onBeforeMount } from "vue";
// Import Composables
import { useDate } from "src/composables/qdate";
import { useVaxLogStore } from "src/stores/vaccination-logs";

const vaxLogStore = useVaxLogStore();
const { logDateFormat, logTimeFormat } = useDate();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const vaxLogs = computed(() => vaxLogStore.formattedLogs);

onBeforeMount(() => {
  vaxLogStore.getAllVaxlogs();
});

// DaTA TABLE
const filter = ref("");
const logCols = [
  {
    label: "Name",
    required: true,
    sortable: true,
    align: "left",
    field: (row) =>
      `${row.studentInfo.lname}, ${row.studentInfo.fname} ${row.studentInfo.mname[0]}.`,
  },
  {
    label: "Date",
    required: true,
    sortable: true,
    align: "left",
    field: (row) => row.timeIn,
    format: (val) => logDateFormat(val),
  },
  {
    label: "Timed In",
    required: true,
    sortable: true,
    align: "left",
    field: (row) => row.timeIn,
    format: (val) => logTimeFormat(val),
  },
  {
    label: "Temperature",
    required: true,
    sortable: true,
    align: "left",
    field: (row) => row.temperature,
  },
];
</script>
