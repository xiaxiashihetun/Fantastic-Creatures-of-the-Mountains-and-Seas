// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象
var eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 30.468743, lng: 116.499464, alt: 67446, heading: 0, pitch: -45 }
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
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
  // map.on(mars3d.EventType.removeLayer, function (event) {
  //   console.log("移除了图层", event)
  // })
  map.scene.globe.terrainExaggeration = 13 // 修改地形夸张程度
  // 创建DIV数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    // event.stopPropagation()
    console.log("监听layer，单击了矢量对象", event)
  })
  //showDraw()

  addDemoGraphic1(graphicLayer)
  addDemoGraphic3(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
  // graphicLayer.remove()
  // graphicLayer = null
}

 

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.DivGraphic({
    position: [116.741611, 31.408068, 75.5],
    style: {
      html: `<div class="marsBlackPanel  animation-spaceInDown">
              <div class="marsBlackPanel-text">大湖名城,创新高地</div>
          </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      //distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 400000), // 按视距距离显示
      //scaleByDistance:true,
      clampToGround: false,//贴地显示
      // 高亮时的样式
      highlight: {
        // type: mars3d.EventType.click,
        className: "marsBlackPanel-highlight"
      }
    },
    attr: { remark: "示例1" }
  })
  //graphicLayer.addGraphic(graphic)
  graphic.addTo(graphicLayer)
}


function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.DivGraphic({
    position: [116.960075, 31.19609, 237.4],
    style: {
      html: `<div class="marsGreenGradientPnl" >安徽欢迎您</div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      scaleByDistance:true
      // 高亮时的样式
      // highlight: {
      //   type: mars3d.EventType.click,
      //   className: "marsGreenGradientPnl-highlight"
      // }
    },
    attr: { remark: "示例3" }
  })
  //graphicLayer.addGraphic(graphic)
  graphic.addTo(graphicLayer)
  // 在指定时间范围显示对象 0-10，20-30,40-max
  const now = map.clock.currentTime
  graphic.availability = [
    { start: now, stop: Cesium.JulianDate.addSeconds(now, 10, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 20, new Cesium.JulianDate()), stop: Cesium.JulianDate.addSeconds(now, 30, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 40, new Cesium.JulianDate()), stop: "2999-01-01 00:00:00" }
  ]
}


function removeLayer() {
  if (graphicLayer) {
    graphicLayer.clear()
    map.removeLayer(graphicLayer, true)
    graphicLayer = null
  }
  if (tilesetLayer) {
    map.removeLayer(tilesetLayer, true)
    tilesetLayer = null
  }
}

/**
 * 平台通过draw标绘后保存的geojosn数据（已经内置style了，无需配置symbol）
 */
// function showDraw(isFlyTo) {
//   removeLayer()

//   graphicLayer = new mars3d.layer.GeoJsonLayer({
//     name: "标绘示例数据",
//     url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
//     popup: "{type} {name}",
//     queryParameters: {
//       token: "mars3d" // 可以传自定义url参数，如token等
//     },
//     symbol: {
//       merge: true,
//       styleOptions: {
//         // 高亮时的样式
//         highlight: {
//           type: "click",
//           opacity: 0.9
//         }
//       }
//     },
//     flyTo: isFlyTo
//   })
//   map.addLayer(graphicLayer)

//   // load事件,必须在load完成前绑定才能监听
//   graphicLayer.on(mars3d.EventType.load, function (event) {
//     if (event.layer) {
//       console.log("数据加载完成", event)
//     }
//   })

//   setTimeout(() => {
//     // readyPromise是可以load加载数据完成后去获取
//     graphicLayer.readyPromise.then(function (layer) {
//       console.log("readyPromise:数据加载完成", layer)
//     })
//   }, 5000)

//   // 单击事件
//   graphicLayer.on(mars3d.EventType.click, function (event) {
//     console.log("单击了图层", event)
//   })
// }

/**
 * 点数据
 */
