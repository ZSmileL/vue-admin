import { useUserStore } from "@/store"
let  num = 0;
//按钮权限
export const hasPerm = {
    mounted(el,binding){
        //拿到当前用户的角色和权限
        const { roles, perms} = useUserStore().user;
        if(roles.includes('ROOT')){
            //超级管理员，有所有权限
            return ;
        }
        //拿到传来的需要验证权限
        const { value } = binding;
        if(value){
            //验证用户是否有这个权限
            const hasPerm = perms.some(perm=>perm==value);
            if(!hasPerm){
                //如果没有，不显示这个el
                el.style.display = 'none';
            }
        }else{
            throw new Error("需要传入待验证权限，如：'sys:user:add'");
        }
    }
}