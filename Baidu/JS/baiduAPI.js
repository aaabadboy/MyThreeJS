var baiduAPI = function () {

    this.map = new BMap.Map('allmap');


    // 随机向地图添加25个标注


    this.addPoint = function () {

        var context = this;
        var json_data = [{'sort': 0, 'name': '1', 'start_lng': 105.237, 'start_lat': 34.054}, {
            'sort': 1,
            'name': '2',
            'start_lng': 112.919,
            'start_lat': 30.881
        }, {'sort': 2, 'name': '3', 'start_lng': 111.775, 'start_lat': 27.852}, {
            'sort': 3,
            'name': '4',
            'start_lng': 101.412,
            'start_lat': 34.865
        }, {'sort': 4, 'name': '5', 'start_lng': 105.485, 'start_lat': 30.406}, {
            'sort': 5,
            'name': '6',
            'start_lng': 109.804,
            'start_lat': 30.786
        }, {'sort': 6, 'name': '7', 'start_lng': 112.407, 'start_lat': 34.038}, {
            'sort': 7,
            'name': '8',
            'start_lng': 101.113,
            'start_lat': 33.229
        }, {'sort': 8, 'name': '9', 'start_lng': 102.996, 'start_lat': 28.571}, {
            'sort': 9,
            'name': '10',
            'start_lng': 109.975,
            'start_lat': 30.413
        }];


        var markers = [];
        $.each(json_data, function (index, item) {

            var lng = item.start_lng;
            var lat = item.start_lat;
           // var point = new BMap.Point(lng, lat);
            var point = new BMap.Point(Math.random() * 30 + 85, Math.random() * 20 + 21);

            var marker = new BMap.Marker(point); // 创建点
            var AllocationPointName = "<span>顺序:" + item.sort + "</span> ";
            var AllocationPointAddress = "<span>坐标:" + lng + "," + lat + "</span>";


            var opts = {
                width: 200,     // 信息窗口宽度
                height: 20,     // 信息窗口高度
                title: AllocationPointName, // 信息窗口标题
                enableMessage: true,//设置允许信息窗发送短息
                offset: new BMap.Size(-12, -20),
            };

            var label = new BMap.Label(AllocationPointName + AllocationPointAddress, opts);
            label.setStyle({
                position: "relative",
                fontSize: "12px",
                height: "20px",
                width: "100px",
                lineHeight: "20px",
                fontFamily: "微软雅黑"
            });

            context.map.addOverlay(marker);    //增加点
            context.map.centerAndZoom(point, 6);
            marker.setLabel(label);

            marker.addEventListener("click", function (e) {
                console.log(e);
            });

            markers.push(marker);
            //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
            var markerClusterer = new BMapLib.MarkerClusterer(context.map, {markers: markers});
        });
    }


    this.toolbar =function () {

        var context = this;
        var overlays=[];
        var overlaycomplete = function(e){
            overlays.push(e.overlay);
        };
        var styleOptions = {
            strokeColor:"red",    //边线颜色。
            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
        }
        //实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(context.map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: true, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions //矩形的样式
        });


        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
        function clearAll() {
            for(var i = 0; i < overlays.length; i++){
                map.removeOverlay(overlays[i]);
            }
            overlays.length = 0
        }
    }
}


baiduAPI.prototype = {

    initMap: function () {

        var context = this;
        context.map.centerAndZoom(new BMap.Point(117.140949, 39.232572), 11);  // 初始化地图,设置中心点坐标和地图级别
        //map.setCurrentCity('襄阳');
        context.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        return context.map;
    },

    //控件
    addControl: function (control) {
        var context = this;
        // 添加带有定位的导航控件
        if (control.nav) {

            var navigationControl = new BMap.NavigationControl({
                // 靠左上角位置
                anchor: BMAP_ANCHOR_TOP_LEFT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_LARGE,
                // 启用显示定位
                enableGeolocation: true
            });
            context.map.addControl(navigationControl);
        }
        // 添加定位控件
        if (control.location) {

            var geolocationControl = new BMap.GeolocationControl();
            geolocationControl.addEventListener('locationSuccess', function (e) {
                // 定位成功事件
                var address = '';
                address += e.addressComponent.province;
                address += e.addressComponent.city;
                address += e.addressComponent.district;
                address += e.addressComponent.street;
                address += e.addressComponent.streetNumber;
                alert('当前定位地址为：' + address);
            });
            geolocationControl.addEventListener('locationError', function (e) {
                // 定位失败事件
                alert(e.message);
            });
            context.map.addControl(geolocationControl);
        }

        if (control.scale)
            context.map.addControl(new BMap.ScaleControl());
        if (control.overview)
            context.map.addControl(new BMap.OverviewMapControl());
        if (control.maptype) {
            context.map.addControl(new BMap.MapTypeControl());
            context.map.setCurrentCity('天津市'); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
        }
        //添加城市
        if (control.city) {
            var city = new BMap.CityListControl({
                anchor: BMAP_ANCHOR_TOP_LEFT,
                offset: new BMap.Size(10, 20),
                // 切换城市之间事件
                // onChangeBefore: function(){
                //    alert('before');
                // },
                // 切换城市之后事件
                // onChangeAfter:function(){
                //   alert('after');
                // }
            })
            context.map.addControl(city);
        }
    }


}