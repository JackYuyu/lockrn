import React, {Component} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View, RefreshControl, ActivityIndicator} from 'react-native';
import {Divider, Image} from "react-native-elements";
import moment from "moment";
import * as Global from "./Global";
import {Toast} from "../utils/Toast";

export default class ApplyHistory extends Component {
    state = {
        data: [],
        page: 1,
        showFoot: 1,
        refreshing: true,
    };

    componentDidMount() {
        this.loadData(1);
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.contentView}
                        style={styles.list}
                        refreshControl={this._refreshControlView()}
                        getItemLayout={(data, index) => this._getItemLayout(data, index)}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={this._renderFooter.bind(this)}
                        onEndReached={this._onEndReached.bind(this)}
                        onEndReachedThreshold={1}
                        ItemSeparatorComponent={this._separator}
                        keyExtractor={item => item.id}/>
                </View>
            </SafeAreaView>
        );
    }

    _getItemLayout(data, index) {
        return {length: 200, offset: 200 * index, index}
    }

    _separator() {
        return <View style={{height: 1, backgroundColor: '#999999'}}/>;
    }

    _onEndReached() {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot !== 0 || this.state.refreshing) {
            return;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot: 2});
        //获取数据
        this.loadData(this.state.page + 1);
    }

    _renderFooter() {
        if (this.state.showFoot === 1) {
            return (
                <View style={{height: 30, alignItems: 'center', justifyContent: 'flex-start',}}>
                    <Text style={{color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={styles.footer}>
                    <Text/>
                </View>
            );
        }
    }

    _refreshControlView() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                    this.setState({
                        refreshing: true
                    });
                    this.loadData(1)
                }}
                colors={['#ff0000', '#00ff00', '#0000ff']}
            />
        )
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
                        <Text style={{fontSize: 18, color: "#444662"}}>{item.companyName}</Text>
                        <Text style={{fontSize: 16, color: "#444662", marginVertical: 10}}>{item.visitorName}</Text>
                        <Text style={{fontSize: 15, color: "#BDBDBD"}}>{time}</Text>
                    </View>
                    <View style={styles.cardRight}>
                        {
                            ApplyHistory.getApplyState(item.approvalState)
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
            return <Text style={{fontSize: 18, color: "#FF007F"}}>申请中</Text>
        } else if (approvalState === 1) {
            return <Image
                source={require("../static/my/yitongguo.png")}
                style={{width: 95, height: 95}}/>
        } else {
            return <Text style={{fontSize: 18, color: "#ff9d37"}}>已拒绝</Text>
        }
    }

    loadData(page) {
        let REQUEST_URL = `${Global.baseUrl}lock/app/visitor/queryAllPage`;
        let params = {
            'current': page,
            'size': '10'
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
            if (json.code === 0) {
                if (page === 1) {
                    this.setState({data: json.page.records,})
                } else {
                    json.page.records.forEach(value => this.state.data.push(value))
                }
                let showFoot = 0;
                if (json.page.records.length < 10) {
                    showFoot = 1
                }
                this.setState({
                    page: page,
                    showFoot: showFoot,
                    refreshing: false
                })
            } else {
                this.setState({
                    showFoot: 1,
                    refreshing: false
                });
                Toast.show(json.msg)
            }

        }).catch((error) => {
            this.setState({
                showFoot: 1,
                refreshing: false
            });
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
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
});
