import { defineStore } from "pinia";
import {ref } from "vue"
const visitedViews = ref([]);
export const useTagViewStore = defineStore("tagsView",()=>{
    /**
     * 添加浏览过的视图
     * @param {*} view 浏览过的视图
     *  
     */
    const addVisitedView  = (view)=>{
        if(visitedViews.value.some((item)=>item.path == view.path)){
            //如果已存在,返回
            return ;
        }
        if(view.affix){
            //固定的放前面
            visitedViews.value.unshift(view);
        }else{
            //暂时的放后面
            visitedViews.value.push(view);
        }
    }

    /**
     * 删除指定视图
     * @param {*} view 
     */ 
    const removeVisitedView = (view)=>{
        for(let i = 0;i<visitedViews.value.length;i++){
            if(view.path==visitedViews.value[i].path){
                visitedViews.value.splice(i,1);
                break;
            }
        }
    }
    /**
     * 删除其他
     * @param {*} view 
     */
    const removeOther = (view)=>{
        visitedViews.value = visitedViews.value.filter((v)=>{
            return v.affix||v.path==view.path;
        })
    }
    /**
     * 删除左边
     * @param {*} view 
     */
    const delLeft = (view)=>{
        //拿到选中的试图标签下标
     const curIndex = visitedViews.value.findIndex((v)=>v.path == view.path);
     if(curIndex==-1){
        return;
     }   
     visitedViews.value = visitedViews.value.filter((v,i)=>{
        if(i>=curIndex){
            return true;
        }
        if(v.affix){
            return true;
        }
        return false;
     })
    }
    /**
     * 删除右边
     * @param {*} view 
     */
    const delRight = (view)=>{
        const curIndex = visitedViews.value.findIndex((v)=>v.path==view.path);
        if(curIndex==-1){
            return;
         }   
         visitedViews.value = visitedViews.value.filter((v,i)=>{
            if(i<curIndex){
                return true;
            }
            if(v.affix){
                return true;
            }
            return false;
         })
    }
    /**
     * 刷新
     * @param {*} view 
     */
    const refresh = (view)=>{
        const v = visitedViews.value.find((v)=>v.path == view.path);
        Object.assign(v,view);
    }
    /**
     * 关闭所有
     */
    const delAll = ()=>{
        visitedViews.value = visitedViews.value.filter(v=>v.affix);
    }


    return{
        visitedViews,
        addVisitedView,
        removeVisitedView,
        delLeft,
        removeOther,
        delRight,
        delAll,
        refresh
    }
})