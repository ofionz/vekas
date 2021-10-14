<template>
  <v-app  >
    <v-overlay :value="isPreloader">
      <span >Идет формирование отчёта...</span>
    </v-overlay>
    <v-card hover color="primary" class="text-center">
<!--      <h2 @click="window.location.reload(false)"  style="color: white">Отчёт</h2>-->
      <h2 style="color: white">Отчёт</h2>
      <v-tabs dark background-color="primary" show-arrows centered>
        <v-tab to="/main" >
          Проекты
        </v-tab>
        <v-tab to="/managers" >
          Сотрудники
        </v-tab>
        <v-tab to="/settings" >
          Настройки
        </v-tab>
      </v-tabs>
    </v-card>
    <v-main  >
      <router-view />
    </v-main>

  </v-app>
</template>

<script>


export default {
  name: 'App',

  components: {
  },
  created() {
    this.$eventBus.$on("preloader", ()=> this.isPreloader = !this.isPreloader);
  },

  methods: {
},
  computed: {
    window: () => window,
  },
  data: () => ({
    isPreloader: false,
  }),
};
</script>
<style >
body, html {
  overflow-y: auto!important;
}
.v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
}

</style>