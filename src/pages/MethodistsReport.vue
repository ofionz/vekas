<template>
  <div class="d-flex flex-column">

    <v-container fluid class="flex">
      <v-row class="a-i-e w-80">
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
        <v-col>
          <PersonSelector @selected="changed"/>
        </v-col>


      </v-row>
      <v-row class="w-20 a-i-c">
        <v-col style="text-align: center">
          <v-btn color="primary" v-if="dates.length" @click="create"> Сформировать отчет</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <div class="flex column" v-if="table.length">

      <div class="table-head grid">

        <span class="table-head__title flex">Ф.И.О. ответственного</span>
        <span class="table-head__title flex">Отчетная дата</span>
        <span class="table-head__title flex">Наименование заказчика</span>
        <span class="table-head__title flex">Сделка и задача</span>
        <span class="table-head__title flex">Тип сделки</span>
        <span class="table-head__title flex">Время на проект, ч.</span>
        <span class="table-head__title flex">Время за отчетную дату, ч.</span>

      </div>

    </div>
    <table class="table-line">

      <tr v-for="(row, indexPerson) in table" :key="indexPerson" class="table-line__row">
        <td class="table-line__name"><a target="_blank"
                                        :href="'https://coko1.bitrix24.ru/company/personal/user/'+row.userId+'/'">{{
            row.name
          }}</a></td>
        <td class="main-table__wrap">
          <div v-if="row.message" class="main-table__error">
          <span>
            {{ row.message }}
          </span>
          </div>
          <table v-else class="main-table">

            <tr class="main-table__date-wrap" :key="indexDate" v-for="(dateElem, indexDate) in row.dates.elements">
              <td class="main-table__date">{{ dateElem.date }}</td>
              <td>
                <table>
                  <tr v-for="(elem, indexElem) in dateElem.rows" :key="indexElem">
                    <td class="main-table__company"><a
                        target="_blank"
                        :href="'https://coko1.bitrix24.ru/crm/company/details/'+elem.companyId+'/'">{{
                        elem.company
                      }}</a>
                    </td>
                    <td class="main-table__task"><a
                        target="_blank"
                        :href="'https://coko1.bitrix24.ru/company/personal/user/515/tasks/task/view/'+elem.taskId+'/'">Задача
                      №{{ elem.taskId }}</a>
                      <br/>
                      <a
                          target="_blank"
                          :href="'https://coko1.bitrix24.ru/crm/deal/details/'+elem.dealId+'/'">Сделка
                        №{{ +elem.dealId }}</a>
                    </td>
                    <td class="main-table__type"><span v-for="(type, indexType) in elem.types"
                                                       :key="indexType">{{
                        (indexType !== 0 ? ", " : ' ') + type
                      }}</span></td>
                    <td class="main-table__time">
                      <span :data-tooltip="secondsToHoursAndMinutes(elem.planTime*60*60)" v-if="elem.planTime">
                        План: {{ elem.planTime }}
                    </span>
                      <span data-tooltip="Укажите план часы в сделке - в поле 'Время на проект, ч' (UF_CRM_1628254497)"
                            v-else>
                        План не задан.
                      </span>
                      <br/>
                      <span :data-tooltip="secondsToHoursAndMinutes(elem.time)"
                            v-bind:class="[secondsToHours(elem.time)>elem.planTime  ? 'errorClass' : '']">Факт: {{
                          secondsToHours(elem.time)
                        }} ч. <br/> <i v-if="elem.isTaskOpen">(в работе)</i> </span>
                    </td>
                  </tr>
                </table>
              <td class="main-table__date-result">
                <span :data-tooltip="secondsToHoursAndMinutes(dateElem.summaryPlanTime*60*60)">План: {{
                    dateElem.summaryPlanTime
                  }}</span>
                <br/>
                <span
                    v-bind:class="[secondsToHours(dateElem.summaryTime)>dateElem.summaryPlanTime  ? 'errorClass' : '']"
                    :data-tooltip="secondsToHoursAndMinutes(dateElem.summaryTime)">Факт: {{
                    secondsToHours(dateElem.summaryTime)
                  }}</span>

              </td>
            </tr>
            <tr class="result">
              <td class="main-table__sum">Итого за период</td>
              <td colspan="6" class="main-table__result">
                <div class="main-table__summary">
                  <p>
                    Количество поставленных задач: <br/> <b>{{ row.dates.summary.taskCount }} </b>
                    (в работе :<b>
                    {{ row.dates.summary.openTaskCount }} </b>)
                  </p>
                  <p :data-tooltip="secondsToHoursAndMinutes( row.dates.summary.summaryPlanTime*60*60)">
                    Норма времени за период (план): <br/> <b>{{ row.dates.summary.summaryPlanTime }} ч. </b>
                  </p>
                  <p :data-tooltip="secondsToHoursAndMinutes(row.dates.summary.summaryTime )">
                    Затраченное время (факт): <br/> <b>{{
                      secondsToHours(row.dates.summary.summaryTime)
                    }} ч. </b>
                  </p>
                  <p :data-tooltip="secondsToHoursAndMinutes(row.dates.summary.behindPlan )">
                    Время отставания от плана:
                    <br/>
                    <b v-if="row.dates.summary.behindPlan>0">{{
                        secondsToHours(row.dates.summary.behindPlan)
                      }}
                      ч.</b>
                    <b v-else> нет </b>
                  </p>

                </div>
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
      table: [],

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
        return "Отчет за " + this.formatDate(this.dates[0]);
      } else {
        return "Период с " + this.formatDate(this.dates[0]) + " по " + this.formatDate(this.dates[1]);
      }
    }
  },
  methods: {
    secondsToHours(seconds) {
      return Math.floor(seconds / 60 / 60 * 100) / 100
    },
    secondsToHoursAndMinutes(seconds) {

      seconds = Number(seconds);
      var h = Math.floor(seconds / 3600);
      var m = Math.floor(seconds % 3600 / 60);
      var s = Math.floor(seconds % 3600 % 60);

      var hDisplay = h > 0 ? h + 'ч. ' : "";
      var mDisplay = m > 0 ? m + "мин. " : "";
      var sDisplay = s > 0 ? s + "сек. " : "";
      if (!h && !m && !s) {
        return 0
      }
      return hDisplay + mDisplay + sDisplay;
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
    getUserName(id) {
      return this.allUsers.find((user) => user.value == id).text;
    },

    onClickOutsideCalendar() {
      this.$refs.menu.save(this.dates);
    },

    async fetchTimeData(userId) {
      let startDate;
      let finishDate;
      if (this.dates.length === 1) {
        startDate = new Date(this.dates[0]);
        finishDate = new Date(this.dates[0]);
      } else {
        if (new Date(this.dates[0])>new Date(this.dates[1])) {
          startDate = new Date(this.dates[1]);
          finishDate = new Date(this.dates[0]);
        }
       else {
          startDate = new Date(this.dates[0]);
          finishDate = new Date(this.dates[1]);
        }
      }
      startDate.setHours(0, 0, 0);
      finishDate.setHours(23, 59, 59);
      let timeRecords = [];
      await this.callMethod(
          'task.elapseditem.getlist',
          [{'ID': 'desc'}, {'>=CREATED_DATE': startDate.toISOString(), '<CREATED_DATE': finishDate.toISOString(), "USER_ID": userId}]
      ).then(function (res) {
        timeRecords = res;
      });


      return timeRecords;
    },

    async fetchTasks(timeRecords) {
      let needleTasks;
      await this.callMethod(
          'tasks.task.list',
          {
            filter: {
              'ID': timeRecords.map((el) => {
                return el.TASK_ID
              }),
              'TITLE': 'Производство документов_%',
            },
            select: [
              'ID',
              'STATUS',
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

    filterDealIds(timeRecords, needleTasks) {
      let dealIDs = [];
      timeRecords.forEach((el) => {
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

    sumSpentTime(timeRecords, needleTasks, deals) {
      let res = [];
      let summary = {
        summaryTime: 0,
        taskCount: 0,
        openTaskCount: 0,
        summaryPlanTime: 0,
        behindPlan: 0,
        summaryRecordedTasks: [],
      };
      timeRecords.forEach((timeRecord) => {
        let date = this.formatDate(timeRecord.CREATED_DATE);

        let task = needleTasks.find((tsk) => tsk.id === timeRecord.TASK_ID);
        let deal;
        if (task) {
          deal = deals.find((dl) => dl.ID === task.dealId);
          let curDateData = res.find((dta) => dta.date === date);
          if (!curDateData) {
            let rows = [];
            rows.push({
              taskId: task.id,
              isTaskOpen: task.status != 5,
              time: parseInt(timeRecord.SECONDS),
              companyId: deal.COMPANY_ID,
              company: deal.companyName,
              dealId: deal.ID,
              types: deal.type,
              planTime: deal.UF_CRM_1628254497,
            });


            let recordedDeals = [];
            recordedDeals.push(deal.ID)

            res.push({
              date: date,
              rows: rows,
              summaryTime: parseInt(timeRecord.SECONDS),
              recordedDeals: recordedDeals,
              summaryPlanTime: deal.UF_CRM_1628254497 ? parseInt(deal.UF_CRM_1628254497) : 0
            });

          } else {
            let innerRow = curDateData.rows.find((ele) => ele.taskId === task.id)
            if (!innerRow) {
              curDateData.rows.push({
                taskId: task.id,
                isTaskOpen: task.status != 5,
                time: parseInt(timeRecord.SECONDS),
                companyId: deal.COMPANY_ID,
                company: deal.companyName,
                dealId: deal.ID,
                types: deal.type,
                planTime: deal.UF_CRM_1628254497,
              });
            } else {
              innerRow.time += parseInt(timeRecord.SECONDS);
            }
            if (curDateData.recordedDeals.indexOf(deal.ID) === -1) {
              curDateData.summaryPlanTime += deal.UF_CRM_1628254497 ? parseInt(deal.UF_CRM_1628254497) : 0;
              curDateData.recordedDeals.push(deal.ID);
            }
            curDateData.summaryTime += parseInt(timeRecord.SECONDS);
          }


          summary.summaryTime += parseInt(timeRecord.SECONDS);

          if (summary.summaryRecordedTasks.indexOf(task.id) === -1) {
            if (task.status != 5) summary.openTaskCount++;
            summary.taskCount++;
            summary.summaryPlanTime += deal.UF_CRM_1628254497 ? parseInt(deal.UF_CRM_1628254497) : 0;
            summary.summaryRecordedTasks.push(task.id);
          }
        }
      })


      summary.behindPlan = (summary.summaryPlanTime * 60 * 60 - summary.summaryTime) * -1;

      return {elements: res, summary: summary};

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
      this.table = [];
      let prop = await this.fetchPropType();

      let users = this.selectedUsers.length ? this.selectedUsers : this.allUsers.map((usr) => usr.value);
      for (let userId of users) {

        let timeData = await this.fetchTimeData(userId);

        if (timeData.length) {
          let tasks = await this.fetchTasks(timeData);
          let deals = await this.fetchDeals(this.filterDealIds(timeData, tasks), prop);
          let data = this.sumSpentTime(timeData, tasks, deals);
          if (data) {
            this.table.push({name: this.getUserName(userId), userId: userId, dates: data});
          }
        } else {
          this.table.push({name: this.getUserName(userId), userId: userId, message: 'Данные за период отсутствуют'});
        }
      }
    },
    changed(el) {
      this.selectedUsers = el.selected;
      this.allUsers = el.all;
    }
  }
}
</script>

<style scoped>
b {
  font-size: 16px;
}

.w-80 {
  width: 80%;
}

.w-20 {
  width: 20%;
}

.flex {
  display: flex;
}

.a-i-e {
  align-items: end;
}

.a-i-c {
  align-items: center;
}

.grid {
  display: grid;
}

.table-head {
  grid-template-columns: 156px 117px 320px 158px 148px 167px 121px;
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
  width: 120px;
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
  grid-template-columns: 40% 1fr  150px  170px;
}

.main-table__summary {
  display: flex;
  gap: 45px;
  font-size: 12px;
  text-align: center;
}

.main-table__company {
  font-size: 13px;
}

.main-table__result {
  text-align: left;
}

.errorClass {
  color: #c90000;
}

[data-tooltip] {
  position: relative;
}

[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  width: 300px;
  left: 0;
  top: 0;
  background: #3989c9;
  color: #fff;
  padding: 0.5em;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  opacity: 0;
  transition: 1s;
}

[data-tooltip]:hover::after {
  opacity: 1;
  top: 2em;
}

.main-table__error {
  text-align: center;
  margin: 30px;
}
</style>