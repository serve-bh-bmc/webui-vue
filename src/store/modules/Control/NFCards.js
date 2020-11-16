import api from "@/store/api";
import i18n from "@/i18n";

const NFCards = {
  namespaced: true,
  state: {
    nfcards: [
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
    getNFCards: (state) => state.nfcards,
  },
  mutations: {
    setNFCardValue(state, name, newValue) {
      for (var i = 0; i < 16; i++) {
        if (state.nfcards[i].name == name) {
          state.nfcards[i].value = newValue;
        }
      }
    },
    setNFCardsValue(state, nfcards) {
      state.nfcards = nfcards;
    },
  },
  actions: {
    async getNFCards({ commit }) {
      return await api
        .get("/redfish/v1/Systems/system")
        .then((response) => {
          commit("setRegistersValue", response.data.nfcards);
        })
        .catch((error) => console.log(error));
    },
    async saveNFCardValue({ commit }, obj) {
      var name = obj.name;
      var payload = obj.payload;
      return await api
        .patch("/redfish/v1/Systems/system", {
          Name: name,
          RegisterValue: payload,
        })
        .then(() => {
          commit("setNFCardValue", name, payload);
          if (payload === "On") {
            return i18n.t("pageNFCards.toast.successNFCardOn");
          } else {
            return i18n.t("pageNFCards.toast.successNFCardOff");
          }
        })
        .catch((error) => {
          console.log(error);
          if (payload === "On") {
            throw new Error(i18n.t("pageNFCard.toast.errorNFCardOn"));
          } else {
            throw new Error(i18n.t("pageNFCard.toast.errorNFCardOff"));
          }
        });
    },
  },
};

export default NFCards;
