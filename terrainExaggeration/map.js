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


const geoJsonLayer= new mars3d.layer.GeoJsonLayer({
  id: "可以根据此id在其他地方获取该图层",
  url: "../json/ca_outline_FeaturesToJSON.geojson",
  symbol: {
    type: "polyline", // geojson内加载的矢量数据类型
    styleOptions: {
      color: "rgba(255,255,255,0.3)",
      width: 2
    }
  },
  popup: "{name}"
})
//map.addLayer(geoJsonLayer)

const geoJsonLayer2 = new mars3d.layer.GeoJsonLayer({
  url: "//data.mars3d.cn/file/geojson/wuhan-line2.json",
  symbol: {
    type: "polylineC",
    styleOptions: {
      width: 10, // 线宽
      materialType: "PolylineGlow",
      materialOptions: {
        color: "#FF4500",
        opacity: 0.9,
        glowPower: 0.1 // 发光强度
      }
    }
  },
  // popup: "all",
  show: true
})
map.addLayer(geoJsonLayer2)
