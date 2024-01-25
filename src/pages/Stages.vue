<template>
  <div>
    <v-card elevation="2" class="mt-1 mx-1">
      <v-card class="mt-2 mb-3 pa-4 text-center">
        <div class="d-flex align-center justify-center">
          <v-autocomplete
              @change="changeLeadersHandler"
              v-model="selectedLeaders"
              multiple
              clearable
              style="width: 25%"
              item-value="ID"
              :item-text="(el) =>el.NAME+' '+ el.LAST_NAME"
              return-object label="Выберите руководителя проекта"
              class="ml-5" :items="leadersList">
            <template v-slot:selection="data">
              <div class="d-flex flex-row align-center justify-center ml-3"><img
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

          <v-autocomplete style="width: 25%" v-model="selectedGroups" @change="changeGroupHandler" class="ml-5"
                          item-value="ID" item-text="NAME" :items="groupList" clearable
                          label="Проекты" multiple></v-autocomplete>
          <v-autocomplete style="width: 25%" v-model="selectedStages" class="ml-5" @change="changeStageHandler"
                          :items="stagesList" clearable
                          label="Стадии" multiple>
          </v-autocomplete>

          <v-checkbox class="ml-5" v-model="expired" @change="expiredHandler" label="Просроченные стадии"></v-checkbox>
          <!--          <v-btn class="ml-6" color="submit" @click="createReport"> Сформировать отчет</v-btn>-->
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
          item-key="ID"
          class="table_project"

      >
        <template class="" v-slot:item.name="{ item }">
          {{ item.NAME + ' ' + item.LAST_NAME }}
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td style="padding: 0" :colspan="headers.length">
            <v-data-table
                locale="RU"
                expand-icon="mdi-menu-down"
                show-expand
                :expanded.sync="innerExpanded"

                item-key="ID"
                :headers="projectTableHeader"
                :items="item.projects"
                :disable-pagination="true"
                :hide-default-footer="true"


            >
              <template class="" v-slot:item.name="{ item }">
                {{ item.NAME }}
              </template>

              <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" style="padding: 0">
            <v-data-table
                @click:row="showCommentsModal"
                locale="RU"
                :headers="stageTableHeader"
                :items="item.stages"
                :disable-pagination="true"
                :hide-default-footer="true"
                :item-class="getRowStageColor"
            >


              <template v-slot:item.deadline="{ item }">
                {{ item.deadline ? moment(item.deadline).format("DD.MM.YYYY HH:mm:ss") : "Не установлен" }}
              </template>
              <template v-slot:item.isCompleted="{ item }">
                {{ item.status === '5' ? 'Да' : 'Нет' }}
              </template>
              <template v-slot:item.isExpired="{ item }">
                {{
                  getRowStageColor(item) === 'closed-not-time' || getRowStageColor(item) === 'expired' ? 'Да' : 'Нет'
                }}
              </template>


            </v-data-table>
          </td>
        </template>
      </v-data-table>
      </td>
</template>
</v-data-table>

</v-card>
<v-dialog width="600px" v-model="modal">
<v-card>
  <v-card-title>
    Комментарии
  </v-card-title>
  <v-card-text>
    <v-list v-if="comments.length" three-line>
      <template v-for="(item, index) in comments">
        <v-divider :key="index"></v-divider>
        <v-list-item :key="'item' + index">

          <v-list-item-avatar>
            <v-img
                :src="
                                item.PHOTO
                                  ? item.PHOTO
                                  : 'data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E'
                              "
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
            >{{ item.AUTHOR_NAME }}
              <span style="  color: grey;  font-size: 12px;  margin-left: 10px;">{{
                  moment(item.POST_DATE).format("DD.MM.YYYY HH:mm:ss")
                }}</span>
            </v-list-item-title>
            <!--            <v-list-item-content v-text="item.POST_MESSAGE">-->

            <!--            </v-list-item-content>-->
            <v-list-item-subtitle style="-webkit-line-clamp: initial;"
                                  v-text="item.POST_MESSAGE"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

    <span v-else> Комментарии отсутствуют </span>
  </v-card-text>


