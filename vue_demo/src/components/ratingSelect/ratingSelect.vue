<template>
  <div class="rating-select">
    <div class="rating-type">
    <span @click="select(2, $event)" class="block all" :class="{'active': selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
    <span @click="select(0, $event)" class="block positive" :class="{'active': selectType === 0}">{{desc.positive}}<span class="count">{{positiveCount}}</span></span>
    <span @click="select(1, $event)" class="block negative" :class="{'active': selectType === 1}">{{desc.negative}}<span class="count">{{negativeCount}}</span></span>
    </div>
    <div class="switch" @click="toggle($event)"><span><i :class="{'on':onlyContent === true}" class="icon-check_circle"></i></span><span class="text">只看有内容的评价</span></div>
  </div>
</template>
<script>

const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
export default {
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  methods: {
    select (type, event) {
      this.selectType = type
      this.$emit('selectType', type)
    },

    toggle (event) {
      this.onlyContent = !this.onlyContent
      this.$emit('toggle', this.onlyContent)
    }
  },
  computed: {
    positiveCount () {
      let count = this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
      return count.length
    },
    negativeCount () {
      let count = this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
      return count.length
    }
  }
}
</script>
<style lang="stylus">
@import '../../common/stylus/mixin'
.rating-select
  .rating-type
    padding: 18px 0
    margin: 0 18px
    border-1px(rgba(7, 17, 27, 0.1))
    font-size: 0
    .block
      display: inline-block
      padding: 8px 12px
      margin-right: 8px
      border-radius: 1px
      font-size: 12px
      color: rgb(77, 85, 93)
      &.active
        color: #ffffff
      .count
        margin-left: 2px
        line-height: 16px
        font-size: 8px
      &.all,&.positive
        background: rgba(0, 160, 220, 0.2)
        &.active
          background: rgb(0, 160, 220)
      &.negative
        background: rgba(77,85,93,0.2)
        &.active
          background: rgb(77, 85, 93)
  .switch
    padding: 12px 18px
    line-height: 24px
    border-bottom: 1px solid rgba(7,17,27,0.2)
    color: rgb(147, 153, 159)
    font-size: 0
    .icon-check_circle
      margin-right: 4px
      font-size: 24px
      &.on
        color: #00c850
    .text
      vertical-align:top
      font-size: 12px

</style>
