export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/building/index',
    'pages/alarm/index',
    'pages/video/index',
    'pages/task/index',
    'pages/alarm-detail/index',
    'pages/video-detail/index',
    'pages/handover/index',
    'pages/scan-bind/index',
    'pages/task-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1E5AA8',
    navigationBarTitleText: '安保巡场助手',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#1E5AA8',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页总览'
      },
      {
        pagePath: 'pages/building/index',
        text: '楼栋列表'
      },
      {
        pagePath: 'pages/alarm/index',
        text: '告警处置'
      },
      {
        pagePath: 'pages/video/index',
        text: '视频查看'
      },
      {
        pagePath: 'pages/task/index',
        text: '我的任务'
      }
    ]
  }
})
