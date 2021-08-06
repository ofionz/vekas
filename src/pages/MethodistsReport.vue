<template>
  <div class="d-flex flex-column">

    <v-container fluid>
      <v-row>
        <v-col>
          <PersonSelector @selected="changed"/>
        </v-col>
        <v-col style="text-align: left">

          <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="dates"
              transition="scale-transition"
              offset-y
              min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="dateRangeText"
                  label="Отчетный период"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
                v-click-outside="onClickOutsideCalendar"
                range
                locale="ru"
                v-model="dates"
                no-title
            >
              <v-spacer></v-spacer>
              <v-btn
                  text
                  color="error"
                  @click="dates= []"
              >
                Сбросить
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>

      </v-row>
      <v-row>
        <v-col>
          <v-btn color="primary" v-if="dates.length" @click="create"> Сформировать отчет</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <div class="flex column">

      <div class="table-head grid">

        <span class="table-head__title flex">Ф.И.О. ответственного</span>
        <span class="table-head__title flex">Отчетная дата</span>
        <span class="table-head__title flex">Наименован иезаказчика</span>
        <span class="table-head__title flex">Сделка и задача</span>
        <span class="table-head__title flex">Тип сделки</span>
        <span class="table-head__title flex">Время на проект, ч.</span>
        <span class="table-head__title flex">Время за отчетную сдачу, ч.</span>

      </div>

    </div>
    <table class="table-line">

      <tr v-for="(row, indexPerson) in table" :key="indexPerson" class="table-line__row">
        <td class="table-line__name">{{ row.name }}</td>
        <td class="main-table__wrap">
          <table class="main-table">

            <tr class="main-table__date-wrap" :key="indexDate" v-for="(dateElem, indexDate) in row.dates">
              <td class="main-table__date">{{ dateElem.date }}</td>
              <td>
                <table>
                  <tr v-for="(elem, indexElem) in dateElem.elements" :key="indexElem">
                    <td class="main-table__company">{{ elem.company }}</td>
                    <td class="main-table__task">{{ elem.task }}</td>
                    <td class="main-table__type">{{ elem.type }}</td>
                    <td class="main-table__time">{{ elem.time }}</td>
                  </tr>
                </table>
              </td>
              <td class="main-table__date-result">{{ dateElem.date_result }}</td>
            </tr>

            <tr class="result">
              <td class="main-table__sum">Итого за период</td>
              <td colspan="6" class="main-table__result">
                <div class="main-table__summary"><span v-for="(sum, indexSumm) in row.summary" :key="indexSumm">{{
                    sum
                  }}</span></div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>


  </div>
</template>

<script>
import PersonSelector from '../components/personSelector.vue'
import vClickOutside from 'v-click-outside'

