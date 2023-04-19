// index.js
// 获取应用实例
const app = getApp()
// 引入SDK核心类，js文件根据自己业务，位置可自行放置
const { mapKey, storageKey } = require('../../config/index')
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
var qqmapsdk;

Page({
  data: {
    keyword: '',
    oldKeyword: '',
    motto: 'Hello World',
    userInfo: {},
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function(res){
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
    // this.mapCtx.moveToLocation({
    //   longitude: 113.345139,
    //   latitude: 23.128404
    // })
  },
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 0,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude:23.128404,
        longitude:113.345139,
      },
      animationEnd() {
        console.log('animation end')
      }
    })

    // this.mapCtx.addMarkers({
    //   markers: [],
    //   clear: true
    // })
  },
  includePoints: function() {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude:23.10229,
        longitude:113.3345211,
      }, {
        latitude:23.00229,
        longitude:113.3345211,
      }]
    })
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: mapKey
    });
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  // 输入框输入
  handleInputChange(e) {
    var that = this
    this.setData({
      keyword: e.detail.value
    })
    setTimeout(() => {
      qqmapsdk.getSuggestion({
          keyword: e.detail.value,
          success:function(res) {
            console.log('输入提示',res);
          }
        })
    },1000)
  },
  handleGetMapLocation() {
    const { keyword } = this.data
    if (!this.data.oldKeyword) {
      this.setData({
        'oldKeyword': keyword
      })
      console.log('this.data.old',this.data.oldKeyword);
    }
    var that = this
    const searchList = wx.getStorageSync(storageKey)
    if (searchList && this.data.oldKeyword === keyword) {
      console.log('searchList',searchList);
      return 
    }
    // 调用接口
    qqmapsdk.search({
      keyword,
      region: '广州',
      success: function (res) {
          console.log(res);
          wx.setStorageSync(storageKey, res.data)
          return res.data
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
        that.setData({
          oldKeyword: ''
        })
      }
    });
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
