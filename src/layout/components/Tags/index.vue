<template>
    <div class="tagsContainer">
        <el-scrollbar>
            <el-tag v-for="(view, index) in visitedViews" :class="{ 'tag-active': route.path == view.path }" class="tag"
                :closable="!view.affix" @close="delTag(view)" 
                @contextmenu.prevent=showMenu(view,$event)>
                <router-link :to=view.path>
                    {{ view.title }}
                </router-link>
            </el-tag>
        </el-scrollbar>
        <!--标签操作选项 -->
        <ul class="tag-handle-list" v-show="showHandlerMenu" :style="{ left: left, top: top }">
            <li class="tag-handle-item" @click="refresh">
                <SvgIcon iconClass="refresh" ></SvgIcon>
                刷新
            </li>
            <li v-show="!selectedTag?.affix" class="tag-handle-item" @click="clostTag">
                <SvgIcon iconClass="close"></SvgIcon>
                关闭
            </li>
            <li class="tag-handle-item" @click="delOther">
                <SvgIcon iconClass="close_other" ></SvgIcon>
                关闭其它
            </li >
            <li v-show="canDelLeft" class="tag-handle-item" @click="delLeft">
                <SvgIcon iconClass="close_left"></SvgIcon>
                关闭左侧
            </li>
            <li v-show="canDelRight" class="tag-handle-item" @click="delRight">
                <SvgIcon iconClass="close_right"></SvgIcon>
                关闭右侧
            </li>
            <li class="tag-handle-item" @click="delAll">
                <SvgIcon iconClass="close_all"></SvgIcon>
                关闭所有
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useTagViewStore, usePermissionStore } from '@/store';
import { storeToRefs } from 'pinia';
const route = useRoute();
const router = useRouter();
const tagViewStore = useTagViewStore();
const permissionStore = usePermissionStore();
//所有已浏览标签
const { visitedViews } = storeToRefs(tagViewStore);
//固定标签
const affixTags = ref([]);
//是否显示关闭左侧
const canDelLeft = ref(false);
//是否显示关闭右侧
const canDelRight = ref(false);
//右键选中的标签
const selectedTag = ref();
//是否显示操作菜单
const showHandlerMenu = ref(false);
/**
 * 过滤出affix的tag
 * @param {*} routes 
 * @param {*} basePath 
 */
const filterAffix = (routes, basePath) => {
    const tags = [];
    routes.forEach(route => {
        const path = route.path == '/' ? route.path : basePath + route.path
        if (route.meta && route.meta.affix) {
            tags.push({
                name: route.name || "",
                title: route.meta?.title || "no-name",
                path: path,
                affix: route.meta?.affix,
            })
        }
        if (route.children) {
            const childTags = filterAffix(route.children, path);
            if (childTags.length >= 1) {
                tags.push(...childTags);
            }
        }
    });
    return tags;
}
/**
 * 初始化tags
 */
const initTags = () => {
    affixTags.value = filterAffix(permissionStore.routes, '/');
    affixTags.value.forEach(tag => {
        tagViewStore.addVisitedView(tag);
    })
}
/**
 * 添加tag
 */
const addTag = () => {
    if (route.meta?.title) {
        tagViewStore.addVisitedView({
            name: route.name || "",
            title: route.meta?.title || "no-name",
            path: route.path,
            affix: route.meta?.affix,
        })
    }
}

watch(() => route, (nVal, oVal) => {
    addTag();
}, {
    deep: true,
    immediate: true
})
/**
 * 删除tag
 */
const delTag = (view) => {
    tagViewStore.removeVisitedView(view);
    if (view.path == route.path) {
        //如果删除的是当前活动的tag，跳转到删除后的tags集合的最后一个tag上
        router.replace(visitedViews.value[visitedViews.value.length - 1].path);

    }
}
/**
 * 展示操作菜单
 */
