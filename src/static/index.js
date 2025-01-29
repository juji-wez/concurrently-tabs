import { buttons } from '/static/buttons.js'
import { ui } from '/static/ui.js'
import { connect } from '/static/connect.js'

const store = {
  $active: [],
  $listener: [],
  get active() {
    return this.$active
  },
  set active( nums ) {
    this.$active = nums
    this.$listener.forEach(l => l(this.$active))
  },
  addListener( fn ){
    this.$listener.push(fn)
  }
}


document.addEventListener('DOMContentLoaded', function() {
  buttons( store )
  ui( store )
  connect( store )
});
