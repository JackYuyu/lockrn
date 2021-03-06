import React, {Component} from 'react';
import {Alert, FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Divider, Image} from 'react-native-elements';
import * as Global from "./Global";
import moment from "moment";
import 'moment/locale/zh-cn';
import PickerData from "./Picker";
import {scaleSize} from "../utils/ScreenUtil";

export default class Daily extends Component {
    static navigationOptions = {
        title: "打卡统计",
        headerRight: (
            <TouchableOpacity
                onPress={() => Alert.alert('This is a button!')}
            >
                <Image
                    source={require("../static/my/rili.png")}
                    style={{width: 40, height: 40, marginRight: 15}}

                />
            </TouchableOpacity>
        ),

    };
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "打卡统计",
            headerRight: (
                <TouchableOpacity
                    onPress={navigation.getParam('show')}
                >
                    <Image
                        source={require("../static/my/rili.png")}
                        style={{width: 40, height: 40, marginRight: 15}}

                    />
                </TouchableOpacity>
            ),
        };
    };

    componentWillMount() {
        this.props.navigation.setParams({show: this._showDateTimePicker});
        this.loadData();
    }

    state = {
        isDateTimePickerVisible: false,
        data: [],
        topDivider: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        attendanceMonth: "0",
        attendanceWeek: "0",
    };

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        console.log('A date has been picked: ', `${date.getFullYear()}年${date.getMonth() + 1}月`);
        this.getMonthData(date.getFullYear(), date.getMonth() + 1);
        this._hideDateTimePicker();
    };


    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ImageBackground source={require('../static/bg_default.jpg')}
                                 style={{flex: 1}}>
                    <View style={styles.top}>
                        <Image
                            source={require("../static/icon_back.png")}
                            style={{width: 20, height: 20, padding: 15}}
                        />
                        <Text style={styles.titleDaily}>打卡统计</Text>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.top}>
                            <View style={styles.full}>
                                <View style={styles.totalBox}>
                                    <Image
                                        source={require("../static/my/zhou.png")}
                                        style={{width: 26, height: 26, marginRight: 15}}
                                    />
                                    <Text style={styles.total}>{this.state.attendanceWeek}天</Text>
                                </View>

                            </View>
                            <View style={{overflow: "hidden"}}>
                                <Image
                                    source={require("../static/line_daily.png")}
                                    resizeMode='contain'
                                    style={{width: 9, height: 80}}/>
                            </View>
                            <View style={styles.full}>
                                <View style={styles.totalBox}>
                                    <Image
                                        source={require("../static/my/yue.png")}
                                        style={{width: 26, height: 26, marginRight: 15}}/>
                                    <Text style={styles.total}>{this.state.attendanceMonth}天</Text>
                                </View>

                            </View>

                            <PickerData
                                visible={this.state.isDateTimePickerVisible}
                                onCancel={() => {
                                    this.setState({isDateTimePickerVisible: false});
                                    return null;
                                }}
                                onComfig={(time) => {
                                    console.log(time);
                                    this.getMonthData(time.substring(0, 4), time.substring(4, 6));

                                    this.setState({isDateTimePickerVisible: false});
                                    return null;
                                }}
                                onRequestClose={() => {
                                    this.setState({isDateTimePickerVisible: false});
                                    return null;
                                }}
                            />

                        </View>
                        <Divider style={{backgroundColor: '#02d8f4', width: '95%', marginLeft: 10}}/>
                        <FlatList
                            data={this.state.data}
                            renderItem={this.contentView}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }

    contentView({item}) {
        let divider = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        return (
            <View style={styles.record}>
                <View style={styles.title}>
                    <Image
                        source={require("../static/my/list_d.png")}
                        style={{width: 10, height: 10, marginRight: 15}}
                    />
                    <Text style={{fontSize: 15, color: "#444662"}}>{Daily.getWeek(item.createTime)}</Text>
                </View>
                <View style={styles.details}>
                    <View style={styles.line}>
                        {
                            divider.map(() => {
                                return <Divider style={styles.divider}/>
                            })
                        }
                    </View>
                    <View style={styles.detailsRight}>
                        <View style={styles.title_detail}>
                            <Image
                                source={require("../static/my/list_d.png")}
                                style={{width: 10, height: 10, marginRight: 15}}
                            />
                            <Text
                                style={{fontSize: 14, color: "#999999"}}>{Daily.getTime(item.morningTime, '上 班')}</Text>
                        </View>
                        <View style={styles.title_detail}>
                            <Image
                                source={require("../static/my/list_d.png")}
                                style={{width: 10, height: 10, marginRight: 15}}
                            />
                            <Text style={{
                                fontSize: 14,
                                color: "#999999"
                            }}>{Daily.getTime(item.afternoonTime, '下 班')}</Text>
                        </View>
                    </View>
                </View>

            </View>
        )
    }

    static getWeek(time) {
        let date = moment(time).toDate();
        let week = moment(time).locale('zh-cn').format('dddd');
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${week}`
    }

    static getTime(time, interval) {
        if (time === null) {
            return `${interval} 未打卡`
        } else {
            let date = moment(time).toDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            if (hours < 10) {
                hours = "0" + hours
            }
            if (minutes < 10) {
                minutes = "0" + minutes
            }
            return `${interval} ${hours}:${minutes}`
        }
    }

    getMonthData(year, month) {
        let REQUEST_URL = `${Global.baseUrl}lock/app/clock/queryClockOfMonth`;
        let params = {
            "year": `${year}`,
            "month": `${month}`
        };
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
            let attendanceMonth = "0";
            let attendanceWeek = "0";
            let vo = json.lock.vo;
            if (vo.attendanceMonth !== null) {
                attendanceMonth = vo.attendanceMonth
            }
            if (vo.attendanceWeek !== null) {
                attendanceWeek = vo.attendanceWeek
            }
            this.setState({
                attendanceMonth: attendanceMonth,
                attendanceWeek: attendanceWeek,
                data: json.lock.list
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    loadData() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/clock/queryClock`;
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
            let attendanceMonth = "0";
            let attendanceWeek = "0";
            let vo = json.lock.vo;
            if (vo.attendanceMonth !== null) {
                attendanceMonth = vo.attendanceMonth
            }
            if (vo.attendanceWeek !== null) {
                attendanceWeek = vo.attendanceWeek
            }
            this.setState({
                attendanceMonth: attendanceMonth,
                attendanceWeek: attendanceWeek,
                data: json.lock.list
            });
        }).catch((error) => {
            console.error(error);
        });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 15,
    },
    top: {
        paddingVertical: 20,
        flexDirection: "row",
    },
    full: {
        flex: 1,
        alignItems: "center",
    },
    totalBox: {
        flexDirection: "row"
    },
    total: {
        fontSize: 20,
        color: "#02d8f4",
    },
    titleDaily: {
        marginLeft:20,
        fontSize: 20,
        color: "white",
    },
    desc: {
        marginTop: 10,
        fontSize: 14,
        color: "#999999"
    },
    divider: {
        backgroundColor: "#666",
        width: 1,
        height: 3,
        marginBottom: 3
    },
    record: {
        marginTop: 10,
        paddingVertical: 20
    },
    title: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    line: {
        paddingLeft: 50
    },
    details: {
        flexDirection: "row",
    },
    detailsRight: {
        marginLeft: -6
    },
    title_detail: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 10,
        marginTop: 10
    },
});
