<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <!-- <h2>{{ register.name }}</h2> -->
      <b-col md="12">
        <page-section :section-title="testRegisterTitle">
          <b-form-group
            v-for="register in registers"
            :key="register.name"
            :label="register.name"
            label-cols-sm="4"
            label-cols-lg="3"
          >
            <b-form-checkbox
              v-model="register.value"
              data-test-id="register-checkbox-swithRegisterValue"
              name="check-button"
              value="On"
              unchecked-value="Off"
              switch
              @change="changeRegisterValue(register.name, register.value)"
            >
              <span v-if="register.name && register.value !== 'Off'">
                {{ $t("global.status.on") }}
              </span>
              <span v-else>
                {{ $t("global.status.off") }}
              </span>
            </b-form-checkbox>
          </b-form-group>
        </page-section>
      </b-col>
    </b-row>
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
      set(newRegisters) {
        return newRegisters;
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
    changeRegisterValue(name, oldRegisterValue) {
      var newRegisterValue = "On";
      if (oldRegisterValue === "On") {
        newRegisterValue = "Off";
      }
      console.log(this.registers);
      var obj = {};
      obj.name = name;
      obj.payload = newRegisterValue;
      this.$store
        .dispatch("registers/saveRegisterValue", obj)
        .then((message) => this.successToast(message))
        .catch(({ message }) => {
          this.errorToast(message);
        });
    },
  },
};
</script>
