/**
 * Created by lishoubo on 16/5/14.
 */

$(function () {
    $('.carousel').carousel();

    initMap();//创建和初始化地图

    /*quick join*/
    new Vue({
        el: '#quick_join',
        data: {
            applyNum: 0,
            applyForm: {
                area: '',
                address: {
                    district: '西湖区',
                    location: ''
                },
                userName: '',
                mobile: ''
            }
        },
        created: function () {
            this.fetch_join_number();
        },
        methods: {
            fetch_join_number: function () {
                var owner = this;
                this._get("/api/server/charge/count", "",
                    function (result) {
                        if (result.success) {
                            owner.applyNum = result.data;
                            return
                        }
                        console.log(result);
                        owner.applyNum = "许多";
                    }, function (error) {
                        console.log(error);
                        owner.applyNum = "许多";
                    }
                )
            },
            quick_join: function () {
                var owner = this;
                if (!this.applyForm.userName) {
                    show_tip("麻烦填写您的姓名,方便我们联系到您");
                    return;
                }
                if (!this.applyForm.mobile) {
                    show_tip("麻烦填写您的联系方式,方便我们联系到您");
                    return;
                }
                this._post("/api/server/charge", this.applyForm,
                    function (result) {
                        if (result.success) {
                            show_tip("恭喜您,预约成功,我们会马上联系您~");
                            owner.fetch_join_number();
                            owner.resetForm();
                            return
                        }
                        show_tip("服务出错,请联系我们的客服~");
                    },
                    function (error) {
                        console.log(error);
                        show_tip("服务出错,请联系我们的客服~");
                    });
            },
            choose_district: function (event) {
                this.applyForm.district = $(event.target).html();
            },
            resetForm: function () {
                this.applyForm.area = '';
                this.applyForm.address = '';
                this.applyForm.userName = '';
                this.applyForm.mobile = '';
            }

        }
    });

    /* 监理日志 */
    new Vue({
        el: '#jl-example',
        data: {
            applyNum: 0,
            items: []
        },
        created: function () {
            this.fetch_items();
        },
        methods: {
            fetch_items: function () {
                var owner = this;
                this._get("/api/server/journal", {page: 1, pageSize: 10},
                    function (result) {
                        console.log(result);
                        if (result.success) {
                            owner.items = result.data.items;
                            console.log(owner.items)
                            return
                        }
                    }, function (error) {
                        console.log(error);
                    }
                )
            }
        }
    })


});


//创建和初始化地图函数：
function initMap() {
    createMap();//创建地图
    setMapEvent();//设置地图事件
    addMapControl();//向地图添加控件
    addMarker();//向地图中添加marker
}

//创建地图函数：
function createMap() {
    var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
    var point = new BMap.Point(120.11977, 30.341044);//定义一个中心点坐标
    map.centerAndZoom(point, 18);//设定地图的中心点和坐标并将地图显示在地图容器中
    window.map = map;//将map变量存储在全局
}

//地图事件设置函数：
function setMapEvent() {
    map.disableDragging();//禁用地图拖拽事件
    map.disableScrollWheelZoom();//禁用地图滚轮放大缩小，默认禁用(可不写)
    map.disableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
    map.disableKeyboard();//禁用键盘上下左右键移动地图，默认禁用(可不写)
}

//地图控件添加函数：
function addMapControl() {
    //向地图中添加缩略图控件
    var ctrl_ove = new BMap.OverviewMapControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1});
    map.addControl(ctrl_ove);
    //向地图中添加比例尺控件
    var ctrl_sca = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});
    map.addControl(ctrl_sca);
}

//标注点数组
var markerArr = [{
    title: "浙报印务中心308室",
    content: "拱墅区祥园路38号浙报印务中心308室",
    point: "120.119711|30.341153",
    isOpen: 1,
    icon: {w: 21, h: 21, l: 0, t: 0, x: 6, lb: 5}
}
];
//创建marker
function addMarker() {
    for (var i = 0; i < markerArr.length; i++) {
        var json = markerArr[i];
        var p0 = json.point.split("|")[0];
        var p1 = json.point.split("|")[1];
        var point = new BMap.Point(p0, p1);
        var iconImg = createIcon(json.icon);
//            var marker = new BMap.Marker(point, {icon: iconImg});
        var marker = new BMap.Marker(point);
        var iw = createInfoWindow(i);
        var label = new BMap.Label(json.title, {"offset": new BMap.Size(json.icon.lb - json.icon.x + 10, -20)});
        marker.setLabel(label);
        map.addOverlay(marker);
        label.setStyle({
            borderColor: "#808080",
            color: "#333",
            cursor: "pointer"
        });

        (function () {
            var index = i;
            var _iw = createInfoWindow(i);
            var _marker = marker;
            _marker.addEventListener("click", function () {
                this.openInfoWindow(_iw);
            });
            _iw.addEventListener("open", function () {
                _marker.getLabel().hide();
            })
            _iw.addEventListener("close", function () {
                _marker.getLabel().show();
            })
            label.addEventListener("click", function () {
                _marker.openInfoWindow(_iw);
            })
            if (!!json.isOpen) {
                label.hide();
                _marker.openInfoWindow(_iw);
            }
        })()
    }
}
//创建InfoWindow
function createInfoWindow(i) {
    var json = markerArr[i];
    var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>" + json.content + "</div>");
    return iw;
}
//创建一个Icon
function createIcon(json) {
    var icon = new BMap.Icon("/images/icon_map_marker.png", new BMap.Size(json.w, json.h), {
        imageOffset: new BMap.Size(-json.l, -json.t),
        infoWindowOffset: new BMap.Size(json.lb + 5, 1),
        offset: new BMap.Size(json.x, json.h)
    })
    return icon;
}