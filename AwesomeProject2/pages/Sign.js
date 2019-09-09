import React, {Component} from 'react';
import {
    PermissionsAndroid,
    SafeAreaView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground
} from 'react-native';
import {Divider, Image, ListItem} from "react-native-elements";
import {scaleSize} from "../utils/ScreenUtil";
import * as Global from "./Global";
import {Toast} from "../utils/Toast";
import {rad} from "./Global";

let Geolocation = require('Geolocation');
//监听定位的id
let watchID = null;
let _this = null;
export default class Sign extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            companyId: "",
            trueDistance: null,
            distance: 200
        };

    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ImageBackground source={require('../static/bg_default.jpg')}
                                 style={{flex: 1}}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.work}
                                          onPress={() => {
                                              Global.needSign = true;
                                              if (Number.isNaN(Global.distance)) {
                                                  if (Platform.OS === 'ios') {
                                                      _this.beginWatch();
                                                  } else {
                                                      _this.checkPermission();
                                                  }
                                              } else {
                                                  _this.signIn();
                                              }
                                          }}>
                            <ImageBackground
                                source={require('../static/icon_lock_bg.png')}
                                style={{
                                    width: scaleSize(300),
                                    height: scaleSize(300),
                                    marginTop: 40,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <Text style={styles.daka}>打卡</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <Divider style={{backgroundColor: '#02d8f4', width: '95%', marginLeft: 10, marginTop: 50}}/>
                        <View style={{paddingHorizontal: 10}}>

                            <ListItem
                                bottomDivider={false}
                                chevron={true}
                                onPress={() => {
                                    this.props.navigation.navigate('Daily')
                                }}
                                leftAvatar={
                                    <Image
                                        source={require("../static/icon_sign_s.png")}
                                        style={{width: 26, height: 26}}/>
                                }
                                title="打卡统计"
                                subtitle={null}/>
                        </View>
                        <Divider style={{backgroundColor: '#02d8f4', width: '95%', marginLeft: 10}}/>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }

    checkPermission() {
        try {
            //返回Promise类型
            const granted = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            granted.then((data) => {
                if (data === true) {
                    _this.beginWatch();
                } else {
                    _this.requestLocationPermission()
                }
            }).catch((err) => {
            })
        } catch (err) {
        }
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': '位置权限',
                    'message': '我们需要获取您的位置权限实现打卡功能。'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                _this.beginWatch();
            } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                Global.distance = NaN
            } else {
                Toast.show("请打开位置信息")
            }
        } catch (err) {
        }
    }

    //开始监听位置变化
    beginWatch() {
        watchID = Geolocation.watchPosition(
            location => {
                let result = "速度：" + location.coords.speed +
                    "\n经度：" + location.coords.longitude +
                    "\n纬度：" + location.coords.latitude +
                    "\n准确度：" + location.coords.accuracy +
                    "\n行进方向：" + location.coords.heading +
                    "\n海拔：" + location.coords.altitude +
                    "\n海拔准确度：" + location.coords.altitudeAccuracy +
                    "\n时间戳：" + location.timestamp;
                Global.mylon = location.coords.longitude;
                Global.mylat = location.coords.latitude;
                console.log("result:  " + result);
                if (!Number.isNaN(Global.lat)) {
                    _this.geoDistance()
                }
                // Alert.alert(result);
            },
            error => {
                Alert.alert("获取位置失败：" + error)
            }
        );
    }

    geoDistance() {
        let radLat1 = Global.rad(Global.lat);
        let radLat2 = Global.rad(Global.mylat);
        let a = radLat1 - radLat2;
        let b = Global.rad(Global.lon) - Global.rad(Global.mylon);
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10; //输出为米
        console.log("distance:" + s);
        Global.distance = s;
        if (Global.needSign) {
            _this.signIn()
        }
    }

    signIn() {
        Global.needSign = false;
        if (this.state.companyId === "") {
            this.getUserData()
        } else if (this.state.trueDistance === null) {
            this.getDistance(this.state.companyId)
        } else {
            this.punchClock(this.state.trueDistance)
        }
    }

    //停止监听位置变化
    stopWatch() {
        Geolocation.clearWatch(watchID);
    }

    getUserData() {
        let REQUEST_URL = `${Global.baseUrl}lock//app/user/getUser`;
        fetch(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': Global.token,
            },
        }).then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        }).then((json) => {
            console.log(json.user);
            if (json.code === 0) {
                this.setState({companyId: json.user.companyId});
                this.getDistance(json.user.companyId)
            } else {
                Toast.show(json.msg)
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getDistance(companyId) {
        let REQUEST_URL = `${Global.baseUrl}lock/lock/lockcompany/info/${companyId}`;
        fetch(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': Global.token,
            },
        }).then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        }).then((json) => {
            console.log(json);
            if (json.code === 0) {
                if (json.lockCompany.distance !== null) {
                    this.setState({trueDistance: json.lockCompany.distance})
                    this.punchClock(this.state.trueDistance)
                }
            } else {
                Toast.show(`${json.msg}`);
                this.punchClock(this.state.distance)
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    punchClock(distance) {
        if (Global.distance > distance) {
            Toast.show('超出公司打卡范围');
        } else {
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
                if (json.code === 0) {
                    Toast.show('打卡成功');
                } else {
                    Toast.show(`${json.msg}`);
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
        marginBottom: 30,
        borderRadius: 15,
    },
    work: {
        alignItems: "center",
        justifyContent: "center",
    },
    daka: {
        color: "#0090FF",
        fontSize: 20,

    },
    workbg: {
        width: scaleSize(200),
        height: scaleSize(200),
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
        width: scaleSize(150),
        height: scaleSize(150),
        backgroundColor: "#fff",
        borderRadius: scaleSize(100),
        alignItems: "center",
        justifyContent: "center",
    },
});
