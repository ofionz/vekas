<template>
  <div>
    <v-select
        v-model="selected"
        :items="options"
        :menu-props="{ maxHeight: '400' }"
        label="Выберите сотрудников"
        multiple
        chips
        @change="selectHandler"
        hint="Или оставьте поле пустым для того чтобы выбрать весь отдел методистов"
        persistent-hint
    ></v-select>
  </div>
</template>

<script>
export default {
  name: 'PersonSelector',
  data() {
    return {
      selected: [],
      options: []
    }
  },
  async created() {

    await this.callMethod('user.get', {"UF_DEPARTMENT": 13, "ACTIVE": true}).then((res) => {
          res.forEach((el) => {
            if (el.NAME) this.options.push({value: el.ID, text: `${el.NAME} ${el.LAST_NAME}`})
          })
          this.$emit('selected', {selected: this.selected, all: this.options});
        }
    );

  },
  methods: {
    selectHandler() {
      this.$emit('selected', {selected: this.selected, all: this.options});
    }
  }
}
</script>
<style scoped>

</style>
