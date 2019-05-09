import React, {Component} from 'react';
import {StyleSheet, Text, View, SafeAreaView, FlatList,} from 'react-native';
import {Divider} from "react-native-elements";
import {Image} from 'react-native-elements';
import Global from "./Global";
import moment from "moment";

export default class AuthorizeHistory extends Component {
    state = {
        data: [],
    };

    componentDidMount() {
        // this.fetchData();
        this.loadData();
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.contentView}
                        style={styles.list}
                        keyExtractor={item => item.id}/>
                </View>
            </SafeAreaView>
        );
    }

    contentView({item}) {
        let arr = [];
        for (let i = 0; i < 200; i++) {
            arr.push(i)
        }
        let time = moment(item.startDate).format('YYYY-MM-DD HH:mm');
        return (
            <View style={styles.card}>
                <View style={styles.cardwrapper}>
                    <View style={styles.cardLeft}>
                        <Text style={{fontSize: 18, color: "#444662"}}>{item.receptionistName}</Text>
                        <Text style={{fontSize: 16, color: "#444662", marginVertical: 10}}>{item.visitorName}</Text>
                        <Text style={{fontSize: 15, color: "#BDBDBD"}}>{time}</Text>
                    </View>
                    <View style={styles.cardRight}>
                        {
                            AuthorizeHistory.getApplyState()
                        }
                    </View>

                </View>
                <View style={{flexDirection: 'row', overflow: "hidden", marginVertical: 15}}>
                    {
                        arr.map(({item, index}) => (
                            <Divider style={{backgroundColor: '#979797', width: 10, marginRight: 5}}
                                     key={index}/>
                        ))
                    }
                </View>
                <Text style={{fontSize: 16, color: "#444662", marginVertical: 5}}>事由：{item.remark}</Text>
            </View>
        )
    }

    static getApplyState(approvalState) {
        if (approvalState === 0) {
            return <Text style={{fontSize: 18, color: "#FF007F"}}>待授权</Text>
        } else if (approvalState === 1) {
            return <Image
                source={require("../static/my/yisouquan.png")}
                style={{width: 95, height: 95}}/>
        } else {
            return <Text style={{fontSize: 18, color: "#ff9d37"}}>已拒绝</Text>
        }
    }

    loadData() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/visitor/alreadyApproved`;
        let params = {
            "username": "safsa",
            "mobile": "15821414708",
            "companyName": "云岭通讯",
            "remark": "面试",
            "startDate": "2019-04-23 15：07：09",
            "endDate": "2019-04-23 17：07：09"
        };
        console.log(params);
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
            if (json.list.length > 0) {
                this.setState({
                    data: json.list
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        paddingTop: 20,
    },
    card: {
        marginHorizontal: 20,
        backgroundColor: "#fff",
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
        borderRadius: 5,
        padding: 15
    },
    cardwrapper: {
        flexDirection: "row",
    },
    cardLeft: {
        flex: 1,
    },
    cardRight: {
        width: 150,
        justifyContent: "center"
    },
    list: {
        backgroundColor: "#F5FCFF"
    },
});
