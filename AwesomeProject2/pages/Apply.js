import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, SafeAreaView, TextInput, Picker} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Divider, Input} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient'
import DateTimePicker from 'react-native-modal-datetime-picker';
import Global from "./Global";
import moment from 'moment'
import {Toast} from "../utils/Toast";
import * as ScreenUtil from "../utils/ScreenUtil"


export default class Apply extends Component {
    state = {
        mode: 'date',
        isDateTimePickerVisible: false,
        username: '',
        mobile: '',
        companyName: '',
        remark: '洽谈',
        date: '',
        startTime: '',
        endTime: '',
        other: '',
        showOther: false,
        isToday: false,
    };

    _showDateTimePicker = () => this.setState({mode: 'date', isDateTimePickerVisible: true});

    _showTimePicker = () => this.setState({mode: 'time', isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        let time = moment(date);
        let currentTime = new Date();
        let dateFromNow = time.endOf('hour').fromNow();
        console.log('fromNow', dateFromNow);
        if (this.state.mode === 'date') {
            if (dateFromNow.includes('前')) {
                Toast.show('拜访日期不能在今天之前！')
            } else {
                this.setState({
                    date: time.format('YYYY-MM-DD'),
                    startTime: '',
                    endTime: '',
                    isToday: dateFromNow.includes('分钟') || dateFromNow.includes('小时')
                });
            }
        } else {
            if (this.state.date === '') {
                Toast.show('请先选择日期')
            } else if (this.state.isToday && date.getTime() - currentTime.getTime() < 0) {
                Toast.show('拜访需在当前以后')
            } else {
                let hour = date.getHours();
                let minutes = date.getMinutes();
                let end = Number(hour) + 1;
                this.setState({
                    startTime: `${hour}:${minutes}`,
                    endTime: `${end}:${minutes}`
                });
            }
        }
        console.log(this.state);
        this._hideDateTimePicker();
    };

    setAllTime(time) {
        let end = Number(time.format('HH')) + 1;
        let minutes = time.format('mm');
        this.setState({
            startTime: time.format('HH:mm'),
            endTime: `${end}:${minutes}`
        });
    }

    onValueChange(value, index) {
        console.log(value, index);
        this.setState({
            remark: value,
            showOther: value === '其他'
        })

    }

    render() {
        return (
            <View style={styles.container}>
                <Input
                    inputStyle={styles.input}
                    value={this.state.username}
                    onChangeText={(text) => this.setState({username: text})}
                    leftIcon={
                        <Text style={styles.star}>*<Text style={styles.text}>姓名: </Text></Text>
                    }/>
                <Input
                    inputStyle={styles.input}
                    value={this.state.mobile}
                    onChangeText={(text) => this.setState({mobile: text})}
                    leftIcon={
                        <Text style={styles.star}>*<Text style={styles.text}>手机: </Text></Text>
                    }/>
                <Input
                    inputStyle={styles.input}
                    value={this.state.companyName}
                    onChangeText={(text) => this.setState({companyName: text})}
                    leftIcon={
                        <Text style={styles.star}>*<Text style={styles.text}>公司: </Text></Text>
                    }/>
                <View style={styles.textStyle}>
                    <Text style={styles.dateStar}
                          onPress={() => {
                              this._showDateTimePicker()
                          }}>*<Text style={styles.text}>日期: </Text></Text>
                    <Text style={styles.dateStyle}
                          onPress={() => {
                              this._showDateTimePicker()
                          }}>{this.state.date}</Text>
                </View>
                <Divider style={{backgroundColor: 'black', width: '95%', marginLeft: 10}}/>
                <View style={styles.textStyle}>
                    <Text style={styles.dateStar}
                          onPress={() => {
                              this._showTimePicker()
                          }}>*<Text style={styles.text}>时间: </Text></Text>
                    <Text style={styles.dateStyle}
                          onPress={() => {
                              this._showTimePicker()
                          }}>{this.state.startTime}</Text>
                </View>
                <Divider style={{backgroundColor: 'black', width: '95%', marginLeft: 10}}/>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 5}}>

                    <Text style={{fontSize: 15, width: 80, textAlign: "center",}}>事由</Text>
                    <Picker
                        style={{flex: 1, paddingLeft: 20}}
                        onValueChange={(value, index) => this.onValueChange(value, index)}
                        selectedValue={this.state.remark}>
                        <Picker.Item label="洽谈" value="洽谈"/>
                        <Picker.Item label="面试" value="面试"/>
                        <Picker.Item label="会议" value="会议"/>
                        <Picker.Item label="拜访" value="拜访"/>
                        <Picker.Item label="其他" value="其他"/>
                    </Picker>
                </View>
                {this.state.showOther ? (
                    <Input
                        inputStyle={styles.input}
                        onChangeText={(text) => this.setState({other: text})}
                        leftIcon={
                            <Text style={styles.text}>其他: </Text>
                        }/>) : (<View/>)
                }
                <LinearGradient colors={["#023AFC", "#0499FF"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                locations={[0, 0.75]} style={styles.linearGradient}>
                    <Text style={styles.buttonText}
                          onPress={() => {
                              this.applyPress()
                          }}>
                        提交
                    </Text>
                </LinearGradient>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    mode={this.state.mode}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}/>

            </View>

        );
    }

    //请求
    applyPress() {
        if (this.state.username === '') {
            Toast.show('请填写用户名');
        } else if (this.state.mobile === '') {
            Toast.show('请填写手机号');
        } else if (this.state.companyName === '') {
            Toast.show('请填写公司名称');
        } else if (this.state.date === '' || this.state.startTime === '') {
            Toast.show('请选择来访时间');
        } else {
            let REQUEST_URL = `${Global.baseUrl}lock/app/invitation/addInvitation`;
            let remark = this.state.showOther && this.state.other !== '' ? this.state.other : this.state.remark;
            let params = {
                "username": this.state.username,
                "mobile": this.state.mobile,
                "companyName": this.state.companyName,
                "remark": remark,
                "startDate": `${this.state.date} ${this.state.startTime}:00`,
                "endDate": `${this.state.date} ${this.state.endTime}:00`
            };
            console.log(params);
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
                Toast.show('已发出邀约，等待对方接受');
            }).catch((error) => {
                console.error(error);
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        paddingHorizontal: 15,
        paddingBottom: 25,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,

    },
    input: {
        color: "#666", marginBottom: 5
    },
    text: {
        color: "#666"
    },
    star: {
        color: "red"
    },
    textStyle: {
        flexDirection: "row",
        width: "100%",
        height: ScreenUtil.scaleSize(95),
        paddingLeft: ScreenUtil.scaleSize(45),
    },
    dateStar: {
        color: "red",
        paddingTop: ScreenUtil.scaleSize(30),
    },
    dateStyle: {
        flex: 1,
        marginLeft: 5,
        fontSize: 18,
        paddingTop: ScreenUtil.scaleSize(25),
    },
    otherText: {
        paddingTop: ScreenUtil.scaleSize(30),
        color: "#666"
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        width: "100%",
        height: 50,
        paddingTop: ScreenUtil.scaleSize(23),
        paddingLeft: ScreenUtil.scaleSize(250)
    },
    linearGradient: {
        width: "80%",
        marginLeft: "10%",
        marginTop: 25,
        height: 50,
        borderRadius: 5,
        left: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
});