</v-card>
</v-dialog>
</div>

</template>

<script>
export default {
  name: "Main",
  data: () => {
    return {
      userOptions: {
        showHeaders: true,
      },
      expired: false,
      allItems: [],
      allTasks: [],
      selectedStages: [],
      stagesList: [],
      modal: false,
      comments: [],
      expanded: [],
      innerExpanded: [],
      stageTableHeader: [
        {text: '', value: '', width: '140px', sortable: false},
        {
          text: 'Наименование стадии',
          value: 'title'
        },
        {
          text: 'Крайний срок',
          value: 'deadline'
        },
        {
          text: 'Завершена',
          value: 'isCompleted',
          sortable: false
        },
        {
          text: 'Просрочена',
          value: 'isExpired',
          sortable: false
        },

      ],
      projectTableHeader: [
        {text: '', width: '90px', align: 'end', value: 'data-table-expand'},
        {
          text: 'Проект',
          value: 'name'
        },


      ],
      headers: [
        {text: '', value: 'data-table-expand'},
        {
          text: 'Руководитель проекта',
          align: 'start',
          sortable: false,
          value: 'name',
        },

      ],
      items: [],
      users: [],
      groupList: [],
      leadersList: [],
      searchTerm: "",
      selectedLeaders: [],
      selectedGroups: [],
      allGroups: []
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
    async showCommentsModal(item) {
      let comments = [];
      let notNeedleComments = [
        'Задача возвращена в работу.',
        'Задача завершена.',
        'Задача просрочена',
        'Задача почти просрочена.',
        'Проект задачи изменен на:',
        'Крайний срок изменен на',
        'Завершите задачу или передвиньте срок.',
        'задача возвращена в работу.',
        'Изменен крайний срок:',
        'задача почти просрочена',
        'назначены ответственным.',
        'Задача потребует контроля постановщика после',
        'Необходимо указать крайний срок,',
        'вы добавлены наблюдателем.',
          "вы назначены соисполнителем.",
          "вы назначены постановщиком."
      ]

      await this.callMethod(
          'task.commentitem.get',
          [11668,124038]).then(function (res) {
        console.log(res)
      });
      await this.callMethod(
          'task.commentitem.getlist',
          [11668, {'ID': 'desc'}]).then(function (res) {
        console.log(res)
      });


      await this.callMethod(
          'task.commentitem.getlist',
          [item.id, {'ID': 'desc'}]).then(function (res) {
        comments = res;
      });

      comments = comments.filter((comment) => {
            return !notNeedleComments.find((notNedl) => comment.POST_MESSAGE.includes(notNedl));
          }
      )

      if (comments.length) {
        await this.callMethod(
            'user.get',
            {
              FILTER: {CHECK_PERMISSIONS: 'N', 'ID': Array.from(new Set(comments.map((el) => el.AUTHOR_ID)))},
            }).then(function (res) {
          comments.forEach((comm) => comm.PHOTO = res.find((usr) => comm.AUTHOR_ID === usr.ID).PERSONAL_PHOTO)
        });
      }
      this.comments = comments;
      this.modal = true

    },

    getRowStageColor(item) {
      let deadline = new Date(item.deadline);
      let today = new Date();
      let closed = item.closedDate ? new Date(item.closedDate) : null;
      if (!closed && deadline < today && item.type === 'stage') {
        return 'expired'
      } else if (closed && closed > deadline && item.type === 'stage') {
        return 'closed-not-time'
      } else if (closed) {
        return 'completed'
      }
    },

    changeLeadersHandler() {
      this.groupList = [];
      this.selectedStages = [];
      if (this.selectedLeaders.length) {
        this.selectedGroups = [];
        this.allItems
            .filter((usr) => this.selectedLeaders
                .map((el) => el.ID).includes(usr.ID))
            .map((el) => el.projects)
            .forEach((el) => this.groupList = this.groupList.concat(el));
        this.items = JSON.parse(JSON.stringify(this.allItems
            .filter((usr) => this.selectedLeaders
                .map((el) => el.ID).includes(usr.ID))))

        // this.groupList = this.allGroups.filter((el) => this.selectedLeaders.map((el) => el.ID).includes(el.OWNER_ID))
        // this.items = this.allItems.filter((el)=> this.selectedLeaders.map((er)=> er.ID).includes(el.ID));
      } else {
        this.allItems
            .map((el) => el.projects)
            .forEach((el) => this.groupList = this.groupList.concat(el))
        this.items = JSON.parse(JSON.stringify(this.allItems));
        // this.groupList = this.allGroups;
      }
      this.changeGroupHandler()
    },
    changeGroupHandler() {
      this.selectedStages = [];
      this.stagesList = [];
      let filteredByLeader = [];
      if (this.selectedLeaders.length) {
        filteredByLeader = JSON.parse(JSON.stringify(this.allItems.filter((usr) => this.selectedLeaders.map((el) => el.ID).includes(usr.ID))))
      } else {
        filteredByLeader = JSON.parse(JSON.stringify(this.allItems))
      }
      if (this.selectedGroups.length) {
        filteredByLeader.forEach((el) => el.projects = el.projects.filter((prj) => this.selectedGroups.includes(prj.ID)));
      }
      let arr = new Set();
      filteredByLeader.forEach((lider) => lider.projects.forEach((prj) => prj.stages.forEach((stage) => arr.add(stage.title))))
      this.stagesList = Array.from(arr)

      this.items = filteredByLeader.filter((usr) => usr.projects?.length);
      if (this.expired) this.items.forEach((usr) => usr.projects.forEach((prj) => prj.stages = prj.stages.filter(stage => (this.getRowStageColor(stage) === 'expired' || this.getRowStageColor(stage) === 'closed-not-time'))))

      this.items.forEach((usr) => usr.projects = usr.projects.filter(prj => prj.stages.length));
      this.items = this.items.filter((usr) => usr.projects?.length && usr.projects.filter(prj => prj.stages.length).length);

    },
    changeStageHandler() {
      let filteredByLeader = [];
      if (this.selectedLeaders.length) {
        filteredByLeader = JSON.parse(JSON.stringify(this.allItems.filter((usr) => this.selectedLeaders.map((el) => el.ID).includes(usr.ID))))
      } else {
        filteredByLeader = JSON.parse(JSON.stringify(this.allItems))
      }

      if (this.selectedGroups.length) {
        filteredByLeader.forEach((el) => el.projects = el.projects.filter((prj) => this.selectedGroups.includes(prj.ID)));
      }
      if (this.selectedStages.length) {
        filteredByLeader.forEach((usr) => usr.projects.forEach((prj) => {
          prj.stages = prj.stages.filter(stage => this.selectedStages.includes(stage.title))
        }))
      }
      filteredByLeader.forEach((usr) => usr.projects = usr.projects.filter(prj => prj.stages.length))
      this.items = filteredByLeader;
      if (this.expired) this.items.forEach((usr) => usr.projects.forEach((prj) => prj.stages = prj.stages.filter(stage => (this.getRowStageColor(stage) === 'expired' || this.getRowStageColor(stage) === 'closed-not-time'))))
      this.items = this.items.filter((usr) => usr.projects?.length && usr.projects.filter(prj => prj.stages.length).length);

    },

    expiredHandler() {
      this.changeLeadersHandler();
      this.changeGroupHandler();
      this.changeStageHandler();
      if (this.expired) this.items.forEach((usr) => usr.projects.forEach((prj) => prj.stages = prj.stages.filter(stage => (this.getRowStageColor(stage) === 'expired' || this.getRowStageColor(stage) === 'closed-not-time'))))
      this.items = this.items.filter((usr) => usr.projects?.length && usr.projects.filter(prj => prj.stages.length).length);
    },

    async fetchComments(id) {
      let comments = []
      await this.callMethod(
          'task.commentitem.getlist',
          [id, {'ID': 'asc'}, {'>AUTHOR_ID': 2}],).then(function (res) {
        comments = res;
      });
      return comments
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


    async fetchGroups() {
      let groups = [];
      let filter = {
        'CHECK_PERMISSIONS': 'N',
        'PROJECT': 'Y',
      }

      if (!this.isArchive) {
        filter.CLOSED = 'N';
      }


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
              'CHECK_PERMISSIONS': 'N',
              // 'GROUP_ID': this.selectedGroups,
              'GROUP_ID': this.allGroups.map((el) => el.ID),
              // "UF_AUTO_871282925230": 1,
              // "UF_AUTO_747183418338": 1,
              "TAG": "Стадия проекта"
            },
            select: ['ID', 'GROUP_ID', 'DEADLINE', 'TITLE', 'STATUS', 'CLOSED_DATE']
          }).then(function (res) {
        res.forEach(el => {
          el['tasks'] ? el['tasks'].forEach((tsk) => tsk.type = 'stage') : el?.forEach((tsk) => tsk.type = 'stage')
          tasks = el['tasks'] ? tasks.concat(el['tasks']) : tasks.concat(el)
        });
      });

      await this.callMethod(
          'tasks.task.list',
          {
            filter: {
              'CHECK_PERMISSIONS': 'N',
              // 'GROUP_ID': this.selectedGroups,
              'GROUP_ID': this.allGroups.map((el) => el.ID),
              // "UF_AUTO_871282925230": 1,
              // "UF_AUTO_747183418338": 1,
              "TAG": "Финал"
            },
            select: ['ID', 'GROUP_ID', 'DEADLINE', 'TITLE', 'STATUS', 'CLOSED_DATE']
          }).then(function (res) {
        res.forEach(el => {
          el['tasks'] ? el['tasks'].forEach((tsk) => tsk.type = 'final') : el?.forEach((tsk) => tsk.type = 'final')
          tasks = el['tasks'] ? tasks.concat(el['tasks']) : tasks.concat(el)
        });
      });


      return tasks;
    },

    async fetchLeaders(leadersId) {
      let result = [];
      await this.callMethod(
          'user.get', {
            FILTER: {ID: leadersId, CHECK_PERMISSIONS: 'N',}
          }
      ).then(function (res) {
        result = res
      });

      return result
    },


    async createReport() {

      this.items = []

      let tasks = this.allTasks;
      let leaders = this.selectedLeaders.length ? this.selectedLeaders : this.leadersList;
      let groups = this.selectedGroups.length ? this.selectedGroups : this.allGroups;

      groups.forEach((prj) => prj.stages = tasks.filter((tsk) => prj.ID === tsk.groupId))
      leaders.forEach((el) => el.projects = groups.filter((prj) => prj.OWNER_ID === el.ID))

      this.allItems = JSON.parse(JSON.stringify(leaders));
      leaders.forEach((usr) => usr.projects = usr.projects.filter(prj => prj.stages.length));

      this.items = leaders.filter((usr) => usr.projects?.length && usr.projects.filter(prj => prj.stages.length).length);
    }
  },


  async created() {
    if (!window.isSuper) {
      await this.$router.push({name: 'main'})
    }
    this.allGroups = await this.fetchGroups();
    this.allTasks = await this.fetchTasks();

    this.stagesList = Array.from(new Set(this.allTasks.map((el) => el.title)));
    this.groupList = Array.from(this.allGroups);
    this.leadersList = await this.fetchLeaders(Array.from(new Set(this.allGroups.map((el) => el.OWNER_ID))));
    await this.createReport()


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

.expired {

  color: red;
}

.closed-not-time {
  background-color: #ff000021;
}

.closed-not-time:hover {
  background-color: rgba(255, 0, 0, 0.4) !important;
}

.completed {
  background-color: rgba(32, 255, 0, 0.26);
}

.completed:hover {
  background-color: rgba(32, 255, 0, 0.5) !important;
}

</style>
