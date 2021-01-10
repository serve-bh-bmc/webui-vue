import api from "@/store/api";

const SystemStore = {
  namespaced: true,
  state: {
    systems: [],
  },
  getters: {
    systems: (state) => state.systems,
  },
  mutations: {
    setSystemInfo: (state, data) => {
      const system = {};
      // system.assetTag = data.AssetTag;
      system.description = data.Description;
      // system.firmwareVersion = data.BiosVersion;
      system.health = data.Status.Health;
      system.id = data.Id;
      // system.indicatorLed = data.IndicatorLED;
      // system.manufacturer = data.Manufacturer;
      // system.model = data.Model;
      // system.partNumber = data.PartNumber;
      system.powerState = data.PowerState;
      // system.serialNumber = data.SerialNumber;
      // system.healthRollup = data.Status.HealthRollup;
      system.statusState = data.Status.State;
      system.systemType = data.SystemType;
      state.systems.push(system);
    },
    resetSystems: (state) => {
      state.systems = [];
    },
  },
  actions: {
    // async getSystem({ commit }, nf_blade) {
    //   let target_url = "/" + nf_blade;
    //   return await api
    //     .get(target_url)
    //     .then(({ data }) => commit("setSystemInfo", data))
    //     .catch((error) => console.log(error));
    // },
    async getSystems({ commit }, systemId) {
      commit("resetSystems"); // reset systems to avoid bad value
      return await api
        .get("/redfish/v1/Systems")
        .then(({ data: { Members = [] } }) =>
          Members.map((member) => api.get("/" + member["@odata.id"]))
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const data = response.map(({ data }) => data);
          commit("setSystemInfo", data);
        })
        .catch((error) => console.log(error));
      // for (var i = 0; i < nf_blades.length; i++) {
      //   let n = "/" + nf_blades[i]["@odata.id"];
      //   console.log(n);
      //   await api
      //     .get(n)
      //     .then(({ data }) => commit("setSystemInfo", data))
      //     .catch((error) => console.log(error));
      // }
      // console.log(this.state.systems);
      // return this.state.systems;
    },
  },
};

export default SystemStore;
