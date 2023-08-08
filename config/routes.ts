export default [
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Index' },
  { path: '/interface_info/:id', name: '查看接口', icon: 'smile', component: './InterfaceInfo', hideInMenu: true},
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin', // 权限控制
    routes: [
      { name: '接口管理', icon: 'table', path: '/admin/interface', component: './Admin/InterfaceInfo' },
    ],
  },
  // { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
