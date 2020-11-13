<template>
  <b-container fluid="xl">
    <page-title />
    <div v-for="register in registers" :key="register.name">
      <b-row>
        <!-- <h2>{{ register.name }}</h2> -->
        <b-col md="12">
          <!-- <page-section :section-title="register.name"> -->
          <b-form-group :label="register.name" 
            label-cols-sm="4"
            label-cols-lg="3"
            label-for="input-horizontal"
          >
            <b-form-checkbox
              id="input-horizontal"
              v-model="register.value"
              data-test-id="serverLed-checkbox-switchIndicatorLed"
              name="check-button"
              value="On"
              unchecked-value="Off"
              switch
              @change="changeRegisterValue"
            >
              <span v-if="register.name && register.value !== 'off'">
                {{ $t("global.status.on") }}
              </span>
              <span v-else>
                {{ $t("global.status.off") }}
              </span>
            </b-form-checkbox>
          </b-form-group>
          <!-- </page-section> -->
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import PageTitle from "@/components/Global/PageTitle";
import PageSection from "@/components/Global/PageSection";
import BVToastMixin from "@/components/Mixins/BVToastMixin";
import LoadingBarMixin from "@/components/Mixins/LoadingBarMixin";

export default {
  name: "Registers",
  components: { PageTitle, PageSection },
  mixins: [LoadingBarMixin, BVToastMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {},
  computed: {
    registers: {
      get() {
        return this.$store.getters["registers/getRegisters"];
      },
    },
    // indicatorLed: {
    //   get() {
    //     return this.$store.getters['serverLed/getIndicatorValue'];
    //   },
    //   set(newValue) {
    //     return newValue;
    //   },
    // },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch("registers/getRegisters")
      .finally(() => this.endLoader());
  },
  methods: {
    changeRegisterValue(indicatorLed) {
      this.$store
        .dispatch("serverLed/saveIndicatorLedValue", indicatorLed)
        .then((message) => this.successToast(message))
        .catch(({ message }) => {
          this.errorToast(message);
          if (indicatorLed === "Off") {
            this.indicatorLed === "Lit";
          } else {
            this.indicatorLed === "Off";
          }
        });
    },
  },
};
</script>
