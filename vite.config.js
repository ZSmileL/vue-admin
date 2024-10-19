import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { visualizer } from 'rollup-plugin-visualizer';


const pathSrc = resolve(__dirname,"src");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      //指定需要缓存的图标文件夹
      iconDirs:[resolve(pathSrc, 'assets/svg-icons')],
      //指定symbolId格式
      symbolId:'icon-[dir]-[name]'
    }),
    visualizer({
      emitFile: false,
      file: "state.html",
      open: true
    })
  ],
  resolve:{
    //路径别名
    alias:{
      "@": pathSrc
    }
  },
  css:{
    preprocessorOptions:{
      scss:{ 
        additionalData:`@use "@/styles/variables.scss" as * ;`,
        javascriptEnabled:true
      }
    }
  },
  server:{
    port: 3003,
    open: true,
    hmr: true,
    proxy:{
      "/dev-api":{
        //接口地址
        target:"http://localhost:8989",
        rewrite:(path)=>path.replace(/^\/dev-api/,""),
      }
    }
  },
  // build:{
  //   outDir: 'dist1'
  // }
})
