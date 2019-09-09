import React, {Component} from 'react';
import {
    ImageBackground,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {deviceWidth, scaleSize} from "../utils/ScreenUtil"
import {Image, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Global from "./Global";
import JPushModule from 'jpush-react-native'
import Swiper from 'react-native-swiper';

let Geolocation = require('Geolocation');
//监听定位的id
let watchID = null;
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

        this.state = {
            currentPage: 0,
            currentPage2: 0,
            centreList: [],
            floorList: [],
            lockList: [],
            centreId: 1,
            time: 5,
            floorId: 1,
            loadType: -1,//0加载楼层 门锁   1加载门锁
            distance: 0.0,//打卡距离
            currentTime: "",
        }
    }

    componentDidMount() {
        this.loadData();
        setInterval(() => {
            let today = new Date();
            let h = today.getHours();
            let m = today.getMinutes();
            if (m < 10) {
                m = "0" + m
            }
            this.setState({
                currentTime: h + ":" + m
            });
        }, 1000);

        if (Platform.OS === 'android') {
            JPushModule.initPush();
            JPushModule.getInfo(map => {
                this.setState({
                    appkey: map.myAppKey,
                    imei: map.myImei,
                    package: map.myPackageName,
                    deviceId: map.myDeviceId,
                    version: map.myVersion
                })
            });
        } else {
            JPushModule.setupPush()
        }

        JPushModule.addReceiveCustomMsgListener(map => {
            this.setState({pushMsg: map.content});
            console.log('extras: ' + map.extras)
        });
        JPushModule.addReceiveNotificationListener(map => {
            console.log('alertContent: ' + map.alertContent);
            console.log('extras: ' + map.extras)
        });

        JPushModule.addReceiveOpenNotificationListener(map => {
            console.log('Opening notification!');
            console.log('map.extra: ' + map.extras);
            console.log('jump to SecondActivity')
        });

        JPushModule.addGetRegistrationIdListener(registrationId => {
            console.log('Device register succeed, registrationId ' + registrationId)
        });
        JPushModule.getRegistrationID(registrationId => {
            console.log('Device register succeed, registrationId ' + registrationId);
            this.setState({registrationId: registrationId});
            this.updateMachingId()
        })
    }

    updateMachingId() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/user/updateUser`;
        let params = {"machingId": this.state.registrationId};
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
            console.log(json);
        }).catch((error) => {
            console.error(error);
        });
    }

    next() {
        let page = this.state.currentPage;
        page = page + 1;
        // 越界判断
        if (this.state.centreList.length <= page) {
            page = 0
        }
        let offset = page * scaleSize(600);
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
        if (page === -1) {
            page = this.state.centreList.length - 1
        }
        let offset = page * scaleSize(600);
        let scrollView = this.refs.scrollView;
        scrollView.scrollTo({x: offset, y: 0, animated: true});
        let scrollView2 = this.refs.scrollView2;
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
        let offset = page * scaleSize(200);
        let scrollView = this.refs.scrollView2;
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
        if (page === -1) {
            page = this.state.floorList.length - 1
        }
        let offset = page * scaleSize(200);
        let scrollView = this.refs.scrollView2;
        scrollView.scrollTo({x: offset, y: 0, animated: true});
        this.setState({
            currentPage2: page,
            floorId: this.state.floorList[page].id,
            loadType: 1
        });
    }

    searchCentre(text) {
        if (text === "") {
            return
        }
        for (let i = 0; i < this.state.centreList.length; i++) {
            if (this.state.centreList[i].name.indexOf(text) >= 0) {
                let page = i;
                let offset = page * scaleSize(600);
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
                return;
            }
        }
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
            if (json.code === 0) {
                this.setState({centreList: json.centreList});
                if (json.centreList.length > 0) {
                    this.setState({centreId: json.centreList[0].id});
                    Global.lat = json.centreList[0].lat;
                    Global.lon = json.centreList[0].lon;
                    this.loadFloor();
                } else {
                    this.setState({
                        centreList: [],
                        floorList: [],
                        lockList: [],
                    })
                }
            } else {
                this.setState({
                    centreList: [],
                    floorList: [],
                    lockList: [],
                })
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
            if (json.code === 0) {
                this.setState({floorList: json.floorList});
                if (json.floorList.length > 0) {
                    this.setState({floorId: json.floorList[0].id});
                    this.loadLock();
                } else {
                    this.setState({
                        floorList: [],
                        lockList: [],
                    })
                }
            } else {
                this.setState({
                    floorList: [],
                    lockList: [],
                })
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
            if (json.code === 0) {
                json.lockList.map(value => {
                    value.status = "未开锁"
                });
                this.setState({
                    lockList: json.lockList
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }


    openClock(id) {
        let REQUEST_URL = `${Global.baseUrl}lock/app/wechat/saveByLockId`;
        let params = {"lockId": Global.lockId};
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

            function sleep(n) {
                let start = new Date().getTime();
                while (true) if (new Date().getTime() - start > n) break;
            }

            for (let i = 0; i < 4; i++) {
                this.queryLock(id);
                sleep(1000)
            }
        }).catch((error) => {
            console.error(error);
        });

    }

    queryLock(id) {
        let REQUEST_URL = `${Global.baseUrl}lock/app/longOpenDoor/queryLongOpenDoorList`;
        let params = {"lockId": id};
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
            if (json.msg === 'success') {
                this.state.lockList.map(value => {
                    if (value.id === id) {
                        value.status = "已开锁"
                    }
                });
                this.setState({lockList: this.state.lockList});
                this.animate(5)
            }

        }).catch((error) => {
            console.error(error);
        });

    }

    animate(time) {
        this.timerID = setInterval(() => {
                if (time === 0) {
                    clearInterval(this.timerID);
                    this.state.lockList.map(value => {
                        value.status = "未开锁"
                    });
                    this.setState({lockList: this.state.lockList});
                }
                time = time - 1;
                this.setState({time})
            }, 1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        if (this.state.loadType === 0) {
            this.loadFloor()
        } else if (this.state.loadType === 1) {
            this.loadLock()
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <ImageBackground source={require('../static/bg_default.jpg')}
                                 style={{flex: 1}}>
                    <View style={styles.container}>
                        <StatusBar backgroundColor={'#02d8f4'} translucent={false}/>
                        <ScrollView>
                            <View style={styles.wapper}>
                                <Input
                                    inputStyle={{color: "#fff"}}
                                    underlineColorAndroid="transparent"  //android需要设置下划线为透明才能去掉下划线
                                    placeholder='搜索楼宇...'
                                    containerStyle={styles.search}
                                    onChangeText={(text) => this.searchCentre(text)}
                                    leftIcon={{type: 'font-awesome', name: 'search', color: "#fff"}}/>
                                <Image source={require("../static/logo_home.png")}
                                       style={{width: scaleSize(571), height: scaleSize(200), marginTop: 20}}/>
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
                                                        <Text style={{
                                                            color: "#fff",
                                                            fontSize: 20,
                                                            fontWeight: "500",
                                                        }}>{item.name}</Text>
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
                            <View style={styles.container}>
                                <View style={styles.lockBg}>
                                    <Swiper
                                        style={styles.wrapper}
                                        width={deviceWidth}
                                        height={10}
                                        horizontal={true}>
                                        {
                                            this.state.lockList.map((item, index) => {
                                                console.log(item, index);
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.openClock(item.id);
                                                        }}>
                                                        <View style={{
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}>
                                                            <ImageBackground
                                                                source={require('../static/icon_lock_bg.png')}
                                                                style={{
                                                                    width: scaleSize(300),
                                                                    height: scaleSize(300),
                                                                    alignItems: "center",
                                                                }}>
                                                                <Image
                                                                    source={require("../static/icon_lock.png")}
                                                                    style={{
                                                                        marginTop: scaleSize(50),
                                                                        width: scaleSize(80),
                                                                        height: scaleSize(105)
                                                                    }}/>
                                                                <Text style={styles.textLock}>{item.status}</Text>
                                                            </ImageBackground>

                                                            <Text style={styles.compan}>{item.name}</Text>

                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </Swiper>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    wapper: {
        flex: 1,
        alignItems: "center",
        width: deviceWidth,
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
        width: scaleSize(600),
        marginTop: 25,
        marginBottom: 5

    },
    building: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: scaleSize(200),
        marginTop: 25,

    },
    swiperItem: {
        width: scaleSize(600),
        alignItems: "center",
        justifyContent: "center",
    },
    swiperItem2: {
        width: scaleSize(200),
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    compan: {
        marginTop: 20,
        fontSize: 20,
        color: "#058fc8",
    },
    lockBg: {
        flex: 1,
        alignItems: "center",
        backgroundColor: 'white',
        width: "90%",
        paddingTop: 30,
        height: scaleSize(700),
        marginTop: 30,
        borderRadius: scaleSize(30),
    },
    wrapper: {},
    textLock: {
        marginTop: 15,
        color: "#02d8f4",
        fontSize: 16,
    },
});
