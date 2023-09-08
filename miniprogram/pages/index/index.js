// index.js
// const app = getApp()

const {
  envList
} = require('../../envList.js');

Page({
  data: {
    showUploadTip: false,
    powerList: [{
      title: '哈融',"goDate": "2023-09-09 10:43:45",
      tip: '拼车，150/人',
      showItem: false,
      item: [{
        title: '240/人',
        page: 'deployService'
      }]
    }, {
      title: '庙香山',"goDate": "2023-09-09 10:43:45",
      tip: '拼车 ，40/人',
      showItem: false,
      item: [{
        title: '40/人',
        page: 'deployService'
      }]
    },
    {
      "driver": "bym",
      "phone": "17746569901",
      "wxNumber": "bym123456",
      "origin": "景阳大路和平大街",
      "dest": "庙香山滑雪场",
      "equipmentNumber": 2,
      "peopleNumber": 3,
      "goDate": "2023-09-09 10:43:45",
      "remake": "无",
      "status": 0,
      "createDate": "2023-09-06 10:43:52"
  },
    , {
      title: '北大壶',"goDate": "2023-09-09 10:43:45",
      tip: '拼车 ，120/人',
      showItem: false,
      item: [{
        title: '140/人',
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
    wx.request({
      url: 'http://localhost:9090/hspTest/test',
      method:'GET',
      header:{
        'X-LC-Id': 'wx65a42d756d96b14f', 
        'X-LC-Key': ' 自己的key', 
        'Content-Type': ' application/json'
      },
      // data:{
      //   "name":"张无忌",
      //   "score":80,
      //   "gender":1
      // },
      success:(res)=>{
        console.log(res);
      }
    })
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