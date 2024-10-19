import { ElMessage } from "element-plus";
const showMessage = (message,callback,type)=>{
    ElMessage({
        message,
        type,
        onClose:()=>{
            if(callback){
                callback();
            }
        }
    })
}
export default {
    error:(message,callback)=>{
        showMessage(message,callback,'error');
    },
    warning:(message,callback)=>{
        showMessage(message,callback,'warning');
    },
    success:(message,callback)=>{
        showMessage(message,callback,'success');
    },
}