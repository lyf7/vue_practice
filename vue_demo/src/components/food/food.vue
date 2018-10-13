<template>
<transition>
<div class="food" v-show="showFlag" ref='foodDetail'>
  <div class="food-content">
    <div class="image-header">
      <img :src="food.image" alt="">
      <div class="back-icon" @click="hide">
        <i class="icon-arrow_lift"></i>
      </div>
    </div>
    <div class="content">
      <h1 class="title">{{food.name}}</h1>
      <div class="food-detail">
        <span class="sell-count">月售{{food.sellCount}}</span>
        <span class="rating">好评率{{food.rating}}</span>
      </div>
      <div class="price">
        <span class="now">￥{{food.price}}</span>
        <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
      </div>
      <div class="cartcontrol-wrapper">
        <cartcontrol :food="food"></cartcontrol>
      </div>
      <transition>
      <div @click="addFirst(food,$event)" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
      </transition>
    </div>
    <split v-show="food.info"></split>
    <div class="info" v-show="food.info">
      <h1 class="title">商品信息</h1>
      <p class="text">{{food.info}}</p>
    </div>
    <split></split>
    <div class="rating">
      <h1 class="title">商品评价</h1>
      <ratingSelect v-on:selectType="typeChange" v-on:toggle="contentChange" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingSelect>

      <div class="rating-wrapper">
        <ul v-show="food.ratings && food.ratings.length">
          <li v-show="needShow(rating.rateType,rating.text)" class="rating-item" v-for="(rating,index) in food.ratings" :key="index">
            <div class="user"><span class="name">{{rating.username}}</span><img width="12px" height="12px" :src="rating.avatar" alt="" class="avatar"></div>
            <div class="time">{{rating.rateTime | formatDate}}</div>
            <p class="text">
              <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
            {{rating.text}}
            </p>
          </li>
        </ul>
        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
      </div>
    </div>
    </div>
  </div>
</transition>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'
import split from '../split/split'
import ratingSelect from '../ratingSelect/ratingSelect'
import Vue from 'vue'
import {formatDate} from 'common/js/date'

// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  components: {
    cartcontrol,
    split,
    ratingSelect
  },
  methods: {
    typeChange (type) {
      this.selectType = type
    },
    contentChange (content) {
      this.onlyContent = content
    },
    show () {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = true
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodDetail, {click: true})
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    },
    addFirst (food, event) {
      if (!event._constructed) {
        return
      }
      this.$emit('cartAdd', event.target)
      Vue.set(this.food, 'count', 1)
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin'
.food
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  z-index: 30
  width: 100%
  background: #ffffff
  transform: translate3d(0, 0, 0)
  &.v-enter,&.v-leave-to
    transform: translate3d(100%, 0, 0)
  &.v-enter-active,&.v-leave-active
    transition: all 2s linear
  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100%
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back-icon
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        display: block
        padding: 10px
        font-size: 20px
        color: #ffffff
  .content
    padding: 18px
    position: relative
    .title
      line-height: 14px
      margin-bottom: 8px
      font-size: 14px
      font-weight: 700
      color: rgb(7, 17, 27)
    .food-detail
      margin-bottom: 18px
      line-height: 10px
      height: 10px
      font-size: 0
      .sell-count,.rating
        font-size: 10px
        color: rgb(147,153,159)
      .sell-count
        margin-right: 12px
    .price
      font-weight: 700
      line-height: 24px
      .now
        margin-right: 8px
        font-size: 14px
        color: rgb(240, 20, 20)
      .old
        text-decoration: line-through
        font-size: 10px
        color: rgb(147, 153, 159)
    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10px
      height: 24px
      line-height: 24px
      padding: 0 12px
      border-radius: 12px
      font-size: 10px
      color: #ffffff
      background: rgb(0, 160, 220)
      opacity: 1
      &.v-enter,&.v-leave-to
        opacity: 0
      &.v-enter-active,&.v-leave-active
        transition: all 0.5s
  .info
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 6px
      font-size: 14px
      font-weight: 700
    .text
      margin: 0 8px
      line-height: 24px
      font-size: 12px
      font-weight: 200
      color: rgb(77, 85, 93)
  .rating
    padding-top: 18px
    .title
      line-height: 14px
      margin-left: 18px
      font-size: 14px
      color: rgb(7, 17, 27)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .user
          position: absolute
          right: 0
          top: 16px
          font-size: 0
          line-height: 12px
          .name
            display: inline-block
            margin-right: 6px
            vertical-align: top
            font-size: 10px
            color: rgb(147, 153, 159)
          .avatar
            border-radius: 50%
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7,17,27)
          vertical-align: top
          .icon-thumb_up,.icon-thumb_down
            margin-right: 4px
            line-height: 24px
            font-size: 12px
          .icon-thumb_up
            color: rgb(1,160,220)
          .icon-thumb_down
            color: rgb(147,153,159)
      .no-rating
        padding: 16px 0
        font-size: 12px
        color: rgb(147,153,159)
</style>
