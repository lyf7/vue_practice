<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
          </div>
          <div class="number" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <transition v-for="(ball, index) in balls" :key="index" name="drop"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      >
        <div class="ball" v-show="ball.show"><div class="inner inner-hook"></div></div>
      </transition>
    </div>
    <transition>
    <div class="shopcart-list" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content" ref="listContent">
        <ul>
          <li class="food" v-for="(food, index) in selectFoods" :key=index>
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>￥{{food.price*food.count}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </transition>
    <transition>
    <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
import cartcontrol from '../cartcontrol/cartcontrol'
import BScroll from 'better-scroll'

export default {
  data () {
    return {
      balls: [
        {show: false},
        {show: false},
        {show: false},
        {show: false},
        {show: false},
        {show: false}
      ],
      fold: true,
      dropBalls: []
    }
  },
  props: {
    selectFoods: {
      type: Array,
      default () {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    listShow () {
      if (!this.totalCount) {
        // eslint-disable-next-line
        this.fold = true
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
          // eslint-disable-next-line
          this.scroll = new BScroll(this.$refs.listContent,{click: true})
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    },
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass () {
      return this.totalPrice < this.minPrice ? 'not-enough' : 'enough'
    }
  },
  components: {
    cartcontrol
  },
  methods: {
    beforeEnter (el) {
      let count = this.dropBalls.length
      while (count--) {
        let ball = this.dropBalls[count]
        if (ball.show) {
          let rect = ball.target.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
          return
        }
      }
    },
    enter (el) {
      /* eslint-disable */
      let rf = el.offsetHeight

      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
      })
    },
    afterEnter (el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
      }
    },
    drop (target) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.target = target
          this.dropBalls.push(ball)
          return
        }
      }
    },
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
      console.log('text')
    },
    empty () {
      this.selectFoods.forEach((food) => { food.count = 0 })
    },
    hideList () {
      this.fold = true
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付${this.totalPrice}元`)
    }
  }
}

</script>

<style lang="stylus">
//@import "../../common/stylus/icon"
@import "../../common/stylus/mixin"
.shopcart
  position: fixed
  left: 0
  bottom: 0
  z-index: 50
  width: 100%
  height: 48px
  background: #000000
  .content
    display: flex
    background: #141d17
    font-size: 0
    position: relative
    z-index: 2
    .content-left
      flex: 1
      .logo-wrapper
        display: inline-block
        position: relative
        top: -10px
        margin: 0 12px
        padding: 6px
        width: 56px
        height: 56px
        box-sizing: border-box
        vertical-align: top
        border-radius: 50%
        background: #141d17
        .number
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align: center
          border-radius: 16px
          font-size: 9px
          font-weight: 700
          color: #fff
          background:rgb(240, 20, 20)
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)

        .logo
          width: 100%
          height: 100%
          border-radius: 50%
          background:#2b343c
          text-align: center
          &.highlight
            background: rgb(0, 160, 220)
          .icon-shopping_cart
            line-height: 44px
            font-size: 24px
            color: #80858a
            &.highlight
              color:#fff
      .price
        display: inline-block
        position: relative
        vertical-align: top
        margin-top: 12px
        line-height: 24px
        box-sizing: border-box
        padding-right: 12px
        border-right: 1px solid rgba(255,255,255,0.1)
        font-size: 16px
        font-weight: 700
        color: rgba(255,255,255,0.4)
        &.highlight
          color: #fff

      .desc
        display: inline-block
        vertical-align: top
        line-height: 24px
        margin: 12px 0 0 12px
        color: rgba(255,255,255,0.4)
        font-size: 10px
    .content-right
      flex: 0 0 105px
      width: 105px
      .pay
        height: 48px
        line-height: 48px
        text-align: center
        font-size: 12px
        color: rgba(255,255,255,0.4)
        font-weight: 700
        &.not-enough
          background: #2b333b
        &.enough
          background: #00b43c
          color: #fff
  .ball-container
    .ball
      position: fixed
      left: 32px
      bottom: 22px
      z-index: 200
      width: 16px
      height: 16px
      border-radius: 50%
      .inner
        position: absolute
        z-index: 200
        width: 100%
        height: 100%
        background: rgb(0, 160, 220)
        border-radius: 50%
        transition: all 3s ease-out
      &.drop-enter
        opacity: 1
      &.drop-enter-active
        transition: all 3s ease-in
      &.drop-enter-to
        opacity: 1

  .shopcart-list
    position: absolute
    top: 0
    left: 0
    z-index: 1
    width: 100%
    transform: translate3d(0, -100%, 0)
    &.v-enter-active,&.v-leave-active
      transition: all 2s
    &.v-enter,&.v-leave-to
      transform: translate3d(0, 0, 0)
    &.v-enter-to,&.v-leave
      transform: translate3d(0, -100%, 0)
    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background: #f3f5f7
      border-bottom: 1px solid rgba(7,17,27,0.1)
      .title
        float: left
        font-size: 14px
      .empty
        float: right
        font-size: 12px
        color: rgb(0,160,220)
    .list-content
      padding: 0 18px
      max-height: 217px
      background: #fff
      overflow: hidden
      .food
        position: relative
        padding: 12px 0
        box-sizing: border-box
        border-1px(rgba(7,17,27,0.1))
        .name
          line-height: 24px
          font-size: 14px
          color: rgb(7, 17, 27)
        .price
          position: absolute
          right: 120px
          bottom: 12px
          line-height: 24px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    // z-index: 1
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    backdrop-fliter: blur(10px)
    &.v-enter-active,&.v-leave-active
      transition: all 2s
    &.v-enter,&.v-leave-to
      opacity: 0
      background: rgba(7, 17, 27, 0)
    &.v-enter-to,&.v-leave
      opacity: 1
      background: rgba(7, 17, 27, 0.6)
</style>
