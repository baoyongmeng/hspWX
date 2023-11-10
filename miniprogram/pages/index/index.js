// index.js
// const app = getApp()

const {
  envList
} = require('../../envList.js');
var http = require("../../common/http");  //引入

Page({
  data: {
    showUploadTip: false,
    shows: true,
    powerList: [{
      dest: '哈融',
      origin: '景阳大路和平大街',
      goDate: "2023-09-09 10:43:45",
      equipmentNumber: "2",
      peopleNumber: "2",
      driver: "包子",
      phone: "17746569901",
      showItem: false,
      remake: '240/人',
      item: [{
        page: 'deployService'
      }]
    }, {
      dest: '庙香山',
      "goDate": "2023-09-09 10:43:45",
      tip: '拼车 ，40/人',
      showItem: false,
      remake: '40/人',
      equipmentNumber: "2",
      peopleNumber: "2",
      driver: "包子",
      phone: "17746569901",
      item: [{
        remake: '40/人',
        page: 'deployService'
      }]
    }, {
      dest: '北大壶',
      "goDate": "2023-09-09 10:43:45",
      tip: '拼车 ，120/人',
      showItem: false,
      remake: '140/人',
      equipmentNumber: "2",
      peopleNumber: "2",
      driver: "包子",
      phone: "17746569901",
      item: [{
        remake: '140/人',
        page: 'deployService'
      }]


    }],
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false
  },


  onClickPowerInfo(e) {
    // debugger;
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    };
  },
  onClickShows(e) {
    // debugger;
    var tmp = !this.data.shows;
    var tmp1 = this.data.shows;
    // console.log(e);
    
 
    //调用
    http.get(http.getBroadcastDetailByGroupId, "myData").then((res, err) => {
                console.log(res, err)
                if (res.status) {
                  
                }
            })
    this.setData({
      shows: tmp,
      shows1: tmp1
    });
    wx.hideLoading();
  },
  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        });
      }
      this.setData({
        powerList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });

  }
});