<template>
  <div class="cartcontrol">
    <transition name="slide-rotate">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart"><i class="icon-remove_circle_outline"></i></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-increase" @click.stop.prevent="addCart"><i class="icon-add_circle"></i></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart () {
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit('cartAdd', event.target)
    },
    decreaseCart () {
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus">
.cartcontrol
  position: relative
  top: 3px
  .cart-decrease
    &.slide-rotate-enter-active, &.slide-rotate-leave-active
      transition: all 1s linear
    &.slide-rotate-enter,&.slide-rotate-leave-to
      transform: translateX(24px) rotate(180deg)
      opacity: 0
  .cart-decrease,.cart-increase
    display: inline-block
    padding: 6px
    line-height: 24px
    font-size: 24px
    color: rgb(0,160,220)
  .cart-count
    display: inline-block
    vertical-align: top
    width: 12px
    padding: 6px
    line-height: 24px
    text-align: center
    font-size: 10px
    color: rgb(147, 153, 159)

</style>
