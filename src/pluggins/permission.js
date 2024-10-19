import router from "../router";
import { useUserStore, usePermissionStore } from "../store";
export function setupPermission(){
    const white = ['/login'];
    router.beforeEach(async (to,from,next)=>{
        const hasToken = localStorage.getItem('token');
        if(hasToken){
            //有token
            if(to.path==='/login'){
                next({path:'/'});
            }else{
                const userStore = useUserStore();
                const roles = userStore.user.roles;
                if(roles&&roles.length>0){
                   //有权限
                   if(to.matched.length===0){
                    //没有路由与之匹配，路由不存在
                    from.name?next(from):next({path:'/404'});
                   }else{
                    next();
                   }
                }else{
                    const permissionStore = usePermissionStore(); 
                    //userStore的user没权限
                    try {
                        //获取权限
                        
                     const {roles} = await userStore.getUserInfo();
                     //获取动态路由
                     const accessRoute = await permissionStore.generateRoutes(roles);
                    //  console.log(accessRoute)
                     //将动态路由添加到路由中
                     accessRoute.forEach((item)=>{
                        router.addRoute(item);
                     })
                     next({...to});
                    } catch (error) {
                        console.log(error)
                        //清除token跳到login
                        userStore.removeToken();
                        next(`/login?redirect=${to.path}`);
                    }
                }
            }
        }else{
            //没token
            if(white.indexOf(to.path)!==-1){
                    next();
            }else{
                next(`/login?redirect=${to.path}`);
            }
        }
    })
}