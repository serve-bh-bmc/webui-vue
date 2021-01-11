import api from "@/store/api";
import i18n from "@/i18n";

const NFCards = {
  namespaced: true,
  state: {
    nfcards: [{ name: "nf_blade_4", ps: "ForceOff" }],
  },
  getters: {
    getNFCards: (state) => state.nfcards,
  },
  mutations: {
    setNFCardValue: (state, data) => {
      const nfcard = {};
      nfcard.name = data.name;
      nfcard.ps = data.PowerState;
      for (var i = 0; i < state.nfcards.length; i++) {
        if (state.nfcards[i].index == nfcard.index) {
          console.log("already exist");
          return;
        }
      }
      state.nfcards.push(nfcard);
    },
    resetNFs: (state) => {
      state.nfcards = [];
    },
  },
  actions: {
    async getNFCards({ commit }) {
      // commit("resetNFs"); // clear nfcards array, avoid keep bad value
      return await api
        .get("/redfish/v1/Systems")
        .then(({ data: { Members = [] } }) =>
          Members.map((member) => api.get("/" + member["@odata.id"]))
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const data = response.map(({ data }) => data);
          commit("setNFCardValue", data);
        })
        .catch((error) => console.log(error));
    },
    async saveNFCardValue({ commit }, obj) {
      let root_url = "/redfish/v1/Systems/";
      let name = obj.name;
      let target_url = root_url + name + "/Actions/ComputerSystem.Reset";
      let payload = obj.payload;
      return await api
        .post(target_url, {
          ResetType: payload,
        })
        .then(() => {
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