export default {
  name: "MethodistsReport",
  components: {
    PersonSelector,
  },
  directives: {
    clickOutside: vClickOutside.directive
  },


  data() {
    return {
      menu: false,
      table: [
        {
          name: "Петров А.И.",
          dates: [
            {
              date: '12.05.21',
              date_result: '9',
              elements: [
                {
                  company: 'ООО СЕВЕРСЕВЕРСЕВЕ РСЕВЕРСЕВЕР',
                  task: '1123331',
                  type: 'АТЭЛ, АТОТ, ВАТЭЛ, АТОТВ',
                  time: '1.5'
                },
                {company: 'ООО СЕВЕР222', task: '1123', type: 'ADOF', time: '1.5'},
                {company: 'ООО СЕВЕР333', task: '11231', type: 'ADOF', time: '1.5'},
                {company: 'ООО СЕВЕР444', task: '131', type: 'ADOF', time: '1.5'}
              ]
            },

            {
              date: '16.05.21',
              date_result: '4',
              elements: [
                {company: 'ООО СЕ234ВЕР', task: '11232331', type: 'ADOF', time: '1.5'},
                {company: 'ООО СЕВЕР223422', task: '1123', type: 'ADOF', time: '1.5'},
              ]
            },
            {
              date: '18.05.21',
              date_result: '4',
              elements: [
                {company: 'ООО СЕ234ВЕР', task: '11232331', type: 'ADOF', time: '1.5'},
                {company: 'ООО СЕВЕР223422', task: '1123', type: 'ADOF', time: '1.5'},
              ]
            },

          ],
          summary: ["Количество поставленных задач: 8 (в работе : 1) ",
            "Норма времени за период (план): 32 ч. ",
            "Затраченное время (факт): 34 ч. ",
            "Время отставания от плана: 2 ч. ( или  значение «нет») ",]
        },


      ],

      dates: [],
      allUsers: [],
      selectedUsers: [],
    }
  },
  computed: {
    dateRangeText() {
      if (!this.dates.length) {
        return "Выберите дату"
      } else if (this.dates.length === 1) {
        return "Отчет за " + this.dates[0];
      } else {
        return "Период с " + this.dates[0] + " по " + this.dates[1];
      }
    }
  },
  methods: {
    getUserName(id) {
      return this.allUsers.find((user) => user.value == id).text;
    },

    onClickOutsideCalendar() {
      this.$refs.menu.save(this.dates);
    },

    async fetchTimeData() {
      let allTimes;
      await this.callMethod(
          'task.elapseditem.getlist',
          [{'ID': 'desc'}, {'>=CREATED_DATE': '2021-01-01', '<CREATED_DATE': '2021-09-01', "USER_ID": "493"}]
      ).then(function (res) {
        allTimes = res;
      });

      return allTimes;
    },

    async fetchTasks(allTimes) {
      let needleTasks;
      await this.callMethod(
          'tasks.task.list',
          {
            filter: {
              'ID': allTimes.map((el) => {
                return el.TASK_ID
              }),
              'TITLE': 'Производство документов_%',
            },
            select: [
              'ID',
              'ID',
              'UF_CRM_TASK'
            ]
          }).then(function (res) {
        needleTasks = res[0]['tasks'];
      });
      needleTasks.forEach((tsk) => {
            if (tsk.ufCrmTask) {
              tsk.dealId = tsk.ufCrmTask.find((crmId) => {
                return crmId.substr(0, 2) === 'D_';
              }).substr(2);
            }
          }
      )
      return needleTasks;

    },

    filterDealIds(allTimes, needleTasks) {
      let dealIDs = [];
      allTimes.forEach((el) => {
        let task = needleTasks.find((tsk) => tsk.id === el.TASK_ID);
        if (task && task.ufCrmTask) {
          task.dealId = task.ufCrmTask.find((crmId) => {
            return crmId.substr(0, 2) === 'D_';
          }).substr(2);
          dealIDs.push(task.dealId);
        }
      })

      return dealIDs
    },

    sumSpentTime(allTimes, needleTasks, deals) {
      let res = [];
      allTimes.forEach((el) => {
        let date = new Date(el.CREATED_DATE);
        date = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
        let task = needleTasks.find((tsk) => tsk.id === el.TASK_ID);
        let deal;
        if (task) deal = deals.find((dl) => dl.ID === task.dealId);
        let curDateData = res.find((el) => el.date === date);

        if (!curDateData) {
          let rows = [];
          rows.push({task,deal});
          res.push({date: date, rows: rows, spentTime: parseInt(el.SECONDS)});
        } else {
          if (!curDateData.rows.find((el) => el.id === task.id)) {
            curDateData.rows.push({task,deal});
          }
          curDateData.spentTime += parseInt(el.SECONDS);
        }
      })
      console.log(res)
      return res;

    },

    async fetchDeals(dealIDs, prop) {
      let deals;
      await this.callMethod(
          'crm.deal.list',
          {
            filter: {"ID": dealIDs},
            select: ["ID", "UF_CRM_1592480078", "COMPANY_ID", 'UF_CRM_1628254497']
          }).then(function (res) {
        deals = res;
      });

      for (const item of deals) {
        item.type = [];
        item.UF_CRM_1592480078.forEach((element) => item.type.push(prop.LIST.find((el) => el.ID == element).VALUE))
        await this.callMethod("crm.company.get",
            {id: item.COMPANY_ID},).then(function (res) {
          item.companyName = res[0]['TITLE'];
        });
      }
      return deals;
    },

    async fetchPropType() {
      let prop;
      await this.callMethod('crm.deal.userfield.list',
          {
            filter: {"FIELD_NAME": "UF_CRM_1592480078"}
          }).then(function (res) {
        prop = res[0];
      });
      return prop;
    },

    async create() {
      let prop = await this.fetchPropType();

      let timeData = await this.fetchTimeData();
      let tasks = await this.fetchTasks(timeData);
      let deals = await this.fetchDeals(this.filterDealIds(timeData, tasks), prop)

      this.sumSpentTime(timeData, tasks, deals);




      // console.log(result)


    },
    changed(el) {
      this.selectedUsers = el.selected;
      this.allUsers = el.all;
    }
  }
}
</script>

<style scoped>
.flex {
  display: flex;
}

.grid {
  display: grid;
}

.table-head {
  grid-template-columns: 156px 99px 333px 302px 98px 100px 100px;
  align-items: center;
  gap: 2px;
}

.table-head__title, .table-line {
  font-size: 15px;
  color: #5e5e5e;
  font-weight: bold;
}


.table-head__title {
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: #99c7ef;
}


.column {
  flex-direction: column;
}

.table-line, .main-table__wrap, .main-table, .main-table tr table {
  width: 100%;
}

.table-line {
  font-size: 15px;
  color: #5e5e5e;
  font-weight: bold;
  width: 1200px;
}

.table-line__row {
  display: flex;
}

.table-line__row:not(:last-child) {
  margin-bottom: 20px;
}

.table-line__name {
  width: 15%;
  background: #fffcf0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-line__name, .main-table {
  box-shadow: 0px 0 3px #bfbbbb;
}

.main-table, .main-table tr table {
  border-collapse: collapse;
}

.main-table tr td table tr td, .main-table__date, .main-table__sum, .main-table__date-result, .main-table__result {
  padding: 15px;
}

.main-table tr td table tr td, .main-table__date, .main-table__sum, .main-table__date-result, .main-table__result {
  box-shadow: 0px 0 3px #bfbbbb;
}

.main-table__date, .main-table__date-result {
  width: 100px;
}

.main-table__date-wrap:not(:last-child) {
  border-bottom: 2px solid gray;
}


.main-table tr td:nth-child(odd) {
  background: aliceblue;
}

.main-table__date, .main-table__task, .main-table__time {
  background: #edfee1 !important
}

.main-table__sum {
  background: #fff !important;
}

.main-table tr td table tr {
  display: grid;
  grid-template-columns: 40% 1fr  100px  100px;
}

.main-table__summary {
  display: flex;
  gap: 5px;
  font-size: 12px;
  text-align: center;
}

.main-table__company {
  font-size: 13px;
}

.main-table__result {
  text-align: left;
}

</style>