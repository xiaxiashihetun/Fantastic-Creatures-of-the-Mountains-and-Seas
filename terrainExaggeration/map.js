// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 32.086616, lng: 118.731447, alt: 97704, heading: 244, pitch: -22 }
  },
  basemaps: [
    {
      name: "ArcGIS影像",
      icon: "/img/basemaps/esriWorldImagery.png",
      type: "xyz",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      show: true,
      enablePickFeatures: false
    }
  ],
  layers:[
    {
      "pid": 3030,
      "type": "geojson",
      "name": "中国省界",
      "url": "{dataServer}/file/geojson/areas/100000_full.json",
      "symbol": {
        "type": "polylineP",
        "styleOptions": {
          "color": "#ffffff",
          "width": 2,
          "opacity": 0.8,
          "label": {
            "text": "{name}",
            "position": "center",
            "font_size": 30,
            "color": "#ffffff",
            "outline": true,
            "outlineColor": "#000000",
            "scaleByDistance": true,
            "scaleByDistance_far": 60000000,
            "scaleByDistance_farValue": 0.2,
            "scaleByDistance_near": 1000000,
            "scaleByDistance_nearValue": 1,
            "distanceDisplayCondition": true,
            "distanceDisplayCondition_far": 12000000,
            "distanceDisplayCondition_near": 0
          }
        }
      },
      "show": false,
      "flyTo": false
    },
  ]

}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  map.scene.globe.terrainExaggeration = 10 // 修改地形夸张程度
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

/**
 * 地形夸张程度改变
 * @param {number} val 默认值1.0
 * @returns {void}
 */
function changeTerrain(val) {
  map.scene.globe.terrainExaggeration = val
}

function mapFlyToPoint() {
  map.flyToPoint([113.939351, 36.068144, 350.9], { radius: 50000 })
}

function mapSetCameraView() {
  map.setCameraView({ lat: 26.8764, lng: 91.148781, alt: 223798, heading: 0, pitch: -45 })
}


function showChinaLine() {
  removeLayer()

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "全国省界",
    //url: "//data.mars3d.cn/file/geojson/areas/100000_full.json",
    url: "./json/ceshi_FeaturesToJSON.json",
    format: simplifyGeoJSON, // 用于自定义处理geojson
    symbol: {
      type: "polylineP",
      styleOptions: {
        width: 2,
        materialType: mars3d.MaterialType.LineFlow,
        materialOptions: {
          color: "#00ffff",
          image: "img/textures/fence-line.png",
          speed: 10,
          repeat_x: 10
        },
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 12000000,
        distanceDisplayCondition_near: 100000,
        label: {
          text: "{name}",
          position: "{center}", // 省会位置center
          font_size: 30,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          scaleByDistance: true,
          scaleByDistance_far: 60000000,
          scaleByDistance_farValue: 0.2,
          scaleByDistance_near: 1000000,
          scaleByDistance_nearValue: 1,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 10000000,
          distanceDisplayCondition_near: 100000,
          setHeight: 10000
        }
      }
    },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
}
