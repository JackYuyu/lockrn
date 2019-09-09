import React, {Component} from 'react';
import {Picker, StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground, SafeAreaView} from 'react-native';

import {Divider, Input} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient'
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as Global from "./Global";
import moment from 'moment'
import {Toast} from "../utils/Toast";
import {scaleSize} from "../utils/ScreenUtil"

var _this = this;
export default class Apply extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            mode: 'date',
            data: [{content: "洽谈"}, {content: "面试"}, {content: "会议"}, {content: "拜访"}, {content: "其他"}],
            isDateTimePickerVisible: false,
            username: '',
            mobile: '',
            companyName: '',
            remark: '',
            date: '',
            startTime: '',
            endTime: '',
            other: '',
            showOther: false,
            isToday: false,
        };
    }

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

    onValueChange(value) {
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
                <Divider style={{backgroundColor: '#02d8f4', width: '95%', marginLeft: 10}}/>
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
                <Divider style={{backgroundColor: '#02d8f4', width: '95%', marginLeft: 10}}/>
                <Text style={{marginTop: 15, fontSize: 15, width: '95%', marginLeft: 30, color: "#02d8f4"}}>事由</Text>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    numColumns={3}
                    horizontal={false}
                    keyExtractor={(item, index) => String(index)}
                    style={{marginTop: 15, alignSelf: 'center', width: '95%'}}
                    showsHorizontalScrollIndicator={false}/>
                {this.state.showOther ? (
                    <Input
                        inputStyle={styles.input}
                        onChangeText={(text) => this.setState({other: text})}
                        leftIcon={
                            <Text style={styles.text}>其他: </Text>
                        }/>) : (<View/>)
                }
                <Divider style={{backgroundColor: '#02d8f4', width: '95%', marginLeft: 10, marginTop: scaleSize(150)}}/>
                <ImageBackground
                    source={require('../static/bg_submit.png')}
                    style={{
                        width: scaleSize(80),
                        height: scaleSize(80),
                        marginTop: scaleSize(-45),
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Text style={styles.buttonText}
                          onPress={() => {
                              this.applyPress()
                          }}>
                        提交
                    </Text>

                </ImageBackground>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    mode={this.state.mode}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}/>

            </View>

        );
    }

    renderItem({item}) {
        if (_this.state.remark === item.content) {
            return (
                <Text style={styles.selectData}>
                    {item.content}
                </Text>
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={() => {
                        _this.onValueChange(item.content);
                    }}>
                    <Text style={styles.unSelectData}>
                        {item.content}
                    </Text>
                </TouchableOpacity>
            )
        }
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
                this.props.navigation.navigate('InviteHistory')
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
        borderRadius: 15,
        alignItems: "center",
    },
    input: {
        color: "#02d8f4", marginBottom: 5
    },
    text: {
        color: "#02d8f4"
    },
    star: {
        color: "red"
    },
    textStyle: {
        flexDirection: "row",
        width: "100%",
        height: scaleSize(95),
        paddingLeft: scaleSize(45),
    },
    dateStar: {
        color: "red",
        paddingTop: scaleSize(30),
    },
    dateStyle: {
        flex: 1,
        marginLeft: 5,
        fontSize: 18,
        paddingTop: scaleSize(25),
    },
    otherText: {
        paddingTop: scaleSize(30),
        color: "#02d8f4"
    },

    buttonText: {
        color: "#fff",
        fontSize: 14,
    },
    selectData: {
        height: 44,
        lineHeight: 44,
        width: 100,
        marginLeft: 10,
        marginBottom: 10,
        backgroundColor: 'blue',
        color: 'white',
        textAlign: 'center'
    },
    unSelectData: {
        height: 44,
        lineHeight: 44,
        width: 100,
        marginLeft: 10,
        marginBottom: 10,
        backgroundColor: '#F7F7F7',
        color: '#DDDDDD',
        textAlign: 'center'
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
