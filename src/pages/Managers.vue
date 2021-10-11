<template>
  <v-card elevation="2" class="mt-4 mx-1 d-flex flex-column justify-center align-center">

    <div class="d-flex align-center justify-center">
      <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="dates"
          persistent
          width="290px"
      >
        <template v-slot:activator="{ on, attrs }">

          <v-text-field
              style="min-width: 300px "
              v-model="dateRangeText"
              label="Выберите дату или диапазон отчета"
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

      <v-btn
          class="ml-10"
          :color="currentUser?'' :'submit'"
          @click="addUser"
      >
        {{ currentUser ? 'Сменить сотрудника' : 'Выбрать сотурдника' }}

      </v-btn>
      <div v-if="currentUser" class="ml-10 d-flex">
        <v-avatar size="40">
          <img
              :src="
                currentUser.photo
                  ? currentUser.photo
                  : 'data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E'
              "
              :alt="currentUser.name"
          /></v-avatar>
        <v-subheader style="width: 30%"> {{ currentUser.name }}</v-subheader>
      </div>
    </div>


    <div v-for="(group, index) in reportData" :key="index" class="v-input">
      <v-card class="ma-4">
        <v-card-title class="d-flex flex-column">
        <span>
          {{ group.date }}
        </span>
          <span>
           {{ secondsToHoursAndMinutes(group.seconds) }}
        </span>
        </v-card-title>

        <v-card-text class="d-flex flex-column">
          <div v-for="(elem, ind) in group.elements" :key="ind">
<!--            <a class="mr-3"-->
<!--                target="_blank"-->
<!--                :href="'https://coko1.bitrix24.ru/company/personal/user/1/tasks/task/view/'+elem.task.id+'/'"> <span >{{ (elem.task.title) }}</span>-->
<!--            </a>-->
            <span class="mr-3">{{ (elem.task.title) }}</span>

            <span class="mr-3">  {{ formatTime(elem.DATE_START) }} - {{ formatTime(elem.DATE_STOP) }} </span>
            <span>  {{ secondsToHoursAndMinutes((new Date(elem.DATE_STOP) - new Date(elem.DATE_START)) / 1000) }} </span>

          </div>
          <Timeline :group = "group"/>
        </v-card-text>

      </v-card>
    </div>


  </v-card>
</template>

<script>
import Timeline from "../components/Timeline"

export default {
  name: "Managers",
  components: {
    Timeline
  },
  data() {
    return {
      dates: [(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
      modal: false,
      currentUser: undefined,
      reportData: []
    }
  },
  created() {
    this.$on('userChanged', this.createReport)
  },
  computed: {
    dateRangeText() {
      if (!this.dates.length) {
        return "Выберите дату"
      } else if (this.dates.length === 1) {
        return "Отчет за " + this.formatDate(this.dates[0]);
      } else {
        if (this.dates[0] < this.dates[1])
          return "Период с " + this.formatDate(this.dates[0]) + " по " + this.formatDate(this.dates[1]);
        else return "Период с " + this.formatDate(this.dates[1]) + " по " + this.formatDate(this.dates[0]);
      }
    }
  },
  methods: {
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
            "USER_ID": this.currentUser.id
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
      console.log(seconds)
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
      await this.callMethod(
          'tasks.task.list',
          {
            filter: {
              'ID': timeRecords.map((el) => {
                return el.TASK_ID
              }),
            },
            select: [
              'ID',
              'TITLE'
            ]
          }).then(function (res) {
        res[0]['tasks'].forEach(el => needleTasks[el.id] = el);
      });


      return needleTasks;

    },

    async createReport() {
      this.$refs.dialog.save(this.dates)
      if (this.dates && this.currentUser) {
        let timeRecords = await this.fetchTimeData();
        let tasks = await this.fetchTasks(timeRecords);

        timeRecords.forEach((elem) => {
          elem.task = tasks[elem.TASK_ID];
          let group = this.reportData.find(el => el.date === this.formatDate(elem.DATE_START));
          if (!group) {
            this.reportData.push({
              date: this.formatDate(elem.DATE_START),
              elements: [elem],
              minTime: (new Date(elem.DATE_START)),
              maxTime: (new Date(elem.DATE_STOP)),
              seconds: ((new Date(elem.DATE_STOP) - new Date(elem.DATE_START)) / 1000)
            })
          } else {
            if (new Date(elem.DATE_START) < group.minTime) {
              group.minTime = new Date(elem.DATE_START);
            }
            if (new Date(elem.DATE_STOP) > group.maxTime) {
              group.maxTime = new Date(elem.DATE_STOP);
            }
            group.elements.push(elem);
            group.seconds = group.seconds + ((new Date(elem.DATE_STOP) - new Date(elem.DATE_START)) / 1000);
          }
        })
        console.log(this.reportData)
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

    addUser() {
      // eslint-disable-next-line no-undef
      BX24.selectUser((newUser) => {
        this.currentUser = newUser;
        this.$emit('userChanged')
      });
    },
  }
}
</script>

<style scoped>

</style>