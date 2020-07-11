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
                    <span class="badge left col s1">{{`${event.time.hour}:${minutesFormat(event.time.minutes)}`}}</span>
                    <span class="col s9">{{event.name}}</span>
                    <i @click="itemDelete" class="col s1 material-icons right delete">clear</i>
                </li>
            </ul>
        </div>
        <div class="card z-depth-0 offset-s1 col s3">
            <div>
                <button v-for="timeBtn in timeBtnArray"
                  @click="sendChanges"
                  @mouseenter="hoverBtn"
                  @mouseleave="hoverBtn"
                  :key="timeBtn.id"
                  :id="timeBtn.id"
                  class="btn item">
                  {{`${timeBtn.hour}:${minutesFormat(timeBtn.minutes)}`}}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import AddNewEvent from './AddNewEvent.vue'

export default {
  data () {
    return {
      timeBtnArray: [],
      checked: []
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
    },
    itemDelete (e) {
      this.$store.dispatch('eventItemDelete', e.toElement.parentElement.id)
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
    minutesFormat (num) {
      return num === 0 ? '00' : num
    },
    timing (timeStart, timeEnd, period) {
      timeStart = timeStart.hour * 60 + timeStart.minutes
      timeEnd = timeEnd.hour * 60 + timeEnd.minutes
      var currentTime = timeStart
      while (currentTime <= timeEnd) {
        this.timeBtnArray.push({
          id: String(currentTime),
          hour: Math.trunc(currentTime / 60),
          minutes: currentTime % 60
        })
        currentTime += period
      }
    }
  },
  components: {
    AddNewEvent
  },
  mounted () {
    this.$store.dispatch('getAllEventItem')
    this.timing({ hour: 10, minutes: 0 }, { hour: 13, minutes: 30 }, 15)
  }
}
</script>

<style scoped>
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
</style>
