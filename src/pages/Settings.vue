<template>
  <v-card elevation="2" class="mt-4 mx-1">
    <v-toolbar dense flat>
      <v-toolbar-title>Настройки стоимости часа</v-toolbar-title>
    </v-toolbar>
    <div class="d-flex justify-space-between">
      <div :class="$style.column">
        <div v-for="(user, index) in copyUsers" :key="index" class="d-flex align-center ">
          <v-avatar size="40">
            <img
                :src="
                user.photo
                  ? user.photo
                  : 'data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E'
              "
                :alt="user.name"
            /></v-avatar>
          <v-subheader style="width: 30%"> {{ user.name }}</v-subheader>

          <v-text-field
              class="mt-6"
              hint="Стомость одного часа сотрудника"
              outlined
              v-model.number="user.hourRate"
              type="number"
              label="Стоимость часа"
          ></v-text-field>
          <v-btn style="align-self: baseline; margin: 30px  0 0 8px" @click=" copyUsers.splice(index, 1);">
            <v-icon color="error">
              mdi-delete
            </v-icon>
          </v-btn>
        </div>
      </div>
      <div :class="$style.column">
        <div :class="$style.buttons" class="mt-7">
          <v-btn color="primary"
                 @click="addUser"
                 style="margin-right: 30px;"
                 outlined>
            <v-icon>
              mdi-plus
            </v-icon>
            Добавить

          </v-btn>
          <v-btn color="submit"
                 style="margin-right: 30px;"
                 v-if="!isEqual"
                 @click="save">
            Сохранить изменения
          </v-btn>
          <v-btn color="primary"
                 style="margin-right: 30px;"
                 @click="scrollDown">

            <v-icon>
              mdi-arrow-down-bold
            </v-icon>

          </v-btn>
        </div>
      </div>
    </div>

  </v-card>
</template>

<script>
export default {
  name: "Settings",
  data: () => {
    return {
      copyUsers: [],
      users: []

    }
  },
  computed: {
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
    }

  },
  created() {
    // eslint-disable-next-line no-undef
    if (!BX24.appOption.get('users')) this.users = [];
    // eslint-disable-next-line no-undef
    else this.users = JSON.parse(BX24.appOption.get('users'));

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

  },

  methods: {
    scrollDown () {
      window.scrollTo(0, window.outerHeight)
    },
    addUser() {
      // eslint-disable-next-line no-undef
      BX24.selectUser((newUser) => {
      if (!this.copyUsers.find((el) => el.id === newUser.id))  this.copyUsers.push({
          name: newUser.name,
          hourRate: 0,
          photo: newUser.photo,
          id: newUser.id
        })
      });
    },
    save() {
      // eslint-disable-next-line no-undef
      BX24.appOption.set('users', JSON.stringify(this.copyUsers), () => {
        this.users = JSON.parse(JSON.stringify(this.copyUsers));
      });
    }
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
</style>