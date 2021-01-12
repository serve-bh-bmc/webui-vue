import api from "@/store/api";
import _ from "lodash";

const SystemStore = {
  namespaced: true,
  state: {
    systems: [
      {
        id: "nf_blade_9",
        name: "nf_blade_9",
        systemType: "123",
        description: "test",
        powerState: "Off",
        health: "OK",
        statusState: "enabled",
      },
      {
        id: "nf_blade_6",
        name: "nf_blade_6",
        systemType: "123",
        description: "test",
        powerState: "Off",
        health: "OK",
        statusState: "enabled",
      },
    ],
  },
  getters: {
    systems: (state) => state.systems,
  },
  mutations: {
    setSystemInfo: (state, data_arr) => {
      for (let i = 0; i < data_arr.length; i++) {
        const system = {};
        const data = data_arr[i];
        // system.assetTag = data.AssetTag;
        // system.indicatorLed = data.IndicatorLED;
        // system.manufacturer = data.Manufacturer;
        // system.model = data.Model;
        // system.partNumber = data.PartNumber;
        // system.serialNumber = data.SerialNumber;
        // system.healthRollup = data.Status.HealthRollup;
        // system.firmwareVersion = data.BiosVersion;
        system.id = data.Id;
        system.name = data.Name;
        system.powerState = data.PowerState;
        system.systemType = data.SystemType;
        system.description = data.Description;
        system.health = data.Status.Health;
        system.statusState = data.Status.State;
        state.systems.push(system);
      }
    },
    resetSystems: (state) => {
      state.systems = [];
    },
  },
  actions: {
    async getSystems({ commit }) {
      commit("resetSystems"); // reset systems to avoid bad value
      console.log("Running");
      return await api
        .get("/redfish/v1/Systems")
        .then(({ data: { Members = [] } }) =>
          Members.map((member) => api.get("/" + member["@odata.id"]))
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const data = response.map(({ data }) => data);
          console.log(data);
          commit("setSystemInfo", data);
        })
        .catch((error) => console.log(error));
    },
  },
};

export default SystemStore;
