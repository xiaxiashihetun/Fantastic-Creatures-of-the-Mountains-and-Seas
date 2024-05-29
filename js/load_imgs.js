
function firstFunction() {
    var body = document.body;
    for (var i = 1; i < 62; i++) {
        var img = document.createElement("img");
        img.src = "../img/yishou/"+i+".jpg";
        img.alt = "Image " + (i); // 添加图片描述，可根据需要修改
        img.className = "hidden-img"; 
        body.appendChild(img);
    }
    var img = document.createElement("img");
    img.src = "../img/yishou/上一个.png";
    img.className = "hidden-img";
    body.appendChild(img);
    var img = document.createElement("img");
    img.src = "../imgs/购物车蓝.png";
    img.className = "hidden-img";
    body.appendChild(img);

    console.log("Pictures Loaded.");
}

// 第二个处理程序
// function secondFunction() {
//     console.log("Second function executed.");
// }

// 使用 addEventListener 添加处理程序
window.addEventListener("load", firstFunction);
//window.addEventListener("load", secondFunction);
