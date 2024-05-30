import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/views/layout/index.vue';
import { keepAliveStore } from '@/stores/keepAliveStore';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Layout,
        redirect: '/module',
        name: 'Layout',
        meta: {
            keepAlive: true
        },
        'children': [
            {
                'name': 'module',
                'path': 'module',
                meta: {
                    keepAlive: true
                },
                component: () => import('@/views/module/index.vue'),
                'children': []
            },
            {
                'name': 'test',
                'path': 'test',
                meta: {
                    keepAlive: true
                },
                component: () => import('@/views/test/index.vue'),
                'children': []
            },
            {
                'name': 'template',
                'path': 'template',
                meta: {
                    keepAlive: true
                },
                component: () => import('@/views/template/index.vue'),
                'children': []
            },
            {
                'name': 'templateCenter',
                'path': 'templateCenter',
                meta: {
                    keepAlive: true
                },
                component: () => import('@/views/templateCenter/index.vue'),
                'children': []
            }
        ]
    }, {
        'name': 'design',
        'path': '/design',
        component: () => import('@/views/design/index.vue'),
        'children': []
    },
    {
        'name': 'providerSetting',
        'path': '/providerSetting',
        meta: {
            keepAlive: true
        },
        component: () => import('@/views/module/field-setting/provider-setting.vue')
    },
    {
        'name': 'previewData',
        'path': '/previewData',
        meta: {
            keepAlive: true
        },
        component: () => import('@/views/module/preview-data/preview-data.vue')
    }
    // ,
    // {
    //   path: '/login',
    //   name:"Login",
    //   component:() => import('@/views/Login/index.vue'),
    //   children:[]
    // }
];
export const initRouter = (routers: any, path: any) => {
    routers.forEach((route: any) => {
        if (route.meta && route.meta.component) {
            route.component = loadView(route.meta.component);
        } else {
            route.component = Layout;
        }
        if (path) {
            path === '/'
                ? route.meta.url = path + route.path
                : route.meta.url = path + '/' + route.path;
        }
        if (route.children != undefined && route.children.length > 0) {
            initRouter(route.children, route.path);
        }
    });
};
const loadView = (view: string) => {
    return () => import(`@/views/${view}.vue`);
};
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, _form, next) => {
    const useKeepAliveStore = keepAliveStore();

    const meta = to.meta || {};
    // 加入缓存队列
    if (meta.keepAlive) {
        console.log(to.name);
        useKeepAliveStore.setKeepAlive(to.name);
    }

//   if(to.path !== '/login'){ // 不在登录页面时
//     if(localStorage.getItem('v3-element-plus-token')){
//       // 判断登录状态  存在token
//
//     }
//     }else{
//       window.localStorage.clear()
//       router.push({path:'/login'})
//     }
//   }else{  // 登录页面
    next();
//   }
});

export default router;
