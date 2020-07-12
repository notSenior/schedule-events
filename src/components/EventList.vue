<template>
    <div class="row">
        <AddNewEvent/>
        <div class="col s6">
            <button class="btn item modal-trigger" data-target="modal1">add event</button>
            <ul class="collection">
                <li :id="event._id" @mouseenter="hoverItem" @mouseleave="hoverItem" v-for="event in eventItem" :key="event._id" class="collection-item row">
                    <div class="col s1">
                        <label v-bind:for="'checkbox_'+event._id">
                          <input @change="disabledCheckbox" v-model="checked" :id="'checkbox_'+event._id" :value="'checkbox_'+event._id" type="checkbox" />
                          <span></span>
                        </label>
                    </div>
                    <span class="badge left col s1"> {{timeFormat(event.time)}}</span>
                    <span class="col s9">{{event.name}}</span>
                    <i @click="itemDelete" class="col s1 material-icons right delete">clear</i>
                </li>
            </ul>
        </div>
        <div class="card z-depth-0 offset-s1 col s3">
            <div class="card-content">
              <h6>Time range</h6>
              <div id="slider1"></div>
              <div class="input-field">
                <input id="period" type="number" data-length="10" v-model="period" min="5" max="60">
                <label for="period">Period</label>
              </div>
            </div>
            <div class="card-content">
                <button v-for="timeBtn in timeBtnArray"
                  @click="sendChanges"
                  @mouseenter="hoverBtn"
                  @mouseleave="hoverBtn"
                  :key="timeBtn.id"
                  :id="timeBtn.id"
                  class="btn item">
                  {{timeFormat(timeBtn)}}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import AddNewEvent from './AddNewEvent.vue'
import noUiSlider from '../../node_modules/materialize-css/extras/noUiSlider/nouislider.js'
import wNumb from 'wnumb'

export default {
  data () {
    return {
      timeBtnArray: [],
      checked: [],
      slider: null,
      period: 15,
      rangeTime: {
        hourStart: 10,
        hourEnd: 14
      }
    }
  },
  computed: {
    eventItem () {
      return this.$store.state.eventItem
    }
  },
  methods: {
    sendChanges (e) {
      var el = this.timeBtnArray.find(el => e.toElement.id === el.id)

      var ids = this.checked.map(id => id.replace('checkbox_', ''))

      this.$store.dispatch('eventItemsUpdate', { ids, time: { hour: el.hour, minutes: el.minutes } })
        .then(() => {
          for (const btn of this.timeBtnArray) {
            document.getElementById(btn.id).classList.remove('highlight')
          }
          this.disabledCheckbox()
        })
    },
    itemDelete (e) {
      const id = e.toElement.parentElement.id
      this.checked.forEach((val, indx) => {
        if (id === val.replace('checkbox_', '')) {
          this.$delete(this.checked, indx)
        }
      })

      this.$store.dispatch('eventItemDelete', id)
        .then(() => {
          for (const btn of this.timeBtnArray) {
            document.getElementById(btn.id).classList.remove('highlight')
          }
          this.disabledCheckbox()
        })
    },
    hoverBtn (e) {
      if (e.type === 'mouseenter') {
        for (const btn of this.timeBtnArray) {
          if (e.toElement.id === btn.id) {
            for (const item of this.$store.state.eventItem) {
              if (item.time.hour === btn.hour && item.time.minutes === btn.minutes) {
                document.getElementById(item._id).classList.add('active')
              }
            }
          }
        }
      }

      if (e.type === 'mouseleave') {
        for (const item of this.$store.state.eventItem) {
          document.getElementById(item._id).classList.remove('active')
        }
      }
    },
    hoverItem (e) {
      if (e.type === 'mouseenter') {
        for (const item of this.$store.state.eventItem) {
          if (e.toElement.id === item._id) {
            for (const btn of this.timeBtnArray) {
              if (item.time.hour === btn.hour && item.time.minutes === btn.minutes) {
                document.getElementById(btn.id).classList.add('highlight')
              }
            }
          }
        }
      }
      if (e.type === 'mouseleave') {
        for (const btn of this.timeBtnArray) {
          document.getElementById(btn.id).classList.remove('highlight')
        }
      }
    },
    disabledCheckbox () {
      for (const btn of this.timeBtnArray) {
        document.getElementById(btn.id).classList.remove('disabled')
      }
      for (var id of this.checked) {
        for (const item of this.$store.state.eventItem) {
          if (id.replace('checkbox_', '') === item._id) {
            for (const btn of this.timeBtnArray) {
              if (item.time.hour === btn.hour && item.time.minutes === btn.minutes) {
                document.getElementById(btn.id).classList.add('disabled')
              }
            }
          }
        }
      }
    },
    timeFormat (time) {
      let minutes = time.minutes
      let hour = time.hour

      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      return `${hour}:${(minutes)}`
    },
    timing (timeStart, timeEnd, period) {
      this.timeBtnArray = []

      timeStart = timeStart.hour * 60 + timeStart.minutes
      timeEnd = timeEnd.hour * 60 + timeEnd.minutes
      var currentTime = timeStart
      while (currentTime <= timeEnd) {
        this.timeBtnArray.push({
          id: String(currentTime * Math.random()),
          hour: Math.trunc(currentTime / 60),
          minutes: currentTime % 60
        })
        currentTime += period
      }
      setTimeout(this.disabledCheckbox, 0)
    }
  },
  components: {
    AddNewEvent
  },
  mounted () {
    this.$store.dispatch('getAllEventItem')

    this.slider = document.getElementById('slider1')
    noUiSlider.create(this.slider, {
      start: [this.rangeTime.hourStart, this.rangeTime.hourEnd],
      connect: true,
      step: 1,
      orientation: 'horizontal',
      range: {
        min: 0,
        max: 24
      },
      format: wNumb({
        decimals: 0
      })
    })

    this.slider.noUiSlider.on('change', (values) => {
      this.rangeTime = {
        hourStart: Number(values[0]),
        hourEnd: Number(values[1])
      }
      this.timing({ hour: this.rangeTime.hourStart, minutes: 0 }, { hour: this.rangeTime.hourEnd, minutes: 0 }, Number(this.period))
    })

    this.timing({ hour: this.rangeTime.hourStart, minutes: 0 }, { hour: this.rangeTime.hourEnd, minutes: 0 }, Number(this.period))
  },
  watch: {
    period () {
      if (this.period >= 5 && this.period <= 60) {
        this.timing({ hour: this.rangeTime.hourStart, minutes: 0 }, { hour: this.rangeTime.hourEnd, minutes: 0 }, Number(this.period))
      }
    }
  }
}
</script>

<style scoped>
    @import '../../node_modules/materialize-css/extras/noUiSlider/nouislider.css';
    .badge{
      color: black;
    }
    .active>.badge{
      color: white;
    }
    .btn-floating{
        overflow: visible;
    }
    .item{
        margin: 4px;
        min-width: 68px;
    }
    .highlight{
      background-color:#ef5350;
    }
    .delete{
      cursor: pointer;
      user-select: none;
    }
    #slider1{
      margin: 40px 0;
    }
    .card-content{
      padding-bottom: 0;
      padding-top: 0;
    }
</style>
