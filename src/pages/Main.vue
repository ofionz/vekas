<template>
  <v-card elevation="2" class="mt-1 mx-1">
    <v-card v-if="usersWithoutHourRate.length" color="error"
            outlined
            class="mt-1 mb-1 text-center">
      <div  > Внимание! Расчет содержит ошибки! У сотрудника(ов): <b>{{ usersWithoutHourRate.join(", ")}} </b> не установлена ставка часа!  </div>
    </v-card>

    <v-data-table
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
        {{ item.amount }} руб.
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td style="padding: 0" :colspan="headers.length">
          <v-data-table
              expand-icon="mdi-menu-down"
              show-expand
              :expanded.sync="innerExpanded"
              item-key="name"
              :headers="userTableHeader"
              :items="item.users"
              :disable-pagination="true"
              :hide-default-footer="true"
              class="table_users"

          >
            <template v-slot:item.timeEstimate="{ item }">
              {{ item.timeEstimate|secondsToHoursAndMinutes }}
            </template>
            <template v-slot:item.timeSpent="{ item }">
              {{ item.timeSpent|secondsToHoursAndMinutes }}
            </template>
            <template v-slot:item.amount="{ item }">
              {{ item.amount }} руб.
            </template>
            <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" style="padding: 0">
          <v-data-table
              :headers="taskTableHeader"
              :items="item.tasks"
              :disable-pagination="true"
              :hide-default-footer="true"
              class="table_tasks"
          >


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
              {{ item.amount }} руб.
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
      expanded: [],
      innerExpanded: [],
      taskTableHeader: [
        {text: '', value: '',width: '140px', sortable: false},

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
        {text: '',  width: '90px', align: 'end', value: 'data-table-expand'},
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
        {  width: '15vw',text: 'Время план', value: 'timeEstimate'},
        {  width: '15vw',text: 'Времени потрачено', value: 'timeSpent'},

        {
          width: '15vw',
          text: 'Сумма',
          value: 'amount'
        },

      ],
      items: [],
      users: [],
      usersWithoutHourRate: []
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
    async collectData() {
      let result = [];
      let groups = await this.fetchGroups();
      let tasks = await this.fetchTasks(groups.map((el) => el.ID));
      groups.forEach((group) => {
        result[group.ID] = {users: [], name: group.NAME};
        // Формируем массив пользователей внутри проекта
        tasks.forEach((task) => {
          if (task.groupId === group.ID) result[group.ID].users[task.responsibleId] = task.responsible
        });
        // Распределяем задачи по пользователям внутри проекта
        result[group.ID].users.forEach((user) => {
          user.tasks = tasks.filter((task) => (task.responsibleId === user.id && task.groupId === group.ID))
        })
      })
      return (result)
    },
    async fetchGroups() {
      let groups = [];
      await this.callMethod(
          'sonet_group.get',
          {
            FILTER: {
              '>=DATE_CREATE': '2021-09-28T13:39:53+03:00',
              'CHECK_PERMISSIONS': 'N',
              'PROJECT': 'Y',
              "CLOSED": "N"
            },
          }).then(function (res) {
        groups = res;
      });
      return groups;
    },
    async fetchTasks(arId) {
      let tasks = [];


      await this.callMethod(
          'tasks.task.list',
          {
            FILTER: {
              'GROUP_ID ': arId,
            },
          }).then(function (res) {
        tasks = res [0]['tasks'];
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
            user.timeEstimate += Number(task.timeEstimate)
            user.timeSpent += Number(task.timeSpentInLogs);

            let savedUser = this.users.find((usr) => task.responsibleId === usr.id)
            if (savedUser && Number.isInteger(savedUser.hourRate)) {
              task.amount = Math.round((Number(task.timeSpentInLogs) / 60 / 60 * savedUser.hourRate) * 100) / 100
            } else {
              if (!this.usersWithoutHourRate.find((usr) => user.name===usr)) {
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
    }
  },
  async created() {
    // eslint-disable-next-line no-undef
    this.users = JSON.parse(BX24.appOption.get('users'));
    let data = await this.collectData();
    data = this.calculateTime(data);
    this.items = data;


  }
}


</script>

<style scoped>

.table_project {
  background-color: #ddd6 !important;
}

.table_users {
  background-color: rgb(250, 250, 250)  !important;
}

.table_tasks {

}


</style>
<style>
thead span{
  font-size: 14px !important;
}
/*.table_users thead {*/
/*  visibility: collapse !important;*/
/*}*/

</style>