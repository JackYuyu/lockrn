import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    Alert,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {Divider, Avatar, Image} from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Global from "./Global";
import moment from "moment";
import 'moment/locale/zh-cn';

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
                            {
                                this.state.topDivider.map(() => {
                                    return <Divider
                                        style={{backgroundColor: '#333', width: 1, height: 3, marginBottom: 2}}/>
                                })
                            }
                        </View>
                        <View style={styles.full}>
                            <View style={styles.totalBox}>
                                <Image
                                    source={require("../static/my/yue.png")}
                                    style={{width: 26, height: 26, marginRight: 15}}
                                />
                                <Text style={styles.total}>{this.state.attendanceMonth}天</Text>
                            </View>

                        </View>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                        />


                    </View>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.contentView}
                        style={styles.list}
                        keyExtractor={item => item.id}
                    />
                </View>
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
                                style={{fontSize: 14, color: "#999999"}}>{Daily.getTime(item.morningTime, '上 午')}</Text>
                        </View>
                        <View style={styles.title_detail}>
                            <Image
                                source={require("../static/my/list_d.png")}
                                style={{width: 10, height: 10, marginRight: 15}}
                            />
                            <Text style={{
                                fontSize: 14,
                                color: "#999999"
                            }}>{Daily.getTime(item.afternoonTime, '下 午')}</Text>
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
            if (interval === '下 午') {
                hours = hours - 12;
            }
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
        backgroundColor: "#f4f4f4",
    },
    top: {
        paddingVertical: 20,
        backgroundColor: "#fff",
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
        color: "#0090FF",

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
        backgroundColor: "#fff",
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
    list: {
        backgroundColor: "#F5FCFF"
    }
});
