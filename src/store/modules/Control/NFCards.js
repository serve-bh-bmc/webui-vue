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
    setNFCardValue(state, data) {
      var nfcard = {};
      nfcard.name = data.Id.toUpper();
      nfcard.ps = data.PowerState;
      for (var i = 0; i < this.state.nfcards.length; i++) {
        if (this.state.nfcards[i].index == nfcard.index) {
          console.log("already exist");
          return;
        }
      }
      this.state.nfcards.push(nfcard);
    },
    resetNFs(state) {
      this.state.nfcards = [];
    },
  },
  actions: {
    async getNFCard({ commit }, target) {
      let target_url = "/" + target;
      console.log(target_url); // check if url is in correct format
      return await api
        .get(target_url)
        .then(({ data }) => commit("setNFCardValue", data))
        .catch((error) => console.log(error));
    },
    async getNFCards({ commit }) {
      commit("resetNFs"); // clear nfcards array, avoid keep bad value
      let nf_blades = [];
      nf_blades = await api
        .get("/redfish/v1/Systems")
        .then(({ data }) => data.Members)
        .catch((error) => console.log(error));
      for (var i = 0; i < nf_blades.length; i++) {
        this.getNFCard(nf_blades[i]["@odata.id"]);
      }
      return this.state.nfcards;
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
