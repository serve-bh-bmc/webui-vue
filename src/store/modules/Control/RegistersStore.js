import api from "@/store/api";
import i18n from "@/i18n";

const RegistersStore = {
  namespaced: true,
  state: {
    registers: [
      { name: "A0", value: "off" },
      { name: "A1", value: "off" },
      { name: "A2", value: "off" },
      { name: "A3", value: "off" },
      { name: "A4", value: "off" },
      { name: "A5", value: "off" },
      { name: "A6", value: "off" },
      { name: "A7", value: "off" },
      { name: "A8", value: "off" },
      { name: "A9", value: "off" },
      { name: "A10", value: "off" },
      { name: "A11", value: "off" },
      { name: "A12", value: "off" },
      { name: "A13", value: "off" },
      { name: "A14", value: "off" },
      { name: "A15", value: "off" },
    ],
  },
  getters: {
    getRegisters: (state) => state.registers,
  },
  mutations: {
    setRegisterValue(state, name, newValue) {
      state.registers[name] = newValue;
    },
  },
  actions: {
    async getRegisters({ commit }) {
      return await api
        .get("/redfish/v1/Systems/system")
        .then((response) => {
          commit("setRegisterValue", response.data.name, response.data.IndicatorLED);
        })
        .catch((error) => console.log(error));
    },
    async saveIndicatorLedValue({ commit }, payload) {
      return await api
        .patch("/redfish/v1/Systems/system", { IndicatorLED: payload })
        .then(() => {
          commit("setIndicatorValue", payload);
          if (payload === "Lit") {
            return i18n.t("pageServerLed.toast.successServerLedOn");
          } else {
            return i18n.t("pageServerLed.toast.successServerLedOff");
          }
        })
        .catch((error) => {
          console.log(error);
          if (payload === "Lit") {
            throw new Error(i18n.t("pageServerLed.toast.errorServerLedOn"));
          } else {
            throw new Error(i18n.t("pageServerLed.toast.errorServerLedOff"));
          }
        });
    },
  },
};

export default RegistersStore;
