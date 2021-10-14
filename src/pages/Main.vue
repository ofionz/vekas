<template>
  <v-card elevation="2" class="mt-1 mx-1">
    <v-card class="mt-2 mb-3 pa-4 text-center">
      <div class="d-flex align-center justify-center">
<!--        <v-dialog-->
<!--            ref="dialog"-->
<!--            v-model="modal"-->
<!--            :return-value.sync="dates"-->
<!--            persistent-->
<!--            width="290px"-->
<!--        >-->
<!--          <template v-slot:activator="{ on, attrs }">-->

<!--            <v-text-field-->
<!--                style="min-width: 300px "-->
<!--                v-model="dateRangeText"-->
<!--                label="Выберите период дат создания проекта"-->
<!--                persistent-hint-->
<!--                hint="По умолчанию в отчёте отражены все активные проекты"-->
<!--                prepend-icon="mdi-calendar"-->
<!--                readonly-->
<!--                v-bind="attrs"-->
<!--                v-on="on"-->
<!--            ></v-text-field>-->

<!--          </template>-->
<!--          <v-date-picker-->
<!--              v-model="dates"-->
<!--              no-title-->
<!--              locale="ru"-->
<!--              range-->
<!--          >-->
<!--            <v-spacer></v-spacer>-->
<!--            <v-btn-->
<!--                text-->
<!--                color="primary"-->
<!--                @click="modal = false"-->
<!--            >-->
<!--              Отмена-->
<!--            </v-btn>-->
<!--            <v-btn-->
<!--                text-->
<!--                color="primary"-->
<!--                @click="createReport"-->
<!--            >-->
<!--              OK-->
<!--            </v-btn>-->
<!--          </v-date-picker>-->
<!--        </v-dialog>-->
        <v-select v-model="selectedGroups" item-value="ID" item-text="NAME" :items="groupList" clearable chips  label="Проекты" multiple>
          <template v-slot:prepend-item>
            <v-list-item>
              <v-list-item-content>
                <v-text-field v-model="searchTerm" placeholder="Поиск" @input="searchGroup"></v-text-field>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
        </v-select>
        <v-btn class="ml-6" color="submit" @click="createReport"> Сформировать отчет </v-btn>

<!--        <v-checkbox-->
<!--            @change="createReport"-->
<!--            v-model="isArchive"-->
<!--            label="Включить в отчёт архивные проекты"-->
<!--        ></v-checkbox>-->
      </div>

    </v-card>

    <v-card v-if="usersWithoutHourRate.length" color="error"
            outlined
            class="mt-1 mb-1 text-center">
      <div> Внимание! Расчет содержит ошибки! У сотрудника(ов): <b>{{ usersWithoutHourRate.join(", ") }} </b> не
        установлена ставка часа!
      </div>
    </v-card>

    <v-data-table
        locale="RU"
        v-if="items"
        :headers="headers"
        :items="items"
        show-expand
        :disable-pagination="true"
        :hide-default-footer="true"
        single-expand
        :expanded.sync="expanded"
        item-key="name"
        class="table_project"

    >
      <template v-slot:item.timeEstimate="{ item }">
        {{ item.timeEstimate|secondsToHoursAndMinutes }}
      </template>
      <template v-slot:item.timeSpent="{ item }">
        {{ item.timeSpent|secondsToHoursAndMinutes }}
      </template>
      <template v-slot:item.amount="{ item }">
        {{Math.round(item.amount*100)/100  }} руб.
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td style="padding: 0" :colspan="headers.length">
          <v-data-table
              locale="RU"
              expand-icon="mdi-menu-down"
              show-expand
              :expanded.sync="innerExpanded"
              item-key="name"
              :headers="userTableHeader"
              :items="item.users"
              :disable-pagination="true"
              :hide-default-footer="true"
              :class="[!userOptions.showHeaders ?  'collapse': '', 'table_users']"

          >
            <template v-slot:item.timeEstimate="{ item }">
              {{ item.timeEstimate|secondsToHoursAndMinutes }}
            </template>
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="27">
                  <img
                      :src="
                item.icon !== '/bitrix/images/tasks/default_avatar.png' && item.icon
                  ? item.icon
                  : 'data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E'
              "
                      :alt="item.name"
                  /></v-avatar>
                <v-subheader style="width: 30%"> {{ item.name }}</v-subheader>
              </div>
            </template>
            <template v-slot:item.timeSpent="{ item }">
              {{ item.timeSpent|secondsToHoursAndMinutes }}
            </template>
            <template v-slot:item.amount="{ item }">
              {{ Math.round(item.amount*100)/100 }} руб.
            </template>
            <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" style="padding: 0">
          <v-data-table
              locale="RU"
              :headers="taskTableHeader"
              :items="item.tasks"
              :disable-pagination="true"
              :hide-default-footer="true"
              :class="[!userOptions.showHeaders ?  'collapse': '', 'table_tasks']"
          >
            <template v-slot:item.title="{ item }">


