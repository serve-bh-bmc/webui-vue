<template>
  <page-section :section-title="$t('pageHardwareStatus.system')">
    <b-table
      responsive="md"
      hover
      show-empty
      :items="systems"
      :fields="fields"
      :empty-text="$t('global.table.emptyMessage')"
    >
      <!-- Expand chevron icon -->
      <template #cell(expandRow)="row">
        <b-button
          variant="link"
          data-test-id="hardwareStatus-button-expandSystem"
          :aria-label="expandRowLabel"
          :title="expandRowLabel"
          class="btn-icon-only"
          @click="toggleRowDetails(row)"
        >
          <icon-chevron />
        </b-button>
      </template>

      <!-- Health -->
      <template #cell(health)="{ value }">
        <status-icon :status="statusIcon(value)" />
        {{ value }}
      </template>

      <template #row-details="{ item }">
        <b-container fluid>
          <b-row>
            <b-col sm="6" xl="4">
              <dl>
                <!-- Asset tag -->
                <dt>{{ $t("pageHardwareStatus.table.assetTag") }}:</dt>
                <dd>{{ tableFormatter(item.assetTag) }}</dd>
                <br />
                <!-- Description -->
                <dt>{{ $t("pageHardwareStatus.table.description") }}:</dt>
                <dd>{{ tableFormatter(item.description) }}</dd>
                <br />
                <!-- Indicator LED -->
                <dt>{{ $t("pageHardwareStatus.table.indicatorLed") }}:</dt>
                <dd>{{ tableFormatter(item.indicatorLed) }}</dd>
                <br />
                <!-- Model -->
                <dt>{{ $t("pageHardwareStatus.table.model") }}:</dt>
                <dd>{{ tableFormatter(item.model) }}</dd>
              </dl>
            </b-col>
            <b-col sm="6" xl="4">
              <dl>
                <!-- Power state -->
                <dt>{{ $t("pageHardwareStatus.table.powerState") }}:</dt>
                <dd size="sm">{{ tableFormatter(item.powerState) }}</dd>
                <br />
                <dt>Switch:</dt>
                <dd style="height: 10px">
                  <b-form-group class="form-inline">
                    <b-form-checkbox
                      v-model="item.powerState"
                      data-test-id="nfcard-checkbox-swithRegisterValue"
                      name="switch-button"
                      value="On"
                      unchecked-value="Off"
                      switch
                      size="sm"
                      inline
                      @change="changeResetType(item.name, item.powerState)"
                    >
                      <span v-if="item.powerState === 'On'">
                        {{ $t("global.status.on") }}
                      </span>
                      <span v-else>
                        {{ $t("global.status.off") }}
                      </span>
                    </b-form-checkbox>
                    <b-button
                      v-if="item.powerState === 'On'"
                      name="restart-button"
                      size="sm"
                      style="heigh: 10px"
                      switch
                      pill
                      inline
                      @click="changeResetType(item.name, 'restart')"
                    >
                      Reset
                    </b-button>
                  </b-form-group>
                </dd>
                <br />
                <!-- Health rollup -->
                <dt>
                  {{ $t("pageHardwareStatus.table.statusHealthRollup") }}:
                </dt>
                <dd>{{ tableFormatter(item.healthRollup) }}</dd>
                <br />
                <!-- Status state -->
                <dt>{{ $t("pageHardwareStatus.table.statusState") }}:</dt>
                <dd>{{ tableFormatter(item.statusState) }}</dd>
                <br />
                <!-- System type -->
                <dt>{{ $t("pageHardwareStatus.table.systemType") }}:</dt>
                <dd>{{ tableFormatter(item.systemType) }}</dd>
              </dl>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </b-table>
  </page-section>
</template>

<script>
import PageSection from "@/components/Global/PageSection";
import IconChevron from "@carbon/icons-vue/es/chevron--down/20";

import StatusIcon from "@/components/Global/StatusIcon";

import TableRowExpandMixin from "@/components/Mixins/TableRowExpandMixin";
import TableDataFormatterMixin from "@/components/Mixins/TableDataFormatterMixin";
import ConsoleLayoutVue from "../../../layouts/ConsoleLayout.vue";
import axios from "axios";
import Vue from "vue";

export default {
  components: { IconChevron, PageSection, StatusIcon },
  mixins: [TableRowExpandMixin, TableDataFormatterMixin],
  data() {
    return {
      fields: [
        {
          key: "expandRow",
          label: "",
          tdClass: "table-row-expand",
        },
        {
          key: "id",
          label: this.$t("pageHardwareStatus.table.id"),
          formatter: this.tableFormatter,
        },
        {
          key: "health",
          label: this.$t("pageHardwareStatus.table.health"),
          formatter: this.tableFormatter,
          tdClass: "text-nowrap",
        },
        {
          key: "partNumber",
          label: this.$t("pageHardwareStatus.table.partNumber"),
          formatter: this.tableFormatter,
        },
        {
          key: "serialNumber",
          label: this.$t("pageHardwareStatus.table.serialNumber"),
          formatter: this.tableFormatter,
        },
      ],
      timer: null,
    };
  },
  computed: {
    systems() {
      return this.$store.getters["system/systems"];
    },
    nfcards() {
      return this.$store.getters["nfcards/getNFCards"];
    },
  },
  mounted() {
    // this.timer = setInterval(this.updateSystems, 10000);
  },
  created() {
    this.$store.dispatch("nfcards/getNFCards");
    this.$store.dispatch("system/getSystems").finally(() => {
      this.$root.$emit("hardware-status-system-complete");
    });
  },
  // beforeDestroy() {
  //   clearInterval(this.timer);
  //   this.timer = null;
  // },
  methods: {
    updateSystems: function () {
      console.log("update systems");
      this.$store.dispatch("system/getSystems");
    },
    changeResetType(nf_name, nf_type) {
      let newValue = "On";
      let i = 0;
      let j = 0;
      console.log(nf_name, nf_type);
      if (nf_type === "On") {
        newValue = "ForceOff";
      }
      if (nf_type === "restart") {
        newValue = "ForceRestart";
      }
      for (i = 0; i < this.nfcards.length; i++) {
        if (this.nfcards[i]["name"] === nf_name) {
          Vue.set(this.nfcards, i, { name: nf_name, ps: newValue });
          break;
        }
      }
      for (j = 0; j < this.systems.length; j++) {
        if (this.systems[j]["name"] === nf_name) {
          Vue.set(this.systems, j, { name: nf_name, ps: newValue });
          break;
        }
      }
      const obj = {};
      obj.name = nf_name;
      obj.payload = newValue;
      this.$store
        .dispatch("nfcards/saveNFCardValue", obj)
        .then((message) => console.log(message))
        .catch(({ message }) => {
          console.log(message);
        });
    },
  },
};
</script>