const left = ref(0);
const top = ref(0);
const showMenu = (tag, e) => {
    // const l = e.target.getBoundingClientRect().left + e.offsetX + 15 + 'px';
    // const t = e.target.getBoundingClientRect().top + e.offsetY + 'px';
    const l = e.clientX + 15 + 'px';
    const t = e.clientY + 'px';
    left.value = l;
    top.value = t;
    showHandlerMenu.value = true;
    selectedTag.value = tag;
}
/**
 * 关闭操作菜单
 */
const closeMenu = () => {
    showHandlerMenu.value = false;
}
watch(showHandlerMenu, (nVal) => {
    if (nVal) {
        document.addEventListener('click', closeMenu);
    } else {
        document.removeEventListener('click', closeMenu);
    }
})
/**
 * 关闭左侧和关闭右侧的显示与隐藏
 * 
 */
watch(selectedTag, (nVal) => {
    const index = visitedViews.value.findIndex((v) => v.path == nVal.path);
    if (index <= affixTags.value.length) {
        //选中的是固定标签或者第一个非固定标签
        canDelLeft.value = false;
        if (visitedViews.value.length > affixTags.value.length) {
            //存在非固定标签
            canDelRight.value = true;
        }
    } else {
        canDelLeft.value = true;
    }
    if (index == visitedViews.value.length - 1) {
        //选中的是最后一个标签
        canDelRight.value = false;
    } else {
        canDelRight.value = true;
    }

}, {
    deep: true,
    // immediate:true,
})
/**
 * 关闭标签
 */
const clostTag = ()=>{
    delTag(selectedTag.value);
}
/**
 * 关闭左侧
 */
const delLeft = ()=>{
    tagViewStore.delLeft(selectedTag.value);
    if(visitedViews.value.findIndex(v=>v.path==route.path)==-1){
        router.replace(selectedTag.value.path);
    }
}
/**
 * 关闭右侧
 */
const delRight = ()=>{
    tagViewStore.delRight(selectedTag.value);
    if(visitedViews.value.findIndex(v=>v.path==route.path)==-1){
        router.replace(selectedTag.value.path);
    }
}
/**
 * 关闭其它
 */
const delOther = ()=>{
    tagViewStore.removeOther(selectedTag.value);
    if(selectedTag.value.path!=route.path){
        router.replace(selectedTag.value.path);
    }
}
/**
 * 关闭所有
 */
const delAll = ()=>{
    tagViewStore.delAll();
    router.replace(visitedViews.value[visitedViews.value.length - 1].path);
}
/**
 * 刷新
 */
const refresh = ()=>{
    tagViewStore.refresh(selectedTag.value);
}
onMounted(() => {
    initTags();
})
</script>

<style lang="scss" scoped>
.tagsContainer {
    padding-left: 15px;
    width: 100%;
    height: 34px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    padding-top: 5px;
    :deep(.el-scrollbar__wrap){
        height: 100%; 
        overflow-y: hidden;
        white-space: nowrap;
    }
    .tag {
        margin-right: 10px;
        cursor: pointer;
        background-color: #fff;
        border: #e4e7ed 1px solid;

        :deep(.el-tag__content) {
            & :hover {
                color: var(--el-color-primary);
            }
        }

        &.tag-active {
            background-color: #409eff;

            :deep(.router-link-active) {
                color: #fff;
            }

            :deep(.el-tag__close) {
                color: #fff;

                & :hover {
                    background-color: #fff;
                    color: var(--el-color-primary);
                    border-radius: 50%;
                }
            }

            &::before {
                content: "";
                margin-right: 5px;
                width: 8px;
                height: 8px;
                background-color: #fff;
                border-radius: 50%;
            }
        }

    }

    .tag-handle-list {
        position: absolute;
        z-index: 999;
        width: 100px;
        background-color: #fff;
        .tag-handle-item {
            width: 100%;
            padding: 0 10px;
            &:hover {
                background-color: #f5f7fa;
                cursor: pointer;
            }
        }
    }
}
</style>