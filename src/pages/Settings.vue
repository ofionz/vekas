<template>
  <div>

    <v-card elevation="2" class="mt-4 mx-1 ">
      <v-toolbar dense flat>
        <v-toolbar-title>Пользовательские настройки приложения</v-toolbar-title>

      </v-toolbar>
      <div class="d-flex flex-column justify-space-between pa-4">

        <v-checkbox
            @change="saveSettings"
            v-model="userOptions.showHeaders"
            label="Включить заголовки в проектном отчёте"
        ></v-checkbox>

      </div>
    </v-card>
    <v-card v-if="isSuper" elevation="2" class="mt-4 mx-1">
      <v-toolbar dense flat>
        <v-toolbar-title>Настройка прав доступа</v-toolbar-title>
      </v-toolbar>
      <div class="d-flex justify-space-between">
        <div :class="$style.column">
          <v-select label="Суперпользователи" multiple item-text="name" return-object v-model="superUsers" chips
                    deletable-chips :items="superUsers"
                    hint="Суперпользователи не имеют ограничений при просмотре\редактировании логов, стоимости часа и доступа в настройки">
          </v-select>

        </div>
        <div :class="$style.column">
          <div :class="$style.buttons" class="mt-7">
            <v-btn color="primary"
                   @click="addUserToSuperUserList"
                   style="margin-right: 30px;"
                   outlined>
              <v-icon>
                mdi-plus
              </v-icon>
              Добавить

            </v-btn>
          </div>
        </div>
      </div>
    </v-card>
    <v-card v-if="isSuper" elevation="2" class="mt-4 mx-1">
      <v-toolbar dense flat>
        <v-toolbar-title>Настройки стоимости часа</v-toolbar-title>
      </v-toolbar>
            <v-data-table
          :headers="headers"
          :items="copyUsers"
          :search="search"
      >

        <template v-slot:top>
          <v-toolbar
              flat
          >

            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Поиск"
                single-line
                hide-details

            ></v-text-field>

            <v-dialog
                v-model="dialog"
                max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="primary"
                    dark
                    class="mb-2 mr-5"
                    v-bind="attrs"
                    v-on="on"
                    outlined
                >
                  <v-icon>
                    mdi-plus
                  </v-icon>
                  Добавить
                </v-btn>
                <v-spacer></v-spacer>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text style="padding-bottom: 0">
                  <v-container style="padding-bottom: 0">

                    <v-text-field
                        v-model="editedItem.name"
                        @click="addUserToRateList()"
                        label="Имя сотрудника"
                        ref="name"
                        :rules="[!!editedItem.name||'Выберите сотрудника']"

                    ></v-text-field>

                    <v-text-field
                        v-model="editedItem.hourRate"
                        label="Ставка часа"
                        ref="hourrate"
                        class="mt-4"
                        :rules="[!!editedItem.hourRate||'Заполните ставку часа',Number.isInteger(Number(editedItem.hourRate)) ||'Введите корректное число!']"
                    ></v-text-field>
                    <v-alert transition="scale-transition"  ref="alert" style="opacity: 0; scale: 0; transition: all 0.3s ease 0.3s!important; animation: show 3s 1;
animation-fill-mode: forwards;
animation-delay: 1s; "  type="error">
                      Такой сотрудник уже есть в списке
                    </v-alert>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                  >
                    Отмена
                  </v-btn>
                  <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                  >
                    Сохранить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title style="font-size: 1.2rem" class="">Вы уверены что хотите удалить этот элемент ?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Нет</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">Да</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.name="{ item }">
          <a style="text-decoration: none; color: rgba(0, 0, 0, 0.87)" target="_blank" :href="'https://ooovekas.bitrix24.ru/company/personal/user/'+item.id+'/'">
          <v-avatar class="mr-3" size="30">

            <img
                :src="
                            item.photo
                              ? item.photo
                              : 'data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E'
                          "
                :alt="item.name"
            /></v-avatar>
          <span>{{item.name}}</span></a>

        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
              small
              @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>

      </v-data-table>
    </v-card>
  </div>

