<template>
    <svg class="svg-icon" :style="{ width: size, height: size }" aria-hidden="true">
        <use :xlink:href="symbolId" :fill="color"></use>
    </svg>
</template>

<script setup>
import { computed } from "vue"
const props = defineProps({
    prefix: {
        type: String,
        default: "icon"
    },
    size: {
        type: String,
        default: "1em",
    },
    iconClass: {
        type: String,
        default: '',
    },
    color: {
        type: String,
        default: ''
    }
})
const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`)
</script>

<style lang="scss" scoped>
.svg-icon {
    display: inline-block;
    vertical-align: -0.15em;/* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
    outline: none;
    fill: currentcolor;/* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
  margin-right: 5px;

}
// .svg-icon {
//   display: inline-block;
//   width: 1em;
//   height: 1em;
//   overflow: hidden;
//   vertical-align: -0.15em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
//   outline: none;
//   fill: currentcolor; /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
//   margin-right: 5px;
// }
</style>