function showPoint() {
  removeLayer()

  window._test_button_click = function (attr) {
    globalAlert(JSON.stringify(attr), "测试查看详情")
  }

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "体育设施点",
    url: "//data.mars3d.cn/file/geojson/hfty-point.json",
    symbol: {
      styleOptions: {
        image: "../img/marker/mark-red.png",
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scale: 1,
        scaleByDistance: true,
        scaleByDistance_far: 20000,
        scaleByDistance_farValue: 0.5,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        // setHeight: 5000, //指定高度
        label: {
          text: "{项目名称}",
          font_size: 25,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -25,
          scaleByDistance: true,
          scaleByDistance_far: 80000,
          scaleByDistance_farValue: 0.5,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 80000,
          distanceDisplayCondition_near: 0
        }
      }
    },
    popup: [
      { field: "项目名称", name: "项目名称" },
      { field: "建设性质", name: "建设性质" },
      { field: "设施级别", name: "设施级别" },
      { field: "所属区县", name: "所属区县" },
      { field: "建筑内容及", name: "建筑内容" },
      { field: "新增用地（", name: "新增用地" },
      { field: "开工", name: "开工" },
      { field: "总投资（万", name: "总投资" },
      { field: "资金来源", name: "资金来源" },
      { field: "初步选址", name: "初步选址" },
      { field: "设施类型", name: "设施类型" },
      { field: "设施等级", name: "设施等级" },
      { field: "所在区县", name: "所在区县" },
      { field: "具体位置", name: "具体位置" },
      { field: "建设内容（", name: "建设内容" },
      { field: "用地面积（", name: "用地面积", format: "mars3d.MeasureUtil.formatArea" },
      { field: "设施规模（", name: "设施规模" },
      { field: "举办者类型", name: "举办者类型" },
      { field: "开工时间", name: "开工时间" },
      { field: "总投资额（", name: "总投资额", unit: "亿元" },
      { field: "项目推进主", name: "项目推进主体" },
      { field: "项目进度", name: "项目进度" },
      { field: "项目来源", name: "项目来源" },
      { field: "备注", name: "备注" },
      { name: "详情", type: "button", className: "mars3d-popup-btn-custom", callback: "_test_button_click" }
    ],
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

/**
 * 全国省界
 */
function showChinaLine() {
  removeLayer()

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "全国省界",
    url: "//data.mars3d.cn/file/geojson/areas/100000_full.json",
    //url: "./json/ceshi_FeaturesToJSON.json",
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
          // image: "../img/textures/line-arrow-blue.png",
          // color: "#1a9850",
          // mixt: true,
          // speed: 20,
          // repeat: new Cesium.Cartesian2(5, 1)
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

// 简化geojson的坐标
function simplifyGeoJSON(geojson) {
  try {
    geojson = turf.simplify(geojson, { tolerance: 0.0001, highQuality: true, mutate: true })
  } catch (e) {
    //
  }
  return geojson
}

/**
 * 显示合肥区域面
 */
function showRegion() {
  removeLayer()

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "合肥市",
    //url: "//data.mars3d.cn/file/geojson/areas/340100_full.json",
    url: "./json/hefei_FeaturesToJSON1.json",
    symbol: {
      styleOptions: {
        fill: true,
        randomColor: true, // 随机色
        opacity: 0.3,
        outline: true,
        outlineStyle: {
          color: "#FED976",
          width: 3,
          opacity: 1
        },
        // 高亮时的样式
        highlight: {
          opacity: 0.9,
          outlineStyle: {
            width: 6,
            color: "#ff0000",
            addHeight: 100
          },
          label: { show: true }
        },
        label: {
          show: false,
          // 面中心点，显示文字的配置
          text: "{name}", // 对应的属性名称
          opacity: 1,
          font_size: 40,
          color: "#ffffff",

          font_family: "楷体",
          outline: true,
          outlineColor: "#000000",
          outlineWidth: 3,

          background: false,
          backgroundColor: "#000000",
          backgroundOpacity: 0.1,

          font_weight: "normal",
          font_style: "normal",

          scaleByDistance: true,
          scaleByDistance_far: 20000000,
          scaleByDistance_farValue: 0.1,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1,

          distanceDisplayCondition: false,
          distanceDisplayCondition_far: 10000,
          distanceDisplayCondition_near: 0,
          visibleDepth: false
        }
      }
    },
    popup: "{name}",
    // "tooltip": "{name}",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 规划面
function showPlanningSurface() {
  removeLayer()

  map.setCameraView({ lat: 31.591382, lng: 120.718945, alt: 784, heading: 279, pitch: -67 })

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    id: 1987,
    name: "用地规划",
    // 1.支持URL
    url: "//data.mars3d.cn/file/geojson/guihua.json",
    // 2.也支持直接传入数据
    // data: {
    //   type: "FeatureCollection",
    //   name: "用地规划",
    //   features: [] //数据已省略，可以从上面guihua.json中复制
    // },
    symbol: {
      type: "polygonC",
      styleOptions: {
        opacity: 0.6,
        color: "#0000FF"
      },
      styleField: "类型",
      styleFieldOptions: {
        一类居住用地: { color: "#FFDF7F" },
        二类居住用地: { color: "#FFFF00" },
        社区服务用地: { color: "#FF6A38" },
        幼托用地: { color: "#FF6A38" },
        商住混合用地: { color: "#FF850A" },
        行政办公用地: { color: "#FF00FF" },
        文化设施用地: { color: "#FF00FF" },
        小学用地: { color: "#FF7FFF" },
        初中用地: { color: "#FF7FFF" },
        体育场用地: { color: "#00A57C" },
        医院用地: { color: "#A5527C" },
        社会福利用地: { color: "#FF7F9F" },
        商业用地: { color: "#FF0000" },
        商务用地: { color: "#7F0000" },
        营业网点用地: { color: "#FF7F7F" },
        一类工业用地: { color: "#A57C52" },
        社会停车场用地: { color: "#C0C0C0" },
        通信用地: { color: "#007CA5" },
        排水用地: { color: "#00BFFF" },
        公园绿地: { color: "#00FF00" },
        防护绿地: { color: "#007F00" },
        河流水域: { color: "#7FFFFF" },
        配建停车场: { color: "#ffffff" },
        道路用地: { color: "#ffffff" }
      }
    },
    popup: "类型:{类型}"
    // flyTo: true,
  })
  map.addLayer(graphicLayer)

  // 下面代码演示如果再config.json中配置的图层，如何绑定额外事件方法
  // 绑定config.json中对应图层配置的"id"值图层的单击事件（比如下面是id:1987对应图层）
  const layerTest = map.getLayerById(1987)
  // 绑定事件
  layerTest.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })

  layerTest.on(mars3d.EventType.click, function (event) {
    // 单击事件
    console.log("单击了图层", event)
  })
}

