<template>
    <div id="modal1" class="modal col s4">
        <form class="modal-content">
            <h4>Add New Event</h4>
            <div class="input-field">
                <input id="event_name" type="text" v-model="name" class="validate" required>
                <label for="event_name">Name</label>
                <span class="helper-text" data-error="required"></span>
            </div>
            <div class="input-field">
                <input id="timepicker1" placeholder="Time" type="text" class="timepicker" pattern="[0-9]{2}:[0-9]{2}" readonly>
            </div>
        </form>
        <div class="modal-footer">
        <a @click="addEventItem" class="waves-effect waves-green btn-flat">OK</a>
        <a @click="cancel" class="modal-close waves-effect waves-red btn-flat">Cancel</a>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      modal: null,
      timepicker: null,
      name: '',
      time: { hour: null, minutes: null }
    }
  },
  methods: {
    addEventItem () {
      if (this.name) {
        this.$store.dispatch('addEventItem', {
          name: this.name,
          time: this.time
        })
        this.modal.close()
      } else {
        document.getElementById('event_name').classList.add('invalid')
      }
    },
    cancel () {
      this.name = ''
      this.time = { hour: null, minutes: null }
    }
  },
  mounted () {
    document.addEventListener('DOMContentLoaded', () => {
      var elem = document.getElementById('modal1')
      this.modal = window.M.Modal.init(elem)
    })
    document.addEventListener('DOMContentLoaded', () => {
      var elem = document.getElementById('timepicker1')
      this.timepicker = window.M.Timepicker.init(elem, {
        container: '#app',
        twelveHour: false,
        onCloseEnd: () => {
          this.time.hour = this.timepicker.hours
          this.time.minutes = this.timepicker.minutes
        }
      })
    })
  },
  destroyed () {
    this.modal.desdroy()
    this.timepicker.desdroy()
  }
}
</script>

<style scoped>
  .timepicker{
    color: black !important;
  }
</style>
