import { boot } from "quasar/wrappers";
import { QrStream } from "vue3-qr-reader";

export default boot(async ({ app }) => {
  app.component("qr-stream", QrStream);
});
