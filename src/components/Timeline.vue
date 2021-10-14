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

        <rect
            @mouseenter=" (event)=> onRectHover (event, elem)"
            @mouseleave="(event) =>   onRectHover (event, elem)"
            :x="elem.startHour*hour+'vw'" y="10"
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

    <div class="hoverPanel" ref="hoverPanel"></div>
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
      elements: [],
      scale: [],
      hour: 0,
    }
  },
  created() {
    // this.timeLogs.forEach((el) => new Date(el.start))
    this.generateScale();
    this.hour = 96 / (this.scale.length);
    this.group.elements.forEach((el) => this.elements.push({
      id : el.ID,
      title: el.task.title,
      startHour: (this.convertTimeToInt(el.DATE_START)),
      start: (this.formatTime(el.DATE_START)),
      end: (this.formatTime(el.DATE_STOP)),
      duration: this.calculateDuration(el.DATE_START, el.DATE_STOP),

    }))
  },
  methods: {
    onRectHover(event, elem) {
      if (event.type === 'mouseenter') {
        event.target.classList.add('activeRect')
        let coords = event.target.getBoundingClientRect()
        this.$refs.hoverPanel.innerHTML
        this.$refs.hoverPanel.innerHTML = elem.title + "<br>" + elem.start + "  -  " + elem.end;
        this.$refs.hoverPanel.style.left = ("calc(" + coords.left + "px - 3vw)");
        this.$refs.hoverPanel.style.opacity = 0.8;
        this.$emit('hover', elem);
      }
      else if (event.type === 'mouseleave') {
        event.target.classList.remove('activeRect');
        this.$refs.hoverPanel.innerHTML = '';
        this.$refs.hoverPanel.style.opacity = 0;
        this.$emit('hover', false);
      }
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
    convertTimeToInt(arg) {
      let date = new Date(arg);
      return (date.getHours() - this.group.minTime.getHours()) + (date.getMinutes() + (date.getSeconds() / 60)) / 60;
    },

    // eslint-disable-next-line no-unused-vars
    calculateDuration(start, stop) {
      return ((new Date(stop)) - (new Date(start))) / 1000 / 60 / 60;
    },

    generateScale() {
      let start = this.group.minTime.getHours();
      let end = this.group.maxTime.getHours();
      for (; start <= end; start++) {
        let time = start < 10 ? '0' + start + ':00' : start + ':00';
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

.activeRect {
  opacity: 0.8;
}

.hoverPanel {
  position: absolute;
  background: #698899;
  border-radius: 3px;
  padding: 5px;
  color: white;
  opacity: 0;
  -webkit-box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.6);
  -moz-box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.6);
  box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.6);
  top: -50px

}


</style>