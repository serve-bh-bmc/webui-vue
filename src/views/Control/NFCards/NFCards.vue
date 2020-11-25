<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <!-- <h2>{{ register.name }}</h2> -->
      <b-col md="12">
        <page-section :section-title="testRegisterTitle">
          <b-form-group
            v-for="nfcard in nfcards"
            :key="nfcard.name"
            :label="nfcard.name"
            label-cols-sm="4"
            label-cols-lg="3"
          >
            <b-form-checkbox
              v-model="nfcard.value"
              data-test-id="nfcard-checkbox-swithRegisterValue"
              name="check-button"
              value="On"
              unchecked-value="Off"
              switch
              @change="changeRegisterValue(nfcard.name, nfcard.value)"
            >
              <span v-if="nfcard.name && nfcard.value !== 'Off'">
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
  name: "NFCards",
  components: { PageTitle, PageSection },
  mixins: [LoadingBarMixin, BVToastMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      NFCardsPage: "NFCardsPage",
    };
  },
  computed: {
    nfcards: {
      get() {
        return this.$store.getters["nfcards/getNFCards"];
      },
      set(newNFCards) {
        return newNFCards;
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
    this.$store.dispatch("nfcards/getNFCards").finally(() => this.endLoader());
  },
  methods: {
    changeRegisterValue(name, oldNFCardValue) {
      var newNFCardValue = "On";
      if (oldNFCardValue === "On") {
        newNFCardValue = "Off";
      }
      var obj = {};
      obj.name = name;
      obj.payload = newNFCardValue;
      this.$store
        .dispatch("nfcards/saveNFCardValue", obj)
        .then((message) => this.successToast(message))
        .catch(({ message }) => {
          this.errorToast(message);
        });
    },
  },
};
</script>
