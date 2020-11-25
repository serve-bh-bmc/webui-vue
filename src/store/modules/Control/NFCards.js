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
    setNFCardValue(state, name, newValue) {
      this.state.nfcards[name] = newValue;
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
      let name = obj.name;
      let target_url =
        root_url + "nf_blade_" + name + "/Actions/ComputerSystem.Reset";
      let payload = obj.payload;
      return await api
        .post(target_url, {
          // "BladeId": name,
          ResetType: payload,
        })
        .then(() => {
          commit("setNFCardValue", name, payload);
          console.log(this.state.nfcards[name]);
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
