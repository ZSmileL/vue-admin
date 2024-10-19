<template>
    <div class="editor-container">
        <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="default"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="default"
        @onCreated="handleCreated"
      />
    </div>
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Toolbar, Editor} from '@wangeditor/editor-for-vue'
import {ref, reactive, shallowRef, onBeforeUnmount} from 'vue'
const editorRef = shallowRef();
const valueHtml = ref("");
const toolbarConfig = reactive({

})
const editorConfig ={
  placeholder:"请输入内容",
  MENU_CONF:{
    // color:{
    //   colors:['#666']
    // },
    // bgColor:{
    //   colors:['#666']
    // },
  }
}
editorConfig.MENU_CONF['color'] = {
    colors: ['#bbb', '#333', '#666']
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
    })
const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！

    }
</script>

<style lang="scss" scoped>

</style>