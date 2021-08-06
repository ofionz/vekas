<template>
  <v-app >
    <MethodistsReport v-on:dblclick.native="refresh"/>
  </v-app>
</template>

<script>
import MethodistsReport from './pages/MethodistsReport';

export default {
  name: 'App',

  components: {
    MethodistsReport,
  },

methods: {
    refresh() {
      window.location = window.location.href
    }
},

  data: () => ({
    //
  }),
};
</script>
