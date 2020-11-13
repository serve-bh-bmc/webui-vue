import api from "@/store/api"
import i18n from "@/i18n"

const RegistersStore = {
  namespaced: true,
  state: {
    registers: [
      { name: "A0", value: "Off" },
      { name: "A1", value: "Off" },
      { name: "A2", value: "Off" },
      { name: "A3", value: "Off" },
      { name: "A4", value: "Off" },
      { name: "A5", value: "Off" },
      { name: "A6", value: "Off" },
      { name: "A7", value: "Off" },
      { name: "A8", value: "Off" },
      { name: "A9", value: "Off" },
      { name: "A10", value: "Off" },
      { name: "A11", value: "Off" },
      { name: "A12", value: "Off" },
      { name: "A13", value: "Off" },
      { name: "A14", value: "Off" },
      { name: "A15", value: "Off" },
    ],
  },
  getters: {
    getRegisters: (state) => state.registers,
  },
  mutations: {
    setRegisterValue(state, name, newValue) {
      for (var i = 0; i < 16; i++) {
        if (state.registers[i].name == name) {
          state.registers[i].value = newValue
        }
      }
    },
    setRegistersValue(state, registers) {
      state.registers = registers
    },
  },
  actions: {
    async getRegisters({ commit }) {
      return await api
        .get("/redfish/v1/Systems/system")
        .then((response) => {
          commit("setRegistersValue", response.data.registers)
        })
        .catch((error) => console.log(error))
    },
    async saveRegisterValue({ commit }, obj) {
      var name = obj.name;
      var payload = obj.payload;
      return await api
        .patch("/redfish/v1/Systems/system", {
          Name: name,
          RegisterValue: payload,
        })
        .then(() => {
          commit("setRegisterValue", name, payload)
          if (payload === "On") {
            return i18n.t("pageRegisters.toast.successReigsterOn")
          } else {
            return i18n.t("pageRegisters.toast.successRegisterOff")
          }
        })
        .catch((error) => {
          console.log(error)
          if (payload === "On") {
            throw new Error(i18n.t("pageRegister.toast.errorRegisterOn"))
          } else {
            throw new Error(i18n.t("pageRegister.toast.errorRegisterOff"))
          }
        })
    },
  },
}

export default RegistersStore
