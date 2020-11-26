import api from "@/store/api";
import i18n from "@/i18n";

const NFCards = {
  namespaced: true,
  state: {
    nfcards: [
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
      "Off",
    ],
  },
  getters: {
    getNFCards: (state) => state.nfcards,
  },
  mutations: {
    setNFCardValue(state, index, newValue) {
      this.state.nfcards[index] = newValue;
    },
  },
  actions: {
    async getNFCards({ commit }) {
      // var root_url = "/redfish/v1/Systems/";
      // return await api
      //   .get("/redfish/v1/Systems/")
      //   .then((response) => {
      //     commit("setNFCardsValue", response.data.nfcards);
      //   })
      //   .catch((error) => console.log(error));
      return this.nfcards;
    },
    async saveNFCardValue({ commit }, obj) {
      let root_url = "/redfish/v1/Systems/";
      let index = obj.index;
      let target_url =
        root_url + "nf_blade_" + index + "/Actions/ComputerSystem.Reset";
      let payload = obj.payload;
      return await api
        .post(target_url, {
          // "BladeId": index,
          ResetType: payload,
        })
        .then(() => {
          commit("setNFCardValue", index, payload);
          console.log(this.state.nfcards[index]);
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
