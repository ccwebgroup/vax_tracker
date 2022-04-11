import { defineStore } from "pinia";
import { db, firestore } from "src/boot/firebase";

export const useVaxLogStore = defineStore("vaxLogs", {
  state: () => ({
    allVaxlogs: [],
  }),

  getters: {
    formattedLogs: (state) => {
      return state.allVaxlogs.sort((a, b) => b.timeIn - a.timeIn);
    },
  },

  actions: {
    async getAllVaxlogs() {
      this.allVaxlogs = [];
      const logRef = firestore.collection(db, "studentLogs");
      const snapshots = await firestore.getDocs(logRef);
      snapshots.forEach((logDoc) => {
        const logData = { ...logDoc.data(), id: logDoc.id };
        logData.timeIn = logData.timeIn.toDate();
        this.allVaxlogs.push(logData);
      });
    },

    async checkQrCode(payload) {
      const studentRef = firestore.doc(db, "students", payload.id);
      const docSnap = await firestore.getDoc(studentRef);
      if (docSnap.exists()) {
        const studentData = docSnap.data();
        studentData.id = docSnap.id;
        return studentData;
      }
    },

    async addVaxLog(payload) {
      console.log(payload);
      const logRef = firestore.collection(db, "studentLogs");
      await firestore.addDoc(logRef, {
        recordId: payload.id,
        studentInfo: {
          id: payload.id,
          fname: payload.fname,
          lname: payload.lname,
          mname: payload.mname ? payload.mname : "",
        },
        temperature: payload.temperature,
        timeIn: firestore.serverTimestamp(),
      });
      const jsDate = new Date();
      this.allVaxlogs.unshift({ ...payload, timeIn: jsDate });
      return {
        timestamp: jsDate,
        name: `${payload.lname}, ${payload.fname} ${
          payload.mname ? payload.mname[0] + "." : ""
        } `,
      };
    },
  },
});
