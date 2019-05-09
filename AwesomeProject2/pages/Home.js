import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    ScrollView,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Alert, SafeAreaView,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';
import * as ScreenUtil from "../utils/ScreenUtil"
import {Input, Image} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Global from "./Global";
import {Toast} from '../utils/Toast'

var Geolocation = require('Geolocation');
//监听定位的id
var watchID = null
export default class Home extends Component {
    static navigationOptions = {
        header: null,
        // title: 'Hello!',
    };

    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.next2 = this.next2.bind(this);
        this.prev2 = this.prev2.bind(this);
        this.geoDistance = this.geoDistance.bind(this);

        this.state = {
            currentPage: 0,
            currentPage2: 0,
            centreList: [{
                id: 1,
                name: "云邻大楼1",
            }, {
                id: 2,
                name: "云邻大楼2",
            }, {
                id: 3,
                name: "云邻大楼3",
            }, {
                id: 4,
                name: "云邻大楼4",
            }],
            floorList: [{
                id: 1,
                name: "1楼"
            }, {
                id: 2,
                name: "2楼"
            }, {
                id: 3,
                name: "3楼"
            }, {
                id: 5,
                name: "4楼"
            },],
            lockList: [{
                companyName: "云邻通讯",
                id: 1,
                name: "307大门"
            }, {
                companyName: "云邻通讯",
                id: 2,
                name: "307后门"
            }, {
                companyName: "云邻通讯",
                id: 3,
                name: "307前门"
            }],
            centreId: 1,
            floorId: 1,
            loadType: -1,//0加载楼层 门锁   1加载门锁
            distance: 0.0,//打卡距离
            currentTime: ""
        }
    }

    componentDidMount() {
        this.loadData();
        this.beginWatch();
        // setInterval(this.setTime,2000);
        setInterval(()=>{
            var today=new Date()
            var h=today.getHours()
            var m=today.getMinutes()
            var s=today.getSeconds()
// add a zero in front of numbers<10
            if (m<10)
                {m="0"+m}
            if (s<10)
                {s="0"+s}
            this.setState({
                currentTime:h+":"+m
            });
        },1000);
    }

    next() {
        let page = this.state.currentPage;
        page = page + 1;
        // 越界判断
        if (this.state.centreList.length <= page) {
            page = 0
        }
        let offset = page * 180;
        let scrollView = this.refs.scrollView;
        scrollView.scrollTo({x: offset, y: 0, animated: true});
        var scrollView2 = this.refs.scrollView2;
        scrollView2.scrollTo({x: 0, y: 0, animated: true});
        this.setState({
            currentPage: page,
            centreId: this.state.centreList[page].id,
            currentPage2: 0,
            loadType: 0
        });
    }

    prev() {
        let page = this.state.currentPage;
        page = page - 1;
        // 越界判断
        if (page == -1) {
            page = this.state.centreList.length - 1
        }
        let offset = page * 180;
        var scrollView = this.refs.scrollView;
        scrollView.scrollTo({x: offset, y: 0, animated: true});
        var scrollView2 = this.refs.scrollView2;
        scrollView2.scrollTo({x: 0, y: 0, animated: true});
        this.setState({
            currentPage: page,
            centreId: this.state.centreList[page].id,
            currentPage2: 0,
            loadType: 0
        });
    }

    next2() {
        let page = this.state.currentPage2;
        page = page + 1;
        // 越界判断
        if (this.state.floorList.length <= page) {
            page = 0
        }
        let offset = page * 140;
        var scrollView = this.refs.scrollView2;
        scrollView.scrollTo({x: offset, y: 0, animated: true});
        this.setState({
            currentPage2: page,
            floorId: this.state.floorList[page].id,
            loadType: 1
        });
        console.log(page)
    }

    prev2() {
        let page = this.state.currentPage2;
        page = page - 1;
        // 越界判断
        if (page == -1) {
            page = this.state.floorList.length - 1
        }
        let offset = page * 140;
        var scrollView = this.refs.scrollView2;
        scrollView.scrollTo({x: offset, y: 0, animated: true});
        this.setState({
            currentPage2: page,
            floorId: this.state.floorList[page].id,
            loadType: 1
        });
    }

    //开始监听位置变化
    beginWatch() {
        watchID = Geolocation.watchPosition(
            location => {
                var result = "速度：" + location.coords.speed +
                    "\n经度：" + location.coords.longitude +
                    "\n纬度：" + location.coords.latitude +
                    "\n准确度：" + location.coords.accuracy +
                    "\n行进方向：" + location.coords.heading +
                    "\n海拔：" + location.coords.altitude +
                    "\n海拔准确度：" + location.coords.altitudeAccuracy +
                    "\n时间戳：" + location.timestamp;
                Global.mylon=location.coords.longitude
                Global.mylat=location.coords.latitude
                // Alert.alert(result);
            },
            error => {
                Alert.alert("获取位置失败："+ error)
            }
        );
    }
    //停止监听位置变化
    stopWatch() {
        Geolocation.clearWatch(watchID);
    }

    loadData() {
        this.setState({loadType: -1});
        let REQUEST_URL = `${Global.baseUrl}lock/app/centre/getCentreList`;
        let params = {"name": ""};
        fetch(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': Global.token,
            },
            body: JSON.stringify(params)
        }).then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        }).then((json) => {
            console.log(json.centreList);
            if (json.centreList !== undefined && json.centreList.length > 0) {
                this.setState({
                    centreList: json.centreList,
                    centreId: json.centreList[0].id
                });
                this.geoDistance(json.centreList[0].lat,json.centreList[0].lon,Global.mylat,Global.mylon )

                this.loadFloor();
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    loadFloor() {
        this.setState({loadType: -1});
        let REQUEST_URL = `${Global.baseUrl}lock/app/floor/getFloorList`;
        let params = {"centreId": `${this.state.centreId}`};
        console.log(params);
        fetch(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': Global.token,
            },
            body: JSON.stringify(params)
        }).then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        }).then((json) => {
            console.log(json.floorList);
            if (json.floorList.length > 0) {
                this.setState({
                    floorList: json.floorList,
                    floorId: json.floorList[0].id
                });
                this.loadLock();
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    loadLock() {
        this.setState({loadType: -1});
        let REQUEST_URL = `${Global.baseUrl}lock/app/lock/getLockList`;
        let params = {"floorId": `${this.state.floorId}`};
        console.log(params);
        fetch(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': Global.token,
            },
            body: JSON.stringify(params)
        }).then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        }).then((json) => {
            console.log(json.lockList);
            if (json.lockList.length > 0) {
                json.lockList.forEach((value, index, array) => {
                    value.key = value.id;
                });
                this.setState({
                    lockList: json.lockList
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    punchClock() {
        // alert(Global.distance)
        var diss=Global.distance
        if (diss>2000) {
            Toast.show('不能打卡')
            return
        }
        else {
            // alert(Global.token);
            let REQUEST_URL = `${Global.baseUrl}lock/app/clock/punchTheClock`;
            let params = {"centreId": "1"};
            console.log(params);
            fetch(REQUEST_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': Global.token,
                },
                body: JSON.stringify(params)
            }).then((response) => {
                if (response.ok) {
                    console.log(response);
                    return response.json();
                }
            }).then((json) => {
                console.log(json);
                Toast.show('打卡成功');
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    //经纬度转换成三角函数中度分表形式。
    rad(d) {
        return d * Math.PI / 180.0;
    }

    /**
     *
     * @param lat1  纬度1
     * @param lng1  经度1
     * @param lat2  纬度2
     * @param lng2  经度2
     */
    //根据经纬度计算距离
    geoDistance(lat1, lng1, lat2, lng2) {
        let radLat1 = this.rad(lat1);
        let radLat2 = this.rad(lat2);
        let a = radLat1 - radLat2;
        let b = this.rad(lng1) - this.rad(lng2);
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10; //输出为米
        console.log("distance:"+s)
        Global.distance=s
        return s;
    }
    render() {
        if (this.state.loadType === 0) {
            this.loadFloor()
        } else if (this.state.loadType === 1) {
            this.loadLock()
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <StatusBar backgroundColor={'rgba(4,153,255,0.8)'} translucent={false}/>
                    <ScrollView>
                        <ImageBackground source={require('../static/index.png')}
                                         style={{height: ScreenUtil.scaleSize(510), width: ScreenUtil.deviceWidth}}>
                            <View style={styles.wapper}>
                                <Input
                                    inputStyle={{color: "#fff"}}
                                    underlineColorAndroid="transparent"  //android需要设置下划线为透明才能去掉下划线
                                    placeholder='搜索门锁...'
                                    containerStyle={styles.search}
                                    autoFocus={false}
                                    leftIcon={{type: 'font-awesome', name: 'search', color: "#fff"}}/>
                                <View style={styles.contentContainer}>
                                    <ScrollView
                                        horizontal={true}
                                        scrollEnabled={false}
                                        showsHorizontalScrollIndicator={false}
                                        ref="scrollView">
                                        {
                                            this.state.centreList.map((item, index) => {
                                                return (
                                                    <View style={styles.swiperItem} key={index}>
                                                        <ImageBackground
                                                            source={require('../static/ld_icon.png')}
                                                            key={index}
                                                            style={{width: 100, height: 100, alignItems: "center",}}>
                                                            <Text style={{
                                                                color: "#fff",
                                                                fontSize: 20,
                                                                fontWeight: "500",
                                                                marginTop: 30
                                                            }}>{item.name}</Text>
                                                        </ImageBackground>
                                                    </View>
                                                )
                                            })
                                        }
                                    </ScrollView>

                                    <Icon
                                        raised
                                        name='chevron-left'
                                        type='font-awesome'
                                        color='#fff'
                                        size={30}
                                        style={{position: "absolute", left: -10}}
                                        onPress={this.prev}/>
                                    <Icon
                                        raised
                                        name='chevron-right'
                                        type='font-awesome'
                                        color='#fff'
                                        size={30}
                                        style={{position: "absolute", right: -10}}
                                        onPress={this.next}/>
                                </View>

                                <View style={styles.building}>
                                    <ScrollView
                                        horizontal={true}
                                        scrollEnabled={false}
                                        showsHorizontalScrollIndicator={false}
                                        ref="scrollView2">
                                        {
                                            this.state.floorList.map((item, index) => {
                                                return (
                                                    <View style={styles.swiperItem2} key={index}>
                                                        <Text style={{color: "#fff", fontSize: 16}}>{item.name}</Text>
                                                    </View>
                                                )
                                            })
                                        }
                                    </ScrollView>

                                    <Icon
                                        raised
                                        name='caret-left'
                                        type='font-awesome'
                                        color='#fff'
                                        size={30}
                                        style={{position: "absolute", left: -10}}
                                        onPress={this.prev2}/>

                                    <Icon
                                        raised
                                        name='caret-right'
                                        type='font-awesome'
                                        color='#fff'
                                        size={30}
                                        style={{position: "absolute", right: -10}}
                                        onPress={this.next2}/>

                                </View>

                            </View>
                        </ImageBackground>


                        <FlatList
                            data={this.state.lockList}
                            horizontal={true}
                            renderItem={this.allLocks.bind(this)}
                            style={{marginTop: 25, alignSelf: 'center'}}
                            showsHorizontalScrollIndicator={false}/>

                        <TouchableOpacity style={styles.work}
                                          onPress={this.punchClock}>
                            <View style={styles.workbg}>
                                <View style={styles.withC}>
                                    <Text style={styles.dakai}>打卡</Text>
                                    <Text style={styles.lastTiem}>{this.state.currentTime}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }

    allLocks({item}) {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('OpenDoor')
                }}>
                <View style={{
                    backgroundColor: "#fff",
                    width: 180,
                    marginHorizontal: 15,
                    marginBottom: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 20,
                    shadowColor: '#000',
                    shadowOffset: {width: 4, height: 4},
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    elevation: 5,
                }}>
                    <Image
                        source={require("../static/lock.png")}
                        style={{width: 150, height: 150}}/>

                    <Text style={styles.doorname}>{item.companyName}</Text>
                    <Text style={styles.compan}>{item.name}</Text>

                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        alignItems: "center",
    },
    wapper: {
        flex: 1,
        alignItems: "center",
    },
    search: {
        backgroundColor: "rgba(255,255,255,0.5)",
        borderRadius: 20,
        width: "80%",
        marginTop: 15,
        borderWidth: 0
    },
    contentContainer: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: 180,
        marginTop: 25,
        marginBottom: 5

    },
    building: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: 140,
        marginTop: 25,

    },
    swiperItem: {
        width: 180,
        alignItems: "center",
        justifyContent: "center",
    },
    swiperItem2: {
        width: 140,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    doorname: {
        fontSize: 20,
        color: "#40425F",
    },
    compan: {
        fontSize: 18,
        color: "#999",
    },
    work: {
        alignItems: "center",
        justifyContent: "center",
    },
    dakai: {
        color: "#0090FF",
        fontSize: 20,

    },
    workbg: {
        width: 140,
        height: 140,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "blue",
        borderRadius: 70,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
        marginTop: 20
    },
    withC: {
        width: 100,
        height: 100,
        backgroundColor: "#fff",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    lastTime: {
        color: "#444662",
        fontSize: 16,
    }
});