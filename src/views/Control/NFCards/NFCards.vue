<template>
  <b-container fluid="xl">
    <page-title />
    <b-row v-for="(nfcard, index) in this.nfcards" :key="index">
      <!-- <h2>{{ register.name }}</h2> -->
      <b-col md="12">
        <page-section :section-title="nfcard['name']">
          <b-form-group>
            <b-form-checkbox
              v-model="nfcards[index]"
              data-test-id="nfcard-checkbox-swithRegisterValue"
              name="check-button"
              value="On"
              unchecked-value="Off"
              switch
              @change="changeRegisterValue(index, nfcards[index]['ps'])"
            >
              <span>
                {{ nfcard[["name"]] }}
              </span>
              <span v-if="nfcards[index]['ps'] === 'On'">
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
  },
  created() {
    this.startLoader();
    this.$store.dispatch("nfcards/getNFCards").finally(() => this.endLoader());
  },
  methods: {
    changeRegisterValue(index, oldNFCardValue) {
      var newNFCardValue = "On";
      if (oldNFCardValue === "On") {
        newNFCardValue = "ForceOff";
      }
      let temp = { name: this.nfcards[index]["name"], ps: newNFCardValue };
      this.nfcards.splice(index, 1, temp);
      console.log(this.nfcards[index]);
      var obj = {};
      obj.name = this.nfcards[index]["name"];
      obj.payload = newNFCardValue;
      this.$store
        .dispatch("nfcards/saveNFCardValue", obj)
        .then((message) => this.successToast(message))
        .catch(({ message }) => {
          this.errorToast(message);
          if (oldNFCardValue === "ForceOff") {
            this.nfcards[index]["ps"] === "On";
          } else {
            this.nfcards[index]["ps"] === "ForceOff";
          }
        });
    },
  },
};
</script>
