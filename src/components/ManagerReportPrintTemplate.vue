<template>
  <div>
    <div class="print-table-header"
         style="display: flex; align-items: center; flex-direction: column;margin: 0 auto 40px; width: fit-content; padding: 0 20px 20px 20px">

      <div style="margin-bottom: 20px">
        <span class="print-table-img"><img src="../assets/logo.png" alt=""></span>

      </div>

      <div v-if="group">
        Отчёт по проекту:
        <span  class="print-table-company" style="font-size: 18px; font-weight: bold"> {{group.NAME}}</span>
      </div>
      <div v-if="user.NAME||user.LAST_NAME ">
        Имя сотрудника:
        <span style="font-size: 18px; font-weight: bold">{{user.NAME + " " + user.LAST_NAME}}</span>
      </div>

      <div style="margin-bottom: 10px">
        Период отчета:
        <span style="font-size: 18px">с {{dates[0]}}</span>
        <span style="font-size: 18px; margin-left: 6px">по {{ dates[1] }}</span>
      </div>



    </div>

    <div v-for="(group, index) in data" :key="index"  class="print-table" style="display: flex; flex-direction: column;  margin: 0 10px 30px 10px;  font-size: 15px">

      <div class="print-table-left"
           style="display: flex;  gap: 40px; justify-content: center; text-align: center">

        <div style="display: flex;flex-direction: column;gap:5px; margin-bottom: 10px">
          <span style="margin-bottom: 5px; font-style: italic; font-size: 13px">Дата:</span>
          <span style="font-size: 16px; font-weight: bold">  {{ group.date }}</span>
        </div>

        <div style="display: flex; gap:5px; margin-bottom: 10px;flex-direction: column;  align-items: center">
          <span style="margin-bottom:5px;font-style: italic; font-size: 13px">Часы работы:</span>

          <div style="display: flex; gap:5px;"><span style="font-size: 16px; font-weight: bold">с  {{ formatTime(group.minTime) }}</span>
            <span style="font-size: 16px; font-weight: bold">по {{ formatTime(group.maxTime) }}</span></div>

        </div>

        <div style="display: flex;flex-direction: column;margin-bottom: 10px; gap:5px;">
          <span style="margin-bottom: 5px; font-style: italic; font-size: 13px">Время работы:</span>
          <span style="font-size: 16px; font-weight: bold">   {{ secondsToHoursAndMinutes(group.seconds) }}</span>
        </div>

      </div>

      <ol class="print-table-right" style="padding: 0 10px 10px 30px;">

        <li  v-for="(elem, ind) in group.elements" :key="ind" style="margin: 0 0 10px">
          <div
              style="display: grid; gap: 10px; align-items: center; grid-template-columns:  20vw 150px 100px 100px  auto; text-align: center; padding: 10px; border-bottom:2px solid black; align-items: center; margin-bottom: 5px">
            <span style=" text-align: left; font-size: 15px"> {{ (elem.task.title) }}</span>
            <span>  {{ formatTime(elem.CREATED_DATE) }} - {{ formatTime(elem.STOP_IN_LOGS) }}</span>
            <span style="">    {{ secondsToHoursAndMinutes(elem.SECONDS) }}</span>
            <div>
              <span
                  v-if="elem.pause"  style="color: red; text-transform: uppercase; font-weight: bold; padding: 5px; border: 1px solid gray; border-radius: 5px"> Простой</span>
            </div>
            <span style="font-size: 10px; color: #989898; ">{{ elem.COMMENT_TEXT }}</span>
          </div>

        </li>

<!--        <li>-->
<!--          <div-->
<!--              style="display: grid; gap: 10px; align-items: center; grid-template-columns: 20vw 150px 100px 100px  auto; text-align: center; padding: 10px; border-bottom:2px solid black; align-items: center; margin-bottom: 5px">-->
<!--            <span style=" text-align: left; font-size: 18px"> title</span>-->
<!--            <span>05:19:12 - 11:20:18</span>-->
<!--            <span style=""> 5ч. 45мин</span>-->
<!--            <div>-->
<!--            <span-->
<!--                style="color: red; text-transform: uppercase; font-weight: bold; padding: 5px; border: 1px solid gray; border-radius: 5px"> Простой</span>-->

<!--            </div>-->
<!--            <span style="font-size: 10px; color: #989898; padding: 10px;">Комментарий</span>-->
<!--          </div>-->

<!--        </li>-->

      </ol>

    </div>
  </div>
</template>

<script>
export default {
  name: "ManagerReportPrintTemplate",
  props: {
    group: {
      type: Object
    },
    user: {
    },
    dates: {},
    data: {
      required: true,
      type: Array
    }
  },
  data() {
    return {}
  }
  ,

  methods: {

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
  }
}
</script>

<style>

</style>