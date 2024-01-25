<template>
  <v-card elevation="2" class="mt-4 mx-1 d-flex flex-column justify-center align-center">
    <manager-report-print-template v-if="needPrint" :data="reportData" :dates="dates" :user="currentUser"
                                   :group="currentGroup" style="display: none"
                                   id="toPrint">

    </manager-report-print-template>
    <div class="d-flex align-center justify-center">
      <v-btn v-if="currentUser&&dates&&reportData" @click="printDownload">
        <v-icon>mdi-printer-outline</v-icon>
      </v-btn>
      <v-autocomplete
          class="ml-10"
          @change="createReport"
          v-model="currentGroup"
          item-text="NAME"
          return-object
          :items="groups"
          label="Проект"
          prepend-icon="mdi-account-group"
      ></v-autocomplete>
      <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="dates"
          persistent
          width="290px"

      >
        <template v-slot:activator="{ on, attrs }">

          <v-text-field
              class="ml-5"
              style="min-width: 300px "
              v-model="dateRangeText"
              label="Выберите дату или диапазон отчёта"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
          ></v-text-field>

        </template>
        <v-date-picker
            v-model="dates"
            no-title
            range
            locale="ru"
        >
          <v-spacer></v-spacer>
          <v-btn
              text
              color="primary"
              @click="modal = false"
          >
            Отмена
          </v-btn>
          <v-btn
              text
              color="primary"
              @click="createReport"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>

      <v-autocomplete
          @change="createReport"
          v-model="currentUser"
          item-value="ID"
          :item-text="(el) =>el.NAME+' '+ el.LAST_NAME"
          return-object label="Выберите сотрудника"
          class="ml-5" :items="validUsers">

        <template v-slot:selection="data">
          <div class="d-flex flex-row align-center justify-center"><img
              style="width: 24px; margin-right: 8px; border-radius: 50%;"
              :src=" data.item.PERSONAL_PHOTO ? data.item.PERSONAL_PHOTO: `data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E`"
              alt="">
            <span>  {{
                data.item.NAME || data.item.LAST_NAME ? (data.item.NAME + ' ' + data.item.LAST_NAME) : data.item.EMAIL
              }}</span>
          </div>

        </template>

        <template v-slot:item="data">
          <template>
            <div class="d-flex flex-row align-center justify-center"><img
                style="width: 24px; margin-right: 8px;border-radius: 50%;"
                :src=" data.item.PERSONAL_PHOTO ? data.item.PERSONAL_PHOTO: `data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E`"
                alt="">
              <span>  {{
                  data.item.NAME || data.item.LAST_NAME ? (data.item.NAME + ' ' + data.item.LAST_NAME) : data.item.EMAIL
                }}</span>
            </div>
          </template>
        </template>


      </v-autocomplete>
    </div>

    <div v-for="(group, index) in reportData" :key="index" class="v-input">
      <v-card width="98%" class="ma-4">
        <v-card-title class="d-flex flex-column">
        <span>
          {{ group.date }}
        </span>
          <span class="date_subheader">
          {{ formatTime(group.minTime) }} - {{ formatTime(group.maxTime) }}
        </span>
          <span class="date_subheader">
           {{ secondsToHoursAndMinutes(group.seconds) }}
        </span>
        </v-card-title>

        <v-card-text class="d-flex flex-column justify-center align-center">


          <v-card class="d-flex flex-column mb-5 pa-4" :color="elem.pause?'#ff00001c':''" hover
                  :outlined="!(selected===elem.ID)" width="60%"
                  @click="openTask(elem)"
                  :ref="'row'+elem.ID" v-for="(elem, ind) in group.elements" :key="ind">

            <div class="tasks-wrap">
              <span class="mr-3 task-name">{{ (elem.task.title) }}</span>


              <span class="mr-3">  {{ formatTime(elem.CREATED_DATE) }} - {{ formatTime(elem.STOP_IN_LOGS) }} </span>
              <span>  {{
                  secondsToHoursAndMinutes(elem.SECONDS)
                }} </span>
              <div class="d-flex justify-center flex-column align-center"><span v-if="elem.pause" class="task-pause">ПРОСТОЙ</span>
              </div>
            </div>
            <div>
              <span v-if="elem.COMMENT_TEXT" class="task-comment"> Комментарий: {{ elem.COMMENT_TEXT }} </span>
            </div>

          </v-card>
          <Timeline @clicked="openTask" @hover="selectRow" :group="group"/>
        </v-card-text>

      </v-card>
    </div>

    <modal @needRefresh="createReport" v-if="modalState.show" :init-groups="groups" :state="modalState"></modal>

    <v-btn v-if="currentUser" fixed right bottom color="indigo" dark fab @click="addNewTask">
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>

  </v-card>