</template>
<script>
export default {
  name: "Settings",
  data: () => {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        hourRate: 0,
      },
      defaultItem: {
        name: '',
        hourRate: 0,
      },
      headers: [
        {
          text: 'Имя',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        {text: 'Стоимость часа', value: 'hourRate'},
        {text: 'Действия', value: 'actions', sortable: false},

      ],
      copyUsers: [],
      users: [],
      settings: {},
      superUsers: [],
      userOptions: {
        showHeaders: true,
        // allUsersLogs: false
      },
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    superUsers() {
      this.callMethod('entity.item.update', {
        ENTITY: 'SETTINGS',
        ID: this.settings.SUPERUSERS.ID,
        PROPERTY_VALUES: {
          VALUE: JSON.stringify(this.superUsers)
        }
      })
      // // eslint-disable-next-line no-undef
      // BX24.appOption.set('superUsers', JSON.stringify(this.superUsers), () => {
      // });
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Добавить запись' : 'Редактировать запись'
    },
    isSuper() {
      return window.isSuper
    },
    isEqual() {
      if (this.users.length !== this.copyUsers.length) {
        return false
      }
      let flag = true;
      this.users.forEach((el) => {
        let copy = this.copyUsers.find((elem) => (elem.id === el.id))
        if (!copy || copy.hourRate !== el.hourRate) {
          flag = false;
        }
      })
      return flag;
    },
  },
  async created() {
    this.settings = await this.fetchSettings();
    let options = this.settings;
    // eslint-disable-next-line no-undef
    if (BX24.userOption.get('options')) {
      // eslint-disable-next-line no-undef
      this.userOptions = JSON.parse(BX24.userOption.get('options'));
    }

    // eslint-disable-next-line no-undef
    if (!options.HOURRATE?.VALUE) this.users = [];
    // eslint-disable-next-line no-undef
    else this.users = (options.HOURRATE?.VALUE);
    this.users.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    this.copyUsers = JSON.parse(JSON.stringify(this.users))

    // eslint-disable-next-line no-undef
    if (!options.SUPERUSERS?.VALUE) this.superUsers = [];
    // eslint-disable-next-line no-undef
    else this.superUsers = options.SUPERUSERS?.VALUE;

    this.superUsers.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.copyUsers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.copyUsers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.copyUsers.splice(this.editedIndex, 1)
      this.updateData();
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1

      })
    },


    saveSettings() {
      // eslint-disable-next-line no-undef
      BX24.userOption.set('options', JSON.stringify(this.userOptions));
    },
    scrollDown() {
      window.scrollTo(0, window.outerHeight)
    },

    addUserToRateList() {

      // eslint-disable-next-line no-undef
      BX24.selectUser((newUser) => {
        if (!this.copyUsers.find((el) => el.id === newUser.id)) {
          // this.copyUsers.unshift({
          //   name: newUser.name,
          //   hourRate: 0,
          //   photo: newUser.photo,
          //   id: newUser.id
          // })
          this.editedItem.name = newUser.name;
          this.editedItem.photo = newUser.photo;
          this.editedItem.id = newUser.id;
        }
        else {

          this.$refs.alert.$el.style.opacity = '1'
          this.$refs.alert.$el.style.scale = '1'


          setTimeout(()=> {
            this.$refs.alert.$el.style.opacity = '0'
            this.$refs.alert.$el.style.scale = '0.7'

          }, 3000)
          // alert('Пользователь уже присутствует в списке!')
        }

      });
    },
    addUserToSuperUserList() {
      // eslint-disable-next-line no-undef
      BX24.selectUser((newUser) => {
        if (!this.superUsers.find((el) => el.id === newUser.id)) this.superUsers.push({
          name: newUser.name,
          photo: newUser.photo,
          id: newUser.id
        })
      });
    },
    updateData() {
      this.callMethod('entity.item.update', {
        ENTITY: 'SETTINGS',
        ID: this.settings.HOURRATE.ID,
        PROPERTY_VALUES: {
          VALUE: JSON.stringify(this.copyUsers)
        }
      }).then(() => this.users = JSON.parse(JSON.stringify(this.copyUsers)))


      // eslint-disable-next-line no-undef
      // BX24.appOption.set('users', JSON.stringify(this.copyUsers), () => {
      //   this.users = JSON.parse(JSON.stringify(this.copyUsers));
      // });
    },
    save() {
      if (this.$refs.name.validate() && this.$refs.hourrate.validate()) {
        if (this.editedIndex > -1) {
          Object.assign(this.copyUsers[this.editedIndex], this.editedItem)
        } else {
          this.copyUsers.push(this.editedItem)
        }
        this.close()
        this.updateData();
      }


      },

  }
}
</script>

<style lang="scss" module>
.column {
  width: 50%;
  margin: 20px;
}

.buttons {
  position: sticky;
  top: 100px;
  margin-left: 20px;
}
@keyframes show{
  0%{
    opacity:0;
  }
  100% {
    opacity:1;
  }
}
</style>