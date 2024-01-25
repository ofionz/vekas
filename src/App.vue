<template>
  <v-app>
    <v-overlay :value="isPreloader">
      <span>Идет загрузка...</span>
    </v-overlay>
    <v-card hover color="primary" class="text-center">
      <h2 @click="window.location.reload(false)" style="color: white">Отчёт</h2>
      <!--      <h2 style="color: white">Отчёт</h2>-->
      <v-tabs dark background-color="primary" show-arrows centered>
        <v-tab v-if="window.isSuper" to="/stages">
          Стадии
        </v-tab>
        <v-tab to="/main">
          Проекты
        </v-tab>
        <v-tab to="/managers">
          Сотрудники
        </v-tab>
        <v-tab to="/settings">
          Настройки
        </v-tab>
      </v-tabs>
    </v-card>
    <v-main>
      <router-view/>
    </v-main>

  </v-app>
</template>

<script>


export default {
  name: 'App',

  components: {},
  async created() {
    // this.getLocation();
    this.$eventBus.$on("preloader", () => this.isPreloader = !this.isPreloader);
    // eslint-disable-next-line no-undef
    // BX24.callMethod('entity.delete', {'ENTITY': 'SETTINGS'})
    // eslint-disable-next-line no-undef


  },
  methods: {
    // showPosition(position) {
    //   alert("Широта: " + position.coords.latitude +
    //       "Долгота: " + position.coords.longitude)
    // },
    // getLocation() {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(this.showPosition);
    //   } else {
    //     alert("Геолокация не поддерживается этим браузером.");
    //   }
    // }
  },
  computed: {
    window: () => window,
  },
  data: () => ({
    isPreloader: false,
  }),
};
</script>
<style>
body, html {
  overflow-y: auto !important;
}

.v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
}

</style>