</template>

<script>
import Timeline from "../components/Timeline"
import Modal from "../components/Modal"
import ManagerReportPrintTemplate from "../components/ManagerReportPrintTemplate";

export default {
  name: "Managers",
  components: {
    ManagerReportPrintTemplate,
    Timeline,
    Modal
  },
  data() {
    return {
      dates: [(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
      modal: false,
      needPrint: false,
      currentUser: undefined,
      reportData: [],
      selected: '',
      validUsers: [],
      user: undefined,
      groups: [],
      currentGroup: undefined,
      modalState: {
        show: false,
        elem: undefined
      }
    }
  },
  async created() {
    // this.$on('userChanged', this.createReport)
    this.groups = await this.fetchGroups()
    this.validUsers = await this.getValidUsersToEdit();
    this.currentUser = this.user
    await this.createReport();


  },
  computed: {
    dateRangeText() {
      if (!this.dates.length) {
        return "Выберите дату"
      } else if (this.dates.length === 1) {
        return "Отчёт за " + this.formatDate(this.dates[0]);
      } else {
        if (this.dates[0] < this.dates[1])
          return "Период с " + this.formatDate(this.dates[0]) + " по " + this.formatDate(this.dates[1]);
        else return "Период с " + this.formatDate(this.dates[1]) + " по " + this.formatDate(this.dates[0]);
      }
    }
  },
  methods: {
    async printDownload() {
      this.needPrint = true;
      await setTimeout(() => {
        this.$htmlToPaper('toPrint')
        this.needPrint = false;
      }, 1000)

    },

    openTask(elem) {
      this.modalState.show = true;
      this.modalState.elem = elem;
      this.modalState.edit = true;
      this.modalState.title = "Редактировать запись";
    },

    selectRow(el) {
      if (el) this.selected = el.id;
      else this.selected = '';
    },

    async fetchTimeData() {
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
      let timeRecords = [];
      await this.pageNavigationMethod(
          'task.elapseditem.getlist',
          [{'CREATED_DATE': 'desc'}, {
            '>=CREATED_DATE': startDate.toISOString(),
            '<CREATED_DATE': finishDate.toISOString(),
            "USER_ID": this.currentUser.ID
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

    secondsToHoursAndMinutes(seconds) {
      seconds = Number(seconds);
      var h = Math.floor(seconds / 3600);
      var m = Math.floor(seconds % 3600 / 60);
      var s = Math.floor(seconds % 3600 % 60);

      var hDisplay = h > 0 ? h + ' ч. ' : "";
      var mDisplay = m > 0 ? m + " мин. " : "";
      var sDisplay = s > 0 ? s + " сек. " : "";
      if (!h && !m && !s) {
        return 0
      }
      return hDisplay + mDisplay + sDisplay;
    },

    async fetchTasks(timeRecords) {
      let needleTasks = {};
      if (timeRecords && timeRecords.length) {


        let filter = {
          'ID': timeRecords.map((el) => {
            return el.TASK_ID
          }),
        };

        if (this.currentGroup) {
          filter.GROUP_ID = this.currentGroup.ID;
        }
        await this.callMethod(
            'tasks.task.list',
            {
              filter: filter,
              select: [
                'ID',
                'TITLE'
              ]
            }).then(function (res) {

           res = res.map(el => el['tasks'] ? el['tasks'] : el).flat()
          res.forEach(el => needleTasks[el.id] = el);
        });
      }

      return needleTasks;

    },

    async createReport() {
      this.reportData = [];
      this.$refs.dialog.save(this.dates)


      if (this.dates && this.currentUser) {
        let timeRecords = await this.fetchTimeData();

        let tasks = await this.fetchTasks(timeRecords);

        timeRecords.forEach((elem) => {

          if (tasks[elem.TASK_ID]) {
            elem.task = tasks[elem.TASK_ID];
            let group = this.reportData.find(el => el.date === this.formatDate(elem.CREATED_DATE));
            elem.STOP_IN_LOGS = (new Date(new Date(elem.CREATED_DATE).getTime() + (1000 * elem.SECONDS)));
            if (elem.COMMENT_TEXT.includes("||PAUSE")) {
              elem.COMMENT_TEXT = elem.COMMENT_TEXT.replace('||PAUSE', '');
              elem.pause = true;
            } else elem.pause = false;


            if (!group) {
              this.reportData.push({
                date: this.formatDate(elem.CREATED_DATE),
                elements: [elem],
                minTime: (new Date(elem.CREATED_DATE)),
                maxTime: elem.STOP_IN_LOGS,
                seconds: elem.SECONDS
              })

            } else {
              if (new Date(elem.CREATED_DATE) < group.minTime) {
                group.minTime = new Date(elem.CREATED_DATE);
              }
              if (elem.STOP_IN_LOGS > group.maxTime) {
                group.maxTime = elem.STOP_IN_LOGS;
              }
              group.elements.push(elem);
              group.seconds = Number.parseInt(group.seconds) + Number.parseInt(elem.SECONDS);
            }
          }
        })


      }

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
    formatTime(arg) {
      let date = new Date(arg);
      // let dd = date.getDate();
      // if (dd < 10) dd = '0' + dd;
      // let mm = date.getMonth() + 1;
      // if (mm < 10) mm = '0' + mm;
      // let yy = date.getFullYear() % 100;
      // if (yy < 10) yy = '0' + yy;
      let hr = date.getHours() % 100;
      if (hr < 10) hr = '0' + hr;
      let min = date.getMinutes() % 100;
      if (min < 10) min = '0' + min;
      let sec = date.getSeconds() % 100;
      if (sec < 10) sec = '0' + sec;
      return hr + ':' + min + ':' + sec;
    },


    async getValidUsersToEdit() {
      let ctxt = this;
      let result = [];
      return new Promise(function (resolve) {
            if (window.isSuper) {
              ctxt.callMethod(
                  'user.get', {
                    FILTER: {ACTIVE: true}
                  }
              ).then(function (res) {
                resolve(res)
              });
            } else {
              ctxt.callMethod(
                  'user.current'
              ).then(function (res) {
                ctxt.user = res[0]
                ctxt.callMethod(
                    'department.get', {"UF_HEAD": res[0].ID}
                ).then(function (res2) {
                  ctxt.callMethod(
                      'user.get', {
                        FILTER: {
                          ACTIVE: true,
                          UF_DEPARTMENT: res2.map((dep) => dep.ID)
                        }
                      }
                  ).then(function (res3) {
                    result = result.concat(res3);
                    if (!result.find((el => res[0].ID === el.ID))) result = result.concat(res);
                    resolve(result)
                  })
                })
              });
            }
          }
      )
    },
    addNewTask() {
      this.modalState.edit = false;
      this.modalState.title = "Добавить запись";
      this.modalState.user = this.currentUser;
      this.modalState.show = true;
    },
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
  }
}
</script>

<style scoped>
.date_subheader {
  color: grey;
  font-size: 15px;
}

.tasks-wrap {
  min-width: 500px;
  display: grid;
  grid-template-columns: repeat(1, 20vw 150px 100px auto);
}

.task-name {
}

.task-comment {
  font-size: 12px;
  color: grey;
}

.task-pause {

  padding: 1px;
  border: 2px solid;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
}
</style>