<!--              {{ item.title}}-->
              <a target="_blank" :href="'https://ooovekas.bitrix24.ru/company/personal/user/'+ window.USER.ID + '/tasks/task/view/' + item.id + '/'">{{ item.title}}</a>
            </template>

            <template v-slot:item.createdDate="{ item }">
              {{ moment(item.createdDate).format("DD.MM.YYYY HH:mm:ss") }}
            </template>

            <template v-slot:item.timeEstimate="{ item }">
              {{ item.timeEstimate|secondsToHoursAndMinutes }}
            </template>
            <template v-slot:item.timeSpentInLogs="{ item }">
              {{ item.timeSpentInLogs|secondsToHoursAndMinutes }}
            </template>
            <template class="columnAmount" v-slot:item.amount="{ item }">
              {{ Math.round(item.amount*100)/100  }} руб.
            </template>
          </v-data-table>
        </td>
      </template>
    </v-data-table>
    </td>
</template>
</v-data-table>

</v-card>
<!--  <div v-if="groupData"> {{groupData}}-->

</template>

<script>
export default {
  name: "Main",
  data: () => {
    return {
      userOptions: {
        showHeaders: true,
        allUsersLogs: false
      },
      modal: false,
      dates: [(new Date(new Date('1970-01-01T03:24:00') - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
      expanded: [],
      innerExpanded: [],
      taskTableHeader: [
        {text: '', value: '', width: '140px', sortable: false},
        {
          text: 'Заголовок задачи',
          value: 'title'
        },
        {
          text: 'Дата',
          value: 'createdDate'
        },
        {
          width: '15vw',
          text: 'Время плановое',
          value: 'timeEstimate'
        },
        {
          width: '15vw',
          text: 'Времени потрачено',
          value: 'timeSpentInLogs'
        },
        {
          width: '15vw',
          text: 'Сумма',
          value: 'amount'
        },
      ],
      userTableHeader: [
        {text: '', width: '90px', align: 'end', value: 'data-table-expand'},
        {
          text: 'Сотрудник',
          value: 'name'
        },
        {
          width: '15vw',
          text: 'Время плановое',
          value: 'timeEstimate'
        },
        {
          width: '15vw',
          text: 'Времени потрачено',
          value: 'timeSpent'
        },
        {
          width: '15vw',
          text: 'Сумма',
          value: 'amount'
        },

      ],
      headers: [
        {text: '', value: 'data-table-expand'},
        {
          text: 'Наименование проекта',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {width: '15vw', text: 'Время план', value: 'timeEstimate'},
        {width: '15vw', text: 'Времени потрачено', value: 'timeSpent'},

        {
          width: '15vw',
          text: 'Сумма',
          value: 'amount'
        },

      ],
      items: [],
      users: [],
      // isArchive: false,
      usersWithoutHourRate: [],
      groupList: [],
      searchTerm: "",
      window: undefined,
      groupCopy: [],
      selectedGroups: []
    }
  },
  computed: {
    dateRangeText() {
      if (!this.dates.length || this.dates [0] === (new Date(new Date('1970-01-01T03:24:00') - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)) {
        return 'Выберите период дат создания проекта'
      } else if (this.dates.length === 1) {
        return "Отчёт за " + this.formatDate(this.dates[0]);
      } else {
        if (this.dates[0] < this.dates[1])
          return "Период с " + this.formatDate(this.dates[0]) + " по " + this.formatDate(this.dates[1]);
        else return "Период с " + this.formatDate(this.dates[1]) + " по " + this.formatDate(this.dates[0]);
      }
    }
  },
  filters: {
    secondsToHoursAndMinutes(seconds) {

      seconds = Number(seconds);
      var h = Math.floor(seconds / 3600);
      var m = Math.floor(seconds % 3600 / 60);

      var hDisplay = h > 0 ? h + 'ч. ' : "";
      var mDisplay = m > 0 ? m + "мин. " : "";
      if (!h && !m) {
        return 0
      }
      return hDisplay + mDisplay;

    }
  },
  methods: {
    searchGroup() {
      if (!this.searchTerm) {
        this.groupList = this.groupCopy;
      }
      this.groupList = this.groupCopy.filter((grp) => {
        return grp.NAME.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
    },
    async fetchUser(userId) {
      let usr = []

      await this.callMethod(
          'user.get',
          {
            FILTER: {'ID': userId},
          }).then(function (res) {
        usr = res[0];
      });

      usr.icon = usr.PERSONAL_PHOTO;
      usr.id = usr.ID;
      usr.name = usr.LAST_NAME + ' ' + usr.NAME;
      return usr;

    },
    async fetchTimeData(tasks) {
      let timeRecords = [];
      await this.pageNavigationMethod(
          'task.elapseditem.getlist',
          [{'CREATED_DATE': 'desc'}, {
            "TASK_ID": tasks
          }, ['*'], {
            "NAV_PARAMS": {
              "nPageSize": 50,
              "iNumPage": 1
            }
          }]
      ).then(function (res) {
        timeRecords = res;
      });

      return timeRecords;
    },
    formatDate(arg) {
      let date = new Date(arg);
      let dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      let mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      let yy = date.getFullYear() % 100;
      if (yy < 10) yy = '0' + yy;
      return dd + '.' + mm + '.' + yy;
    },
    async collectData() {
      this.items = []
      this.$refs?.dialog?.save(this.dates)
      let result = [];

      let tasks = await this.fetchTasks();
      let time = []
      if (this.userOptions.allUsersLogs) {
         time = await this.fetchTimeData(tasks.map((el) => el.id))
      }


      for (const group of this.groupList.filter((gr) => this.selectedGroups.includes(gr.ID))) {
        result[group.ID] = {users: [], name: group.NAME};
        if (this.userOptions.allUsersLogs) {
          for (const t of time) {
            let curTask = tasks.find((tsk) => t.TASK_ID === tsk.id)
            if (curTask.groupId === group.ID) {
              let usr = tasks.find((tsk) => t.USER_ID === tsk.responsibleId)?.responsible;
              if (usr) result[group.ID].users[t.USER_ID] = usr;
              else {
                result[group.ID].users[t.USER_ID] = await this.fetchUser(t.USER_ID);
              }
            }
          }

          // Распределяем задачи по пользователям внутри проекта
          result[group.ID].users.forEach((user) => {
            tasks.forEach(tsk => {
              tsk.logs = time.filter((tm) => tm.TASK_ID === tsk.id && tm.USER_ID === user.id && tsk?.groupId === group.ID)
              if (tsk.logs.length) {
                if (user.tasks) {
                  user.tasks.push(JSON.parse(JSON.stringify(tsk)));
                } else user.tasks = [JSON.parse(JSON.stringify(tsk))];
              }
            });
          })
        } else {
          // // Формируем массив пользователей внутри проекта
          tasks.forEach((task) => {
            if (task.groupId === group.ID) result[group.ID].users[task.responsibleId] = task.responsible
          });
          // // Распределяем задачи по пользователям внутри проекта
          result[group.ID].users.forEach((user) => {
            user.tasks = tasks.filter((task) => (task.responsibleId === user.id && task.groupId === group.ID))
          })
        }

      }

      return (result)
    },
    async fetchGroups() {
      let groups = [];

      let startDate;
      let finishDate;
      if (this.dates.length === 1) {
        startDate = new Date(this.dates[0]);
        finishDate = new Date(this.dates[0]);
      } else {
        if (new Date(this.dates[0]) > new Date(this.dates[1])) {
          startDate = new Date(this.dates[1]);
          finishDate = new Date(this.dates[0]);
        } else {
          startDate = new Date(this.dates[0]);
          finishDate = new Date(this.dates[1]);
        }
      }
      startDate.setHours(0, 0, 0);
      finishDate.setHours(23, 59, 59);

      let filter = {
        // '>=DATE_CREATE': startDate.toISOString(),
        // '<=DATE_CREATE': finishDate.toISOString(),
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
    async fetchTasks() {
      let tasks = [];
      await this.callMethod(
          'tasks.task.list',
          {
            filter: {
              'GROUP_ID': this.selectedGroups,
            },
            select: ['*']
          }).then(function (res) {
         res.forEach(el=> {
           tasks = el['tasks']?tasks.concat(el['tasks']):tasks.concat(el)
         }) ;
      });
      return tasks;
    },
    calculateTime(result) {

      result.timeEstimate = 0;
      result.timeSpent = 0;
      result.amount = 0;


      result.forEach((group) => {
        group.timeEstimate = 0;
        group.timeSpent = 0;
        group.amount = 0;

        group.users.forEach((user) => {
          user.timeEstimate = 0;
          user.timeSpent = 0;
          user.amount = 0;
          user.tasks.forEach((task) => {
            if (Array.isArray(task)) task = task[0];
            let userId = task.responsibleId;
            user.timeEstimate += Number(task.timeEstimate);
            if (this.userOptions.allUsersLogs) {
              task.timeSpentInLogs = 0;
              task.logs.forEach((telm) => {
                userId = telm.USER_ID;
                task.timeSpentInLogs += (new Date(telm.DATE_STOP) - new Date(telm.DATE_START)) / 1000
              })
            }
            user.timeSpent += Number(task.timeSpentInLogs);
            let savedUser = this.users.find((usr) => userId === usr.id)
            if (savedUser && Number.isInteger(savedUser.hourRate)) {
              task.amount = Math.round((Number(task.timeSpentInLogs) / 60 / 60 * savedUser.hourRate) * 100) / 100
            } else {
              if (!this.usersWithoutHourRate.find((usr) => user.name === usr)) {
                this.usersWithoutHourRate.push(user.name)
              }
              task.amount = 0
            }
            user.amount += task.amount;
          })
          group.timeEstimate += Number(user.timeEstimate)
          group.timeSpent += Number(user.timeSpent);
          group.amount += user.amount;
        })
        result.timeEstimate += Number(group.timeEstimate)
        result.timeSpent += Number(group.timeSpent);
        result.amount += group.amount;
      })

      return result;
    },
    async createReport() {
      let data = await this.collectData();
      data = this.calculateTime(data);
      this.items = data;
    }
  },


  async created() {
    this.window = window;
    // eslint-disable-next-line no-undef
    if (BX24.userOption.get('options')) {
      // eslint-disable-next-line no-undef
      this.userOptions = JSON.parse(BX24.userOption.get('options'));
    }
    // eslint-disable-next-line no-undef
    if (BX24.appOption.get('users')) {
      // eslint-disable-next-line no-undef
      this.users = JSON.parse(BX24.appOption.get('users'));
    }

   this.groupList = await this.fetchGroups();
    this.groupCopy = [...this.groupList];
    // await this.createReport()


  }
}
</script>

<style scoped>

.table_project {
  background-color: #ddd6 !important;
}

.table_users {
  background-color: rgb(250, 250, 250) !important;
}

.table_tasks {

}


</style>
<style>

thead span {
  font-size: 14px !important;
}

.collapse thead {
  visibility: collapse !important;
}

</style>