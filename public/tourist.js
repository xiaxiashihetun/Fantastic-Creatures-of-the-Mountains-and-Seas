function redirectToPage() {
    window.history.back();
}

document.getElementById("sidebar-toggle-btn").addEventListener("click", function () {
    var sidebar = document.getElementById("sidebar");
    var button = document.getElementById("sidebar-toggle-btn");
    if (sidebar.classList.contains("sidebar-hidden")) {
        sidebar.classList.remove("sidebar-hidden");
        button.style.left = '250px';
    } else {
        sidebar.classList.add("sidebar-hidden");
        button.style.left = '0';
    }
});

var map = new BMapGL.Map('container', {
    restrictCenter: false
});
map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 12);
map.enableScrollWheelZoom();
map.setHeading(64.5);
map.setTilt(73);
map.setDisplayOptions({
    skyColors: ['rgba(159, 145, 107, 0)', 'rgba(159, 145, 107, 0.5)']
});

function fetchRoutes(city) {
    fetch(`/get_routes?city=${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(data => {
            map.clearOverlays();
            drawRoutes(data);
            // 设置地图为三维效果
            map.setHeading(64.5);
            map.setTilt(73);
        })
        .catch(error => console.error('Error:', error));
}

function adjustMapViewport(points) {
    // 计算路线所覆盖的最小经纬度和最大经纬度
    let minLng = points[0].lng;
    let maxLng = points[0].lng;
    let minLat = points[0].lat;
    let maxLat = points[0].lat;

    points.forEach(point => {
        minLng = Math.min(minLng, point.lng);
        maxLng = Math.max(maxLng, point.lng);
        minLat = Math.min(minLat, point.lat);
        maxLat = Math.max(maxLat, point.lat);
    });

    // 计算中心点和缩放级别
    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;
    const mapBounds = new BMapGL.Bounds(new BMapGL.Point(minLng, minLat), new BMapGL.Point(maxLng, maxLat));
    const zoomLevel = map.getViewport(mapBounds).zoom;

    // 调整地图视野
    map.centerAndZoom(new BMapGL.Point(centerLng, centerLat), zoomLevel);
    // 设置地图为三维效果
    map.setHeading(64.5);
    map.setTilt(73);
}


function drawRoutes(data) {
    const routes = {};

    data.forEach(point => {
        const { 路线序号, 顺序, 经度, 纬度, 介绍内容, 相关链接, 图片, 旅游地名称 } = point;

        if (!routes[路线序号]) {
            routes[路线序号] = [];
        }

        routes[路线序号].push({ 顺序, 经度, 纬度, 介绍内容, 相关链接, 图片, 旅游地名称 });
    });

    for (const route in routes) {
        routes[route].sort((a, b) => a.顺序 - b.顺序);

        const points = routes[route].map(p => new BMapGL.Point(p.经度, p.纬度));

        if (points.length > 1) {
            const driving = new BMapGL.DrivingRoute(map, {
                renderOptions: { map: map, autoViewport: true },
                onSearchComplete: function (results) {
                    if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                        const plan = results.getPlan(0);
                        const route = plan.getRoute(0);
                        const path = route.getPath();
                        const polyline = new BMapGL.Polyline(path, {
                            strokeColor: "#00BE00",
                            strokeWeight: 6,
                            strokeOpacity: 0.8
                        });
                        map.addOverlay(polyline);
                        // 设置地图为三维效果
                        map.setHeading(64.5);
                        map.setTilt(73);
                    }
                }
            });


            // 将路径中的所有点传递给导航
            for (let i = 0; i < points.length - 1; i++) {
                driving.search(points[i], points[i + 1]);
            }
        }
        // 设置地图为三维效果
        map.setHeading(64.5);
        map.setTilt(73);
        points.forEach((point, index) => {
            const marker = new BMapGL.Marker(point);
            map.addOverlay(marker);

            const imagePath = `/img/旅游图片/${routes[route][index].图片}`;
            var sContent = `
            <div class="info-window-content">
            <h3>${routes[route][index].旅游地名称}</h3>
            <img class="info-window-image" src="${imagePath}" alt="图片" style="width:100px;height:auto;">
            <p>${routes[route][index].介绍内容}</p>
            <a href="${routes[route][index].相关链接}" target="_blank">查看更多</a><br>
            <div class="info-window-buttons">
                <button class="info-window-button" onclick="toHere(${point.lat}, ${point.lng})">到这去</button>
                <button class="info-window-button" onclick="recommendHotelandRestaurant(${point.lat}, ${point.lng})">酒店推荐</button>
                <button class="info-window-button" onclick="recommendHotelandRestaurant(${point.lat}, ${point.lng})">饭店推荐</button>
            </div>
        </div>
                `;
            const infoWindow = new BMapGL.InfoWindow(sContent, {
                width: 500,     // 自定义信息窗口宽度
                height: 250,    // 自定义信息窗口高度
                enableMessage: true // 设置允许信息窗发送短息
            });

            marker.addEventListener('click', () => {
                map.openInfoWindow(infoWindow, point);
                // 设置地图为三维效果
                map.setHeading(64.5);
                map.setTilt(73);
            });
        });
    }

    // 获取路线中所有点的经纬度坐标
    const allPoints = [];
    for (const route in routes) {
        routes[route].forEach(point => {
            allPoints.push(new BMapGL.Point(point.经度, point.纬度));
        });
    }

    // 调整地图视野以缩放和平移到路线所在的区域
    adjustMapViewport(allPoints);
    // 设置地图为三维效果
    map.setHeading(64.5);
    map.setTilt(73);
}



function toHere(lat, lng) {
    var point = new BMapGL.Point(parseFloat(lng), parseFloat(lat));
    var geocoder = new BMapGL.Geocoder();
    geocoder.getLocation(point, function (result) {
        if (result) {
            var address = result.address;
            document.getElementById("endPoint").value = address;  // 设置中心点搜索框
        }
    });
}

function recommendHotelandRestaurant(lat, lng) {
    var point = new BMapGL.Point(parseFloat(lng), parseFloat(lat));
    var geocoder = new BMapGL.Geocoder();
    geocoder.getLocation(point, function (result) {
        if (result) {
            var address = result.address;
            document.getElementById("centerPoint").value = address;  // 设置起点搜索框
        }
    });
}

// 初始化搜索框
var startAutocomplete = new BMapGL.Autocomplete({
    "input": "startPoint",
    "location": map
});
var endAutocomplete = new BMapGL.Autocomplete({
    "input": "endPoint",
    "location": map
});
// 路径规划
function searchRoute() {
    var startPointName = document.getElementById("startPoint").value;
    var endPointName = document.getElementById("endPoint").value;

    if (!startPointName || !endPointName) {
        alert("请输入起点和终点");
        return;
    }

    // 使用百度地图的getPoint方法获取经纬度坐标
    var startSearch = new BMapGL.LocalSearch(map, {
        onSearchComplete: function (results) {
            var startPoint = results.getPoi(0).point;
            var endSearch = new BMapGL.LocalSearch(map, {
                onSearchComplete: function (results) {
                    var endPoint = results.getPoi(0).point;
                    // 清除之前的覆盖物（折线）
                    map.clearOverlays();

                    var driving = new BMapGL.DrivingRoute(map, {
                        renderOptions: { map: map, autoViewport: true },
                        onSearchComplete: function (results) {
                            if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                                var plan = results.getPlan(0);
                                var route = plan.getRoute(0);
                                var path = route.getPath();
                                var polyline = new BMapGL.Polyline(path);
                                map.addOverlay(polyline);
                            }
                        }
                    });
                    driving.search(startPoint, endPoint);
                }
            });
            endSearch.search(endPointName);
        }
    });
    startSearch.search(startPointName);
}
document.getElementById("routeButton").addEventListener("click", searchRoute);

// 初始化搜索框
var startAutocomplete1 = new BMapGL.Autocomplete({
    "input": "centerPoint",
    "location": map
});

// 酒店推荐按钮点击事件
function searchHotel() {
    var centerPointName = document.getElementById("centerPoint").value;
    // 将地图缩小
    var nationalCenter = new BMapGL.Point(104.1954, 35.8617);
    map.centerAndZoom(nationalCenter, 5);

    if (!centerPointName) {
        alert("请输入中心点");
        return;
    }

    // 使用百度地图的Place Search API进行周边检索
    var local = new BMapGL.LocalSearch(map, {

        onSearchComplete: function (results) {
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                // 清除之前的覆盖物（标记）
                map.clearOverlays();
                // 获取检索结果
                var points = [];
                for (var i = 0; i < results.getCurrentNumPois(); i++) {
                    var poi = results.getPoi(i);
                    console.log(poi);
                    var point = poi.point;
                    points.push(point);
                    // 在地图上添加一个标记
                    var marker = new BMapGL.Marker(point);
                    map.addOverlay(marker);
                    // 添加信息窗口
                    var content = poi.title;
                    addInfoWindow(marker, content, point, poi);
                }
                // 将地图中心设置为检索结果的位置
                map.setViewport(points);

            }
        }
    });

    // 将中心点的地址转换为坐标
    var geo = new BMapGL.Geocoder();
    geo.getPoint(centerPointName, function (point) {
        if (point) {
            // 开始进行周边检索，以1000米为半径
            local.searchNearby("酒店", point, 5000);
            // local.searchNearby("酒店", centerPointName, 1000);
        } else {
            alert("无法获取中心点坐标，请检查输入地址是否正确");
        }
    }, "中国");
}
document.getElementById("hotelButton").addEventListener("click", searchHotel);

//饭店推荐
// 饭店推荐按钮点击事件
function searchRestaurant() {
    var centerPointName = document.getElementById("centerPoint").value;
    var nationalCenter = new BMapGL.Point(104.1954, 35.8617);
    map.centerAndZoom(nationalCenter, 5);

    if (!centerPointName) {
        alert("请输入中心点");
        return;
    }

    // 使用百度地图的Place Search API进行周边检索
    var local = new BMapGL.LocalSearch(map, {

        onSearchComplete: function (results) {
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                // 清除之前的覆盖物（标记）
                map.clearOverlays();
                // 获取检索结果
                var points = [];
                for (var i = 0; i < results.getCurrentNumPois(); i++) {
                    var poi = results.getPoi(i);
                    var point = poi.point;
                    points.push(point);
                    // 在地图上添加一个标记
                    var marker = new BMapGL.Marker(point);
                    map.addOverlay(marker);
                    // 添加信息窗口
                    var content = poi.title;
                    addInfoWindow(marker, content, point, poi);
                }
                // 将地图中心设置为检索结果的位置
                map.setViewport(points);
            }
        }
    });

    // 将中心点的地址转换为坐标
    var geo = new BMapGL.Geocoder();
    geo.getPoint(centerPointName, function (point) {
        if (point) {
            // 开始进行周边检索，以1000米为半径
            local.searchNearby("饭店", point, 3000);
            // local.searchNearby("酒店", centerPointName, 1000);
        } else {
            alert("无法获取中心点坐标，请检查输入地址是否正确");
        }
    }, "中国");
}
document.getElementById("restaurantButton").addEventListener("click", searchRestaurant);

function addInfoWindow(marker, content, point, poi) {
    // 创建信息窗口
    var infoWindow = new BMapGL.InfoWindow(content);

    // 创建一个查看详情的按钮
    var openLinkButton = document.createElement("button");
    openLinkButton.appendChild(document.createTextNode("查看详情"));
    openLinkButton.className = "info-window-button"; // 添加样式类

    // 绑定点击事件，打开链接
    openLinkButton.addEventListener("click", function () {
        window.open(poi.url, "_blank"); // 在新窗口中打开链接
    });

    // 创建一个到这去的按钮
    var goToButton = document.createElement("button");
    goToButton.appendChild(document.createTextNode("到这去"));
    goToButton.className = "info-window-button"; // 添加样式类

    // 绑定点击事件，路径规划，并将 poi.title 设置为终点搜索框的值
    goToButton.addEventListener("click", function () {
        document.getElementById("endPoint").value = poi.title;
        searchRoute(); // 触发路径规划
    });

    // 创建一个 div 包含两个按钮
    var contentDiv = document.createElement('div');
    contentDiv.innerHTML = content + "<br>";
    contentDiv.appendChild(openLinkButton);
    contentDiv.appendChild(goToButton);

    // 将按钮添加到信息窗口内容中
    infoWindow.setContent(contentDiv);

    // 绑定标记点击事件，打开信息窗口
    marker.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, point);
        // 设置地图为三维效果
        map.setHeading(64.5);
        map.setTilt(73);
    });
}