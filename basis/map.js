// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象,放置山的点位
var graphicLayer_3d 
var tilesetLayer
var eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中
 
// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 15.468743, lng: 118.499464, alt: 2800000, heading: -15, pitch: -65 }
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

  //addDemoGraphic1(graphicLayer)
  //addDemoGraphic3(graphicLayer)
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

function removemodel() {
  map.trackedEntity = null
  if (graphicLayer_3d) {
    map.removeLayer(graphicLayer_3d, true)
    graphicLayer_3d = null
  } 
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
  if (graphicLayer_3d) {
    map.removeLayer(graphicLayer_3d, true)
    graphicLayer_3d = null
  }
}



var my_switch = true;
var shanxi = "";
function LoadMounts(mount_type){
  // removeLayer()
  shanxi = mount_type;
  graphicLayer.clear()
  //map.removeLayer(graphicLayer_3d, true)
  removemodel();
  if(my_switch==true){
      $.ajax({
          url: 'http://172.20.10.2:9936/search_mounts',
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

function LoadCountry(country_type){
  //removeLayer()
  //removeLayer()
  //map.scene.globe.terrainExaggeration = 1 // 修改地形夸张程度
  graphicLayer.clear()
  if(my_switch==true){
      $.ajax({
          url: 'http://172.20.10.2:9936/load_country',
          type: 'get',
          dataType: 'json',
          data: {//传进去的
              type:country_type
          }, // Pass the parameter here
          success: function (data) {//返回结果在data里 数据返回成功之后要干什么
            $.each(data, function (index, item) {
              console.log(item.名字);
              add_country(item);
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


function add_country(item) {
  var d_lng = 0.001;
  var d_lat = 0;
  let num = parseInt(item.经度);
  lng = num + d_lng;
  lat = parseInt(item.纬度);
  graphicLayer_3d = new mars3d.layer.GraphicLayer({
    name: "上海浦东",
    data: [
      {
        type: "modelP",
        position: [lng, lat, 200],
        style: {
          // url: "//data.mars3d.cn/gltf/mars/shanghai/pudong/scene.gltf",
          url: "./my_model/tz1.gltf",
          scale: 650,
          heading: 215
        }
      }
    ],
    //center: { lat: 31.251138, lng: 121.463588, alt: 1729.97, heading: 110.7, pitch: -25, roll: 0.2 },
    popup: item.名字,
    //flyTo: true
  })
  map.addLayer(graphicLayer_3d)

  // 绑定事件
  graphicLayer_3d.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  });


  var name;
  name = item.名字;
  const graphic = new mars3d.graphic.DivGraphic({
  position: [item.经度, item.纬度],
  style: {
    
    html: `  
      <div class=".image-container" onclick="ShowCountry(`+ item.id +`);Move2Coutry(`+item.经度+`,`+ item.纬度+`)">    
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

function Move2Coutry(lng,lat){
  var d_lat = -2.5;
  var d_lng = -0.1;
  var d_heading = 15;
  var d_alt = 35000;
  var d_pitch = 5;
  
  map.setCameraView({ lat: lat+d_lat, lng: lng+d_lng, alt: 10000+d_alt, heading: 0+d_heading, pitch: -10+d_pitch })
}

function ShowCountry(id){
  $.ajax({
    url: 'http://172.20.10.2:9936/search_countryinfo',
    type: 'get',
    dataType: 'json',
    data: {//传进去的
        type:id
    }, // Pass the parameter here
    success: function (data) {//返回结果在data里 数据返回成功之后要干什么
      $.each(data, function (index, item) {
          console.log(item.名字);
          addCountryInfo(item);
      });

    }
});
}


//把信息添加到div并显示
function addCountryInfo(item){

  // 隐藏 id 为 "info" 的 div，并设置新的 HTML 内容
  $("#info").hide();
  $(".jieshao").hide();
  $("#shunxu").hide();
  $("#last").hide();
  $("#next").hide();
  // 修改 <h2> 标签的内容
$("#jd").text("现代解读");
  var country_class = "——"+item.顺序;
  $("#Mount_class").html(country_class);
  $("#Mount_name").html(item.名字);
  var position = "在今";
  if(item.省==null){
    position = "暂无记载";
  }else{
    position += item.省;
    if(item.市!=null){ 
    position += item.市;
    }
  }
  $("#position").html(position);
  $("#feature").html(item.国民特点);
  $("#yw").html(item.原文);
  $("#fy").html(item.翻译);
  var xdjd = `<p class="xdjd">`+item.现代解读+`</p>`;
  $("#yishoubox").html(xdjd);
  // var bd_map = new BMapGL.Map("map");                // 创建地图实例
  // lng = parseFloat(item.经度);
  // lat = parseFloat(item.纬度);
  // var point = new BMapGL.Point(lng, lat); 
  // var marker = new BMapGL.Marker(point);        // 创建标注   
  // bd_map.addOverlay(marker);   
  // bd_map.centerAndZoom(point, 5);                      // 设置地图级别
  // bd_map.enableScrollWheelZoom(true); 
  // bd_map.setMapStyleV2({     
  //   styleId: '6e33d976c728aa940a5926779afb5000'
  // });
  var country_img = `<img src=../img/国家/`+item.id+`.png class = "country_img">`;
  $("#map").html(country_img);
  $("#info").slideDown("slow");

  var element = document.getElementsByClassName('bottom-container')[0];  
  if (element) {  
      element.style.right = "80%";  
  }
  var element2 = document.getElementsByClassName('huadong-container')[0];  
  if (element2) {  
      element2.style.right = "60%";  
  }
}

function addDemoGraphic(graphicLayer,item){
    var name;
    name = item.名字;
    const graphic = new mars3d.graphic.DivGraphic({
    position: [item.经度, item.纬度],
    style: {
      // html: `<div class="marsBlackPanel  animation-spaceInDown">
      //         <div class="marsBlackPanel-text" onclick="Showyishou(`+ item.id + `);ShowInfo(`+ item.id +`);Move2Mount(`+item.经度+`,`+ item.纬度+`)">` 
      //         + name +
      //         `</div>
      //       </div>`,
      html: `  
        <div class=".image-container" onclick="Showyishou(`+ item.id + `);ShowInfo(`+ item.id +`);Move2Mount(`+item.经度+`,`+ item.纬度+`)">    
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

function Move2Mount(lng,lat){
  var d_lat = 0;
  var d_lng = 0;
  var d_heading = 0;
  var d_alt = 0;
  var d_pitch = 0;
  if(shanxi=="东山一经"){
      d_lat = -1.7;
      d_lng = 0.7;
  }
  else if(shanxi=="西山一经"){
    d_lat = -1.7;
    d_lng = 0.7;
    d_alt = 10000
  }
  else if(shanxi=="南山一经"){
    d_lat = -1.7;
    d_lng = 0.7;
  }
  else if(shanxi=="北山一经"){
    d_lat = -1.7;
    d_lng = 0.7;
    d_alt = 130000;
    d_pitch = -25;
  }
  else if(shanxi=="中山一经"){
    d_lat = -1.7;
    d_lng = 0.7;
  }
  map.setCameraView({ lat: lat+d_lat, lng: lng+d_lng, alt: 50000+d_alt, heading: 0+d_heading, pitch: -10+d_pitch })
}

function mapSetViewList_East() {
  // 视角切换（分步执行）, stop设置停留在该视角的时间
  map.setCameraViewList([
    { lng: 119.603673, lat: 27.567127, alt: 1334000, heading: 341.5, pitch: -66.7, duration: 2, stop: 0 },
    // { lng: 119.760718, lat: 28.610673, alt: 529296, heading: 348.3, pitch: -39.2, duration: 1, stop: 0 },
    { lng: 118.694228, lat: 33.007278, alt: 238687.9, heading: 2.4, pitch: -37.3, duration: 2, stop: 0 },
  ])
  //show_first();
  setTimeout(function() {
    show_first();
  }, 4000);
}
function mapSetViewList_West(){
  map.setCameraViewList([
    // { lng: 115.411108, lat: 21.347051, alt: 1422594.6, heading: 358.5, pitch: -40.6, duration: 1, stop: 0 },
    { lng: 102.227112, lat: 24.271745, alt: 1054622, heading: 26.2, pitch: -52.3, duration: 2, stop: 0 },
    { lng: 111.033792, lat: 32.54237, alt: 391493.9, heading: 23.8, pitch: -73.2, duration: 2, stop: 0 }
  ])
  //show_first();
  setTimeout(function() {
    show_first();
  }, 4000);
}

function mapSetViewList_North(){
  map.setCameraViewList([
    // { lng: 115.411108, lat: 21.347051, alt: 1422594.6, heading: 358.5, pitch: -40.6, duration: 1, stop: 0 },
    { lng: 107.826114, lat: 24.158853, alt: 1756981.9, heading: 347.3, pitch: -43.5, duration: 2, stop: 0 },
    { lng: 108.869743, lat: 35.772161, alt: 510467, heading: 345, pitch: -65, duration: 2, stop: 0 }
  ])
  //show_first();
  setTimeout(function() {
    show_first();
  }, 4000);
}

function mapSetViewList_South(){
  map.setCameraViewList([
    // { lng: 115.411108, lat: 21.347051, alt: 1422594.6, heading: 358.5, pitch: -40.6, duration: 1, stop: 0 },
    { lng: 117.72653, lat: 18.573372, alt: 2090263.4, heading: 337.2, pitch: -64.1, duration: 2, stop: 0 },
    { lng: 113.752932, lat: 23.500647, alt: 580498.1, heading: 337.7, pitch: -71.9, duration: 2, stop: 0 }
  ])
  //show_first();
  setTimeout(function() {
    show_first();
  }, 4000);
}

function mapSetViewList_Middle(){
  map.setCameraViewList([
    // { lng: 115.411108, lat: 21.347051, alt: 1422594.6, heading: 358.5, pitch: -40.6, duration: 1, stop: 0 },
    { lng: 116.587903, lat: 24.984845, alt: 1697972.7, heading: 345, pitch: -65, duration: 2, stop: 0 },
    { lng: 111.673706, lat: 33.922938, alt: 181734.9, heading: 336.8, pitch: -60.9, duration: 2, stop: 0 }
  ])
  //show_first();
  setTimeout(function() {
    show_first();
  }, 4000);
}


//传进去的参数id是山的id
//定义全局变量
var mountinfo;
var animal;
var zhiwu;
var have_animal;
var now_shunxu;
function ShowInfo(id){
  if(my_switch==true){
      $.ajax({
          url: 'http://172.20.10.2:9936/search_mountinfo',
          type: 'get',
          dataType: 'json',
          data: {//传进去的
              type:id
          }, // Pass the parameter here
          success: function (data) {//返回结果在data里 数据返回成功之后要干什么
            $.each(data, function (index, item) {
            
               mountinfo = item;
               console.log("请求了mount");
               now_shunxu = item.顺序;
               console.log(now_shunxu);
              addInfo();
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

function Showyishou(id){
  $.ajax({
    url: 'http://172.20.10.2:9936/search_YS',
    type: 'get',
    dataType: 'json',
    data: {//传进去的
        type:id
    }, // Pass the parameter here
    success: function (data) {//返回结果在data里 数据返回成功之后要干什么
      $.each(data, function (index, item) {
        animal = data;
        have_animal = true;
        console.log("请求了animal");
      });
    }
  });
}


//把信息添加到div并显示
function addInfo(){
  console.log(have_animal);
  console.log(mountinfo.名字);
  var yishoudata = "";
  // 隐藏 id 为 "info" 的 div，并设置新的 HTML 内容
  $("#info").hide();
  $(".jieshao").hide();

  $("#shunxu").html(mountinfo.顺序介绍);
  var mount_class = "——《"+mountinfo.所属山系+"》";
  $("#Mount_class").html(mount_class);
  $("#Mount_name").html(mountinfo.名字);
  $("#position").html(mountinfo.位置);
  $("#feature").html(mountinfo.特征);
  $("#yw").html(mountinfo.原文);
  $("#fy").html(mountinfo.翻译);
  $("#last").show();
  $("#next").show();
  $("#shunxu").show();
  var bd_map = new BMapGL.Map("map");                // 创建地图实例
  lng = parseFloat(mountinfo.经度);
  lat = parseFloat(mountinfo.纬度);
  var point = new BMapGL.Point(lng, lat); 
  var marker = new BMapGL.Marker(point);        // 创建标注   
  bd_map.addOverlay(marker);   
  bd_map.centerAndZoom(point, 5);                      // 设置地图级别
  bd_map.enableScrollWheelZoom(true); 
  bd_map.setMapStyleV2({     
    styleId: '6e33d976c728aa940a5926779afb5000'
  });
  if(have_animal == true) {
    $.each(animal, function (index, item) {
      yishoudata +=  
      `<div class='box_contain'>
          <div class='pic_box' onclick="show_yishou(`+item.id+`)">
            <img src='../img/yishou/`+item.id+`.png'>
            <p>`+item.名字+`</p>
          </div>`
      console.log(item.功用);
    });
    yishoudata += "</div>";
    $("#yishoubox").html(yishoudata);
  }
  else{
    yishoudata =  "<p class='ys_p'>暂无记载</p>";
    $("#yishoubox").html(yishoudata);
  }    // 使用 slideDown() 方法以动画效果向左滑动显示内容
  $("#info").slideDown("slow");
  have_animal = false;
  var element = document.getElementsByClassName('bottom-container')[0];  
  if (element) {  
      element.style.right = "80%";  
  }
  var element2 = document.getElementsByClassName('huadong-container')[0];  
  if (element2) {  
      element2.style.right = "60%";  
  }
}


function show_yishou(id){
  // $(".jieshao").slideUp("slow");//返回结果在data里 数据返回成功之后要干什么
  $.ajax({
    url: 'http://172.20.10.2:9936/search_animal',
    type: 'get',
    dataType: 'json',
    data: {//传进去的
        type:id
    }, // Pass the parameter here
    success: function (data) {
      // $(".jieshao").slideUp("slow");//返回结果在data里 数据返回成功之后要干什么
      $.each(data, function (index, item) {
        $("#ys_name").html(item.名字);
        $("#hdfw").html(item.活动范围);
        $("#shhj").html(item.生活环境);
        $("#wxtz").html(item.外形特征);
        $("#gy").html(item.功用);
        $("#ys_yw").html(item.原文);
        $("#ys_fy").html(item.翻译);
        $("#gy").html(item.功用);
        $(".jieshao").slideDown("slow");

      });
    }
  });
}


function change_mount(num){
  var shunxu;
  if(num == 1){
    shunxu = now_shunxu - 1;
  }else{
    shunxu = now_shunxu + 1;
  }
  $.ajax({
    url: 'http://172.20.10.2:9936/search_mount',
    type: 'get',
    dataType: 'json',
    data: {//传进去的
        shunxu:shunxu,
        shanxi:shanxi
    }, // Pass the parameter here
    success: function (data) {
      $.each(data, function (index, item) {
        //console.log(item.所属山系);
        addDemoGraphic(graphicLayer, item);
        id = item.id;
        Showyishou(id);
        ShowInfo(id);
        lng = parseFloat(item.经度);
        lat = parseFloat(item.纬度);
        Move2Mount(lng,lat);
      });
    }
  });
  
}

function show_first(){
  $.ajax({
    url: 'http://172.20.10.2:9936/search_mount',
    type: 'get',
    dataType: 'json',
    data: {//传进去的
        shunxu:1,
        shanxi:shanxi
    }, // Pass the parameter here
    success: function (data) {
      $.each(data, function (index, item) {
        //console.log(item.所属山系);
        id = item.id;
        Showyishou(id);
        ShowInfo(id);
        lng = parseFloat(item.经度);
        lat = parseFloat(item.纬度);
        Move2Mount(lng,lat);
      });
    }
  });
  
}

$("#hideInfoBtn").click(function() {
  // 隐藏 id 为 "info" 的 div
  $("#info").slideUp("slow");
    var element = document.getElementsByClassName('bottom-container')[0];  
    if (element) {  
        element.style.right = "50%";  
    }
    var element2 = document.getElementsByClassName('huadong-container')[0];  
    if (element2) {  
        element2.style.right = "0%";  
    }
  }
);

function hide_yishou(){
  $(".jieshao").slideUp("slow");
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
      url: 'http://172.20.10.2:9936/get_mountains',
      type: 'get',
      dataType: 'json',
      data: {//传进去的
          name:searchTerm
      }, // Pass the parameter here
      success: function (data) {  
        console.log(data);  
        // 假设 graphicLayer 是之前定义的某个变量，用于清除旧的内容  
        graphicLayer.clear();  

        //移除之前的
        var parentDiv1 = document.getElementById('xialakuang');
        while (parentDiv1.firstChild) {  
          parentDiv1.removeChild(parentDiv1.firstChild);  
        } 
        $.each(data, function (index, item) {  
          // 创建一个新的 a 元素  
          const boxDiv = document.createElement('a');  
          boxDiv.className = 'dropdown-content-item'; // 假设您有一个对应的CSS类  
            
          // 设置 a 元素的文本内容  
          boxDiv.textContent = `${item.名字} ${item.所属山系}`; // 假设item对象有'名字'和'所属山系'属性 
          // 为 a 元素添加点击事件监听器  
          boxDiv.addEventListener('click', function(event) {  
            // 阻止默认的链接行为（如果需要）  
            event.preventDefault();  
            addDemoGraphic(graphicLayer, item); // 假设这个函数存在并且您已经定义了graphicLayer 
            shanxi = item.所属山系; 
            id = item.id;
            Showyishou(id);
            ShowInfo(id);
            lng = parseFloat(item.经度);
            lat = parseFloat(item.纬度);
            Move2Mount(lng,lat);  
            // 可以在这里添加其他点击后的操作，比如打开一个弹窗等  
          });  
          // 获取父容器元素  
          var parentDiv = document.getElementById('xialakuang');  
            
          // 确保parentDiv存在，否则appendChild会失败  
          if (parentDiv) {  
            // 将 a 元素添加到父容器中  
            parentDiv.appendChild(boxDiv); 
          } else {  
            console.error('没有找到ID为xialakuang的元素');  
          }  
        });
        const boxDiv = document.createElement('a');  
          boxDiv.className = 'dropdown-content-item'; // 假设您有一个对应的CSS类  
            
          // 设置 a 元素的文本内容  
          boxDiv.textContent = `清除`; 
          boxDiv.addEventListener('click', function(event) {  
            // 阻止默认的链接行为（如果需要）  
            clear_search();  
          });  
          var parentDiv = document.getElementById('xialakuang');  
          parentDiv.appendChild(boxDiv); 
      },
      error: function (jqXHR, textStatus, errorThrown) {  
        // 请求失败时的处理  
        console.error('Request failed: ' + textStatus, errorThrown);  
      }  
  });    
  });    
});

// 获取所有的.image-with-text元素  
var elements2 = document.querySelectorAll('.image-with-text2');  
  
// 遍历所有元素，除了第一个，都设置为inactive  
elements2.forEach(function(element, index) {  
  if (index < element.length-1 ) {  
    element.classList.remove('active2');
    element.classList.add('inactive2');  
 // 如果之前有active类的话  
  } else {  
    // 第一个元素设置为active  
    element.classList.add('active2');  
    element.classList.remove('inactive2'); // 移除可能存在的inactive类  
  }  
});  
  
// 如果需要，你还可以为每个元素添加点击事件监听器来切换状态  
elements2.forEach(function(element) {  
  element.addEventListener('click', function() {  
    // 移除所有元素的active类  
    elements2.forEach(function(el) {  
      el.classList.remove('active2');  
      el.classList.add('inactive2');
      el.querySelector('img').src = '../img/3d_point/滑动图标2.png'
    });  
    this.classList.remove('inactive2');
    // 添加当前元素的active类  
    this.classList.add('active2');  
    if (this.id =='shan') this.querySelector('img').src = '../img/3d_point/山.png'
    if (this.id =='guo') this.querySelector('img').src = '../img/3d_point/国.png'
  });  
});

function drawBox(container, dataItem) {  
  // 创建一个新的div元素作为框  
  const boxDiv = document.createElement('div');  
  boxDiv.className = 'box'; // 应用CSS样式  
  boxDiv.textContent = "dataItem.名字"+"  "+"dataItem.所属山系"; // 设置框中的文本内容

  // 将新的div元素添加到容器中  
  container.appendChild(boxDiv);  
}  

function clear_search(){
  var parentDiv1 = document.getElementById('xialakuang');
  while (parentDiv1.firstChild) {  
    parentDiv1.removeChild(parentDiv1.firstChild);  
  }
}

function MountOrCountry(data){
  var elements = document.getElementsByClassName('active2'); // 假设这是你的HTMLCollection  
if (elements.length > 0) {  
    var id = elements[0].id; // 正确获取第一个元素的ID  
    console.log(id); // 应该打印出 "shan" 或 "guo"，取决于它们在文档中的顺序  
} else {  
    console.log('No elements found with class "active2".');  
}
  if(id=="shan"){
    map.scene.globe.terrainExaggeration = 13 // 修改地形夸张程度
    LoadMounts(data);
    if(data == "东山一经"){
    mapSetViewList_East();
    }else if(data == "西山一经"){
    mapSetViewList_West()
    }else if(data == "南山一经"){
      mapSetViewList_South()
    }else if(data == "北山一经"){
      mapSetViewList_North()
    }else if(data == "中山一经"){
      mapSetViewList_Middle()
    }
  } 
  else if(id=="guo"){
    map.scene.globe.terrainExaggeration = 1 // 修改地形夸张程度
    if(data == "南山一经"){
    LoadCountry('海外南经');
    mapSetViewList_country();
    }
  }
}

function mapSetViewList_country(){
  map.setCameraView({ lat:20.346768, lng: 115.125024, alt: 2374000, heading: 345, pitch: -66.4 })
}
  // // 获取图片元素和提示框元素
  // var image = document.getElementById("last");
  // var tooltip = document.getElementById("last_tip");
  
  // // 当鼠标移入图片时显示提示框
  // image.addEventListener("mouseenter", function(event) {
  //   // 设置提示框位置为鼠标位置
  //   tooltip.style.left = (event.clientX - 5) + "px";
  //   tooltip.style.top = (event.clientY - 5) + "px";
  //   // 显示提示框
  //   tooltip.style.display = "block";
  // });
  
  // // 当鼠标移出图片时隐藏提示框
  // image.addEventListener("mouseleave", function() {
  //   // 隐藏提示框
  //   tooltip.style.display = "none";
  // });

  // // 获取图片元素和提示框元素
  // var image1 = document.getElementById("next");
  // var tooltip1 = document.getElementById("next_tip");
  
  // // 当鼠标移入图片时显示提示框
  // image1.addEventListener("mouseenter", function(event) {
  //   // 设置提示框位置为鼠标位置
  //   tooltip1.style.left = (event.clientX - 5) + "px";
  //   tooltip1.style.top = (event.clientY - 5) + "px";
  //   // 显示提示框
  //   tooltip1.style.display = "block";
  // });
  
  // // 当鼠标移出图片时隐藏提示框
  // image1.addEventListener("mouseleave", function() {
  //   // 隐藏提示框
  //   tooltip1.style.display = "none";
  // });
