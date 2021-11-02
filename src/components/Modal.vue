<template>
  <v-dialog
      v-model="state.show"
      max-width="700px"
  >
    <v-card v-if="state.show">
      <v-card-title class="d-flex flex-column">
        <span class="text-h5 ">{{ state.title }}</span>
        <v-subheader v-if="state.elem" class="d-flex flex-column">
          <span>Задача: {{ state.elem.task.title }}</span>
        </v-subheader>

      </v-card-title>
      <v-card-text>
        <v-container class="py-0">
          <v-form ref="form">
            <v-autocomplete
                v-model="newElemData.project"
                v-if="!state.edit"
                item-text="NAME"
                item-value="ID"
                :items="groups"
                label="Проект"
                prepend-icon="mdi-account-group"
                :rules="[value => !!value || 'Заполните поле проект']"

            ></v-autocomplete>

            <v-text-field
                v-model="newElemData.name"
                v-if="!state.edit"
                label="Наименование задачи"
                prepend-icon="mdi-pencil-outline"
                :rules="[value => !!value || 'Заполните поле наименование']"
            >
            </v-text-field>

            <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="date"
                    label="Дата"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[value => !!value || 'Заполните поле дата']"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="date"
                  @input="dateMenu = false"
              ></v-date-picker>
            </v-menu>
            <div class="d-flex justify-space-between align-center ">
              <v-menu
                  ref="startMenu"
                  v-model="startMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="startTime"
                  transition="scale-transition"
                  offset-y

                  max-width="290px"
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="startTime"
                      label="Начало"
                      prepend-icon="mdi-clock-time-four-outline"
                      style="width: 33%; max-width: 33%"
                      v-bind="attrs"
                      v-on="on"
                      :rules="[value => !!value || 'Заполните поле время начала']"
                  >


                  </v-text-field>
                </template>
                <v-time-picker
                    v-if="startMenu"
                    v-model="startTime"
                    full-width
                    format="24hr"
                    :max="stopTime"
                    scrollable
                    @click:minute="$refs.startMenu.save(startTime)"
                ></v-time-picker>
              </v-menu>
              <v-menu

                  ref="stopMenu"
                  v-model="stopMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="stopTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field

                      :rules="[value => !!value || 'Заполните поле время окончания']"
                      style="width: 33%; max-width: 33%"
                      v-model="stopTime"
                      label="Конец"
                      prepend-icon="mdi-clock-time-nine-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                    v-if="stopMenu"
                    v-model="stopTime"
                    full-width
                    format="24hr"
                    :min="startTime"
                    scrollable
                    @click:minute="$refs.stopMenu.save(stopTime)"
                ></v-time-picker>
              </v-menu>
              <v-checkbox
                  v-model="pause"
                  label="Простой"
              ></v-checkbox>
            </div>
            <v-text-field
                v-model = "comment"
                label="Комментарий"
                prepend-icon="mdi-comment-outline"
            ></v-text-field>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="d-flex justify-space-between pt-0">
        <div>
          <v-btn
              color="red darken-1"
              text
              @click="deleteItem"
              v-show="state.edit"
          >
            {{ "Удалить" }}
          </v-btn>
        </div>
        <div>
          <v-btn
              text
              color="green darken-1"
              @click="state.edit?updateItem():addItem()"
          >
            {{ state.edit ? "Сохранить" : "Добавить" }}
          </v-btn>

          <v-btn
              color="blue darken-1"
              text
              @click="state.show = false"
          >
            Закрыть
          </v-btn>
        </div>


      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Modal",
  props: {
    state: {
      type: Object,
      required: true
    }
  },
  data: () => {
    return {
      newElemData: {},
      date: '',
      dateMenu: false,
      startTime: '',
      stopTime: '',
      startMenu: false,
      stopMenu: false,
      groups: [],
      pause: false,
      comment: '',
    }
  },
  async created() {

    if (this.state.edit) {
      let start = new Date(this.state.elem.CREATED_DATE);
      let stop = new Date(this.state.elem.STOP_IN_LOGS);
      this.date = start.getFullYear() + '-' + ((1 + start.getMonth()) < 10 ? '0' + (1 + start.getMonth()) : (1 + start.getMonth())) + '-' + (start.getDate() < 10 ? '0' + start.getDate() : start.getDate());
      this.startTime = (start.getHours() < 10 ? '0' + start.getHours() : start.getHours()) + ":" + (start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes());
      this.stopTime = (stop.getHours() < 10 ? '0' + stop.getHours() : stop.getHours()) + ":" + (stop.getMinutes() < 10 ? '0' + stop.getMinutes() : stop.getMinutes());
      this.pause = this.state.elem.pause;
      this.comment = this.state.elem.COMMENT_TEXT;
    } else {
      this.groups = await this.fetchGroups();
    }

  },
  methods: {
    async fetchGroups() {
      let groups = [];
      let filter = {
        'CHECK_PERMISSIONS': 'N',
        'PROJECT': 'Y',
      }
      // if (!this.isArchive) {
      //   filter.CLOSED = 'N';
      // }

      await this.callMethod(
          'sonet_group.get',
          {
            FILTER: filter,
          }).then(function (res) {
        groups = res;
      });
      return groups;
    },
    deleteItem() {
      let ctxt = this;
      this.callMethod(
          'task.elapseditem.delete',
          [this.state.elem.TASK_ID, this.state.elem.ID]).then(() => {
        ctxt.$emit('needRefresh');
        ctxt.state.show = false
      });


    },
    addItem() {

      if (this.$refs.form.validate()) {
        let ctxt = this;
        let fields = {
          TITLE: this.newElemData.name,
          GROUP_ID: this.newElemData.project,
          RESPONSIBLE_ID: this.state.user.ID
        }
        let created = new Date(this.date);
        created.setHours(Number.parseInt(this.startTime.split(':')[0]));
        created.setMinutes(Number.parseInt(this.startTime.split(':')[1]));

        let stopped = new Date(this.date);
        stopped.setHours(Number.parseInt(this.stopTime.split(':')[0]));
        stopped.setMinutes(Number.parseInt(this.stopTime.split(':')[1]));
        let logfields = {COMMENT_TEXT:this.comment, CREATED_DATE: created, SECONDS: ((stopped - created) / 1000)}
        if (this.pause) {
          logfields.COMMENT_TEXT += '||PAUSE';
        }
        this.callMethod(
            'tasks.task.add', {fields: fields}).then(function (res) {
              ctxt.callMethod('task.elapseditem.add', [res[0].task.id, logfields]).then(() => {
                ctxt.callMethod('tasks.task.complete', {taskId: res[0].task.id}).then(function () {
                  ctxt.$emit('needRefresh');
                  ctxt.state.show = false;
                })
              })
            }
        )

      }
    },
    updateItem() {
      if (this.$refs.form.validate()) {
        let ctxt = this;
        let created = new Date(this.date);
        created.setHours(Number.parseInt(this.startTime.split(':')[0]));
        created.setMinutes(Number.parseInt(this.startTime.split(':')[1]));

        let stopped = new Date(this.date);
        stopped.setHours(Number.parseInt(this.stopTime.split(':')[0]));
        stopped.setMinutes(Number.parseInt(this.stopTime.split(':')[1]));


        let fields = {
          COMMENT_TEXT: this.comment,
          CREATED_DATE: created,
          SECONDS: ((stopped - created) / 1000),
        }
        if (this.pause) {
          fields.COMMENT_TEXT += '||PAUSE';
        }


        this.callMethod(
            'task.elapseditem.update',
            [this.state.elem.TASK_ID, this.state.elem.ID, fields],
        ).then(function () {
          ctxt.$emit('needRefresh');
          ctxt.state.show = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>