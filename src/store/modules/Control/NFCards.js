import api from "@/store/api";
import i18n from "@/i18n";

const NFCards = {
  namespaced: true,
  state: {
    nfcards: [
      { name: "0", value: "Off" },
      { name: "1", value: "Off" },
      { name: "2", value: "Off" },
      { name: "3", value: "Off" },
      { name: "4", value: "Off" },
      { name: "5", value: "Off" },
      { name: "6", value: "Off" },
      { name: "7", value: "Off" },
      { name: "8", value: "Off" },
      { name: "9", value: "Off" },
      { name: "10", value: "Off" },
      { name: "11", value: "Off" },
      { name: "12", value: "Off" },
      { name: "13", value: "Off" },
      { name: "14", value: "Off" },
      { name: "15", value: "Off" },
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
          BladeId: name,
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