/**
 * 立体建筑物
 */
function showBuilding() {
  removeLayer()

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "建筑物面",
    url: "//data.mars3d.cn/file/geojson/buildings-demo.json",
    symbol: {
      styleOptions: {
        color: "#0d3685",
        outlineColor: "#0d3685",
        opacity: 0.8
      },
      callback: function (attr, styleOpt) {
        const diffHeight = Number(attr.floors || 1) * Number(attr.flo_height)
        return { height: 0, diffHeight }
      }
    },
    center: { lat: 31.928659, lng: 120.420654, alt: 838, heading: 344, pitch: -42 },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
}

/**
 *  分层分户立体建筑物
 */
function showFloor() {
  removeLayer()

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "分层分户建筑物面",
    url: "//data.mars3d.cn/file/geojson/huxing.json",
    symbol: {
      styleOptions: {
        color: "#ffffff",
        opacity: 0.2,
        outline: true,
        outlineColor: "#63AEFF",
        outlineOpacity: 0.3,

        highlight: {
          type: "click",
          color: "#00ffff",
          opacity: 0.6
        }
      },
      callback: function (attr, styleOpt) {
        const flrH = attr.floorh || 0 // 底面高度
        const lyrH = attr.layerh || 0 // 楼层高度

        return { height: flrH, diffHeight: lyrH }
      }
    },
    // popup: "all",
    center: { lat: 31.821524, lng: 117.179329, alt: 255, heading: 25, pitch: -48 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
}

/**
 * 行政区划 ，转为wall显示
 */
function showBoundaryWall() {
  removeLayer()

  map.setCameraView({ lat: 30.561661, lng: 117.663884, alt: 113078, heading: 346, pitch: -43 })

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "合肥市",
    url: "//data.mars3d.cn/file/geojson/areas/340100_full.json",
    symbol: {
      type: "wall",
      styleOptions: {
        diffHeight: 5000, // 墙高
        materialType: mars3d.MaterialType.LineFlow,
        materialOptions: {
          color: "#00ffff", // 颜色
          opacity: 0.6, // 透明度
          image: "img/textures/fence.png", // 图片
          repeatX: 1, // 重复数量
          axisY: true, // 竖直方向
          speed: 10 // 速度
        },
        // 高亮时的样式
        highlight: {
          type: "click",
          color: "#ffff00"
        }
      }
    },
    popup: "{name}"
    // "tooltip": "{name}",
    // flyTo: true,
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

/**
 * 显示特殊面数据（单体化）
 */
let tilesetLayer
function showMonomer() {
  removeLayer()

  // 三维模型
  if (!tilesetLayer) {
    tilesetLayer = new mars3d.layer.TilesetLayer({
      name: "文庙",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
      position: { alt: 38.8 },
      maximumScreenSpaceError: 1,
      show: true
    })
    map.addLayer(tilesetLayer)
  }

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "文庙-单体化",
    url: " //data.mars3d.cn/file/geojson/dth-wm.json",
    symbol: {
      type: "polygonP",
      styleOptions: {
        // 单体化默认显示样式
        color: "rgba(255, 255, 255, 0.01)",
        clampToGround: true,
        classification: true,
        // 单体化鼠标移入或单击后高亮的样式
        highlight: {
          // type: mars3d.EventType.click,
          color: "rgba(255,255,0,0.4)"
        }
      }
    },
    popup: [
      { field: "name", name: "房屋名称" },
      { field: "jznf", name: "建造年份" },
      { field: "ssdw", name: "所属单位" },
      { field: "remark", name: "备注信息" }
    ],
    center: { lat: 33.589442, lng: 119.031613, alt: 254, heading: 5, pitch: -37 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
}

/**
 * 显示世界各国
 */
function showWorld() {
  removeLayer()

  map.setCameraView({ lat: 22.564341, lng: 89.44688, alt: 10817167, heading: 0, pitch: -87 })

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "国界线",
    url: "//data.mars3d.cn/file/geojson/world.json",
    symbol: {
      type: "polygonP",
      styleOptions: {
        fill: true,
        // color: '#ffffff',
        // opacity: 0.01,
        randomColor: true,
        opacity: 0.5,

        // 高亮时的样式
        highlight: {
          type: "click",
          color: "#ffff00"
        }
      },
      styleField: "name",
      styleFieldOptions: {
        Russia: { clampToGround: true }
      }
    },
    popup: "{name} {name_cn}"
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 加载GCJ数据进行纠偏
function showGCJ02Data() {
  removeLayer()

  const gcjLayer = new mars3d.layer.GeoJsonLayer({
    name: "纠偏前",
    url: "//data.mars3d.cn/file/geojson/areas/340303.json",
    symbol: {
      styleOptions: {
        fill: false,
        outline: true,
        outlineStyle: {
          color: "#FF0000",
          width: 3
        }
      }
    },
    popup: "纠偏前GCJ02坐标"
  })
  map.addLayer(gcjLayer)

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "纠偏后",
    url: "//data.mars3d.cn/file/geojson/areas/340303.json",
    chinaCRS: mars3d.ChinaCRS.GCJ02, // 标识数据坐标，内部会纠偏
    symbol: {
      styleOptions: {
        fill: false,
        outline: true,
        outlineStyle: {
          color: "#00ffff",
          width: 3
        }
      }
    },
    popup: "纠偏后WGS坐标",
    flyTo: true
  })
  map.addLayer(graphicLayer)
}

var my_switch = true;
function LoadMounts(mount_type){
  //removeLayer()
  graphicLayer.clear()
  if(my_switch==true){
      $.ajax({
          url: 'http://localhost:5500/search_mounts',
          type: 'get',
          dataType: 'json',
          data: {//传进去的
              type:mount_type
          }, // Pass the parameter here
          success: function (data) {//返回结果在data里 数据返回成功之后要干什么
            $.each(data, function (index, item) {
              addDemoGraphic(graphicLayer,item)
            });

          }
      }); 
  }else{
      tbodydata ='';
      $.get('../json/课程.json',{},function(data){
          creatTable(data);
          console.log(data[0]["课程名"]);
          function creatTable(data){
           //这个函数的参数data是字符串数组，可以是从后台传过来的也可以是从其他任何地方传过来的
          tbodydata = "<div class='box_contain'>";
          for (var i=0;i<8;i++) {	
              tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+data[i]["课程ID"]+".jpg' alt='"+data[i]["课程ID"]+".jpg' onclick='show_product("+data[i]["课程ID"]+",1)'>"+
                "<div class = 'name_img'><p>"+data[i]["课程名"]+"</p>"+
                 	"<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+data[i]["objectid"]+"' onclick='add_product("+data[i]["课程ID"]+",1)'></div></div>";
                if(i == 3){
                  tbodydata+="</div>";
                  tbodydata+="<div class='box_contain'>";
              }
              if(i == 7){
                  tbodydata+="</div>";
              }
          }
            //现在tableData已经生成好了，把他赋值给上面的tbody
            $("#type4").html(tbodydata);
          }		
      });
  }
}


// function MountData(data){
//   console.log(333);
//   var tbodydata = '';
//   //tbodydata = "<div class='box_contain'>";
//   $.each(data, function (index, item) {
//       // tbodydata +="<div class='pic_box'>"+"<img src='../MiaoXiu_Image/"+item.课程id+".jpg' alt='"+item.课程id+".jpg' onclick='show_product("+item.课程id+",1)'>"+
//       // "<div class = 'name_img'><p>"+item.课程名+"</p>"+
//       // "<img src='../imgs/购物车.png' class='add-to-cart' alt='Image' item_id='"+item.objectid+"' onclick='add_product("+item.课程id+",1)'></div></div>";
//       // if(index == 3){
//       //     tbodydata+="</div>";
//       //     tbodydata+="<div class='box_contain'>";
//       // }
//       // if(index == 7){
//       //     tbodydata+="</div>";
//       // }

//   });
//   return tbodydata;
// }
// function MountData(){
// }


 


function addDemoGraphic(graphicLayer,item){
    var name;
    name = item.名字;
    const graphic = new mars3d.graphic.DivGraphic({  
      position: [item.经度, item.纬度],  
      style: {  
        html: `  
        <div class=".image-container">    
          <img src="../img/3d_point/样式1.png" class="graphic-image" alt="Graphic Image" width="50" height="100"/>    
          <div class="text-on-image ">    
            ${name}    
          </div>    
        </div> 
        `,  
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 通常图片居中显示时设置为CENTER  
        verticalOrigin: Cesium.VerticalOrigin.CENTER,  
        clampToGround: true,  
        pixelOffset: new Cesium.Cartesian2(0, -25), // 可能需要调整这个值来确保文字在图片内部或上方  
        // 其他样式...  
      },  
    attr: { remark: "示例1" }
  })
  //graphicLayer.addGraphic(graphic)
  graphic.addTo(graphicLayer)
}

// 获取所有的.image-with-text元素  
var elements = document.querySelectorAll('.image-with-text');  
  
// 遍历所有元素，除了第一个，都设置为inactive  
elements.forEach(function(element, index) {  
  if (index < elements.length && index != 0) {  
    element.classList.add('inactive');  
    element.classList.remove('active'); // 如果之前有active类的话  
  } else {  
    // 第一个元素设置为active  
    element.classList.add('active');  
    element.classList.remove('inactive'); // 移除可能存在的inactive类  
  }  
});  
  
// 如果需要，你还可以为每个元素添加点击事件监听器来切换状态  
elements.forEach(function(element) {  
  element.addEventListener('click', function() {  
    // 移除所有元素的active类  
    elements.forEach(function(el) {  
      el.classList.remove('active');  
      el.classList.add('inactive');
      el.querySelector('img').src = '../img/3d_point/滑动图标2.png'
    });  
    this.classList.remove('inactive');
    // 添加当前元素的active类  
    this.classList.add('active');  
    this.querySelector('img').src = '../img/3d_point/滑动图标1.png'
      
    // 你可以在这里添加逻辑来更改图片的src或文本的内容  
    // 例如：this.querySelector('img').src = '新图片的URL';  
    // 或者：this.querySelector('.text-on-image').textContent = '新的文本内容';  
  });  
});

document.addEventListener('DOMContentLoaded', function() {    
  const searchForm = document.getElementById('searchForm');    
  searchForm.addEventListener('submit', function(event) {    
    event.preventDefault(); // 阻止表单的默认提交行为    
        
    // 获取搜索框中的值    
    const searchTerm = document.getElementById('searchTerm').value;  

    // 发送GET请求到/get_mountains，并附带查询参数    
    $.ajax({
      url: 'http://localhost:5500/get_mountains',
      type: 'get',
      dataType: 'json',
      data: {//传进去的
          name:searchTerm
      }, // Pass the parameter here
      success: function (data) {//返回结果在data里 数据返回成功之后要干什么
        console.log(data)
        graphicLayer.clear()
        $.each(data, function (index, item) {
          addDemoGraphic(graphicLayer,item)
        });

      },
      error: function (jqXHR, textStatus, errorThrown) {  
        // 请求失败时的处理  
        console.error('Request failed: ' + textStatus, errorThrown);  
      }  
  });    
  });    
});







