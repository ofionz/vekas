<template>
  <div class="some relative ">
    <svg id="parent-svg" class="parent-svg">
      <defs>

        <pattern id="pattern-parent"
                 width="8" height="10"
                 patternUnits="userSpaceOnUse"
                 patternTransform="rotate(45 50 50)">
          <line stroke="#eaeaea" stroke-width="7px" y2="10"/>
        </pattern>

      </defs>
      <rect x="0vw" y="10"
            width="95vw" height="30"
            fill="url(#pattern-parent)"
            opacity="0.6"
            stroke="#eaeaea"
            stroke-width="1px"
            rx="3"/>
      <svg v-for="(elem, index) in elements" :key="index" class="subsidiary-svg">
        <defs>

          <pattern id="pattern"
                   width="8" height="10"
                   patternUnits="userSpaceOnUse"
                   patternTransform="rotate(45 50 50)">
            <line stroke="#222451" stroke-width="7px" y2="10"/>
          </pattern>

        </defs>

        <rect :x="elem.startHour*hour+'vw'" y="10"
              :width="elem.duration*hour+'vw'" height="30"
              fill="url(#pattern)"
              opacity="0.4"
              stroke="#222451"
              stroke-width="1px"
              rx="3"/>
      </svg>
    </svg>

    <div class="scale">
      <span v-for="(elem, index) in scale" :key="index" class="scale__time relative">{{ elem }}</span>
      <span class="scale__time relative"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Timeline",
  components: {},
  props: {
    group: {
      type: Object
    }
  },
  data() {
    return {
      timeLogs: [
        {
          start: '2021-10-10T11:29:29+03:00',
        }
      ],
      elements: [
        {
          startHour: 0,
          duration: 1
        },
      ],
      scale: [],
      hour: 0,
    }
  },
  created() {
    // this.timeLogs.forEach((el) => new Date(el.start))
    this.generateScale();
    this.hour = 96/(this.scale.length);
  },
  methods: {
    convertTimeToInt() {
      // console.log(time)
    },
    generateScale (){
      let start = this.group.minTime.getHours();
      let end = this.group.maxTime.getHours();
      for ( ;start <= end; start++){
        let time = start<10?'0'+start+':00':start+':00';
        this.scale.push(time);
      }
    }
  }
}
</script>
<style>
.relative {
  position: relative;
}

.some {
  width: 95vw;
  height: 70px;
  display: flex;
}
.parent-svg {
  /*transform: translateX(1vw);*/
}
.scale {
  transform: translateX(-1vw);
  position: absolute;
  bottom: 5px;
  display: flex;
  width: 95.8vw;
  justify-content: space-between;
}

.scale__time {
  font-size: 12px;
  color: rgb(102, 102, 102);
}

.scale__time:before {
  position: absolute;
  display: block;
  content: "";
  left: calc(50% - 2.5px);
  top: -11px;
  width: 5px;
  height: 10px;
  background: #ffffff;
  border: 1px solid #aaa8a8;
  border-radius: 2px;
}
</style>