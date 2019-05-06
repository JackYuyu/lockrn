import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    SafeAreaView, AsyncStorage
} from 'react-native';
import {ListItem, Card, Button, Icon, Avatar, Image, Badge} from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ScreenUtil from "../utils/ScreenUtil";
import Global from "./Global";

export default class My extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            company: "",
            mobile: "",
            address: "",
            avatar: "",
            msgNum: "",
        };
    }

    componentDidMount() {
        this.loadData();
        this.getMsgNum();
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.bg}>
                            <ImageBackground source={require('../static/my/my.png')} style={styles.person}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('Notify')
                                    }}
                                >
                                    <View style={{position: 'relative', height: 50,}}>
                                        <View style={{position: 'absolute', top: 15, right: 40}}>
                                            <Image
                                                source={require('../static/my/xiaoxi.png')}
                                                style={{width: 28, height: 28}}
                                            />
                                            <Badge
                                                value={this.state.msgNum}
                                                status="error"
                                                containerStyle={{position: 'absolute', top: -4, right: 4}}
                                            />
                                        </View>
                                    </View>

                                </TouchableOpacity>
                                <View style={styles.position}>
                                    <Image
                                        source={require("../static/avater.png")}
                                        style={{width: 120, height: 120}}
                                    />
                                    <View style={styles.right}>
                                        <Text style={{fontSize: 20, fontWeight: "bold"}}> {this.state.name}</Text>
                                        <Text style={{
                                            fontSize: 18,
                                            color: "#444662",
                                            marginVertical: 5
                                        }}> {this.state.company}</Text>
                                        <View style={{flexDirection: "row"}}>

                                            <Image
                                                source={require("../static/my/shouji.png")}
                                                style={{width: 12, height: 18, marginRight: 5}}
                                            />

                                            <Text style={{fontSize: 16, color: "#444662"}}> {this.state.mobile}</Text>
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                            <View style={{paddingHorizontal: 10, backgroundColor: "#fff"}}>
                                <ListItem
                                    bottomDivider={true}
                                    onPress={() => {
                                        if (this.state.name != "") {
                                            this.props.navigation.navigate('Personal', {
                                                name: this.state.name,
                                                company: this.state.company,
                                                mobile: this.state.mobile,
                                                address: this.state.address,
                                                avatar: this.state.avatar,
                                                refresh: () => {
                                                    this.loadData();
                                                }
                                            })
                                        }
                                    }}
                                    chevron={true}
                                    leftAvatar={
                                        <Image
                                            source={require("../static/my/person.png")}
                                            style={{width: 26, height: 26}}
                                        />

                                    }
                                    title="个人中心"
                                    subtitle={null}
                                    containerStyle={{borderBottomWidth: 1, borderStyle: "dashed",}}
                                />
                            </View>
                        </View>


                        <View style={{
                            marginTop: 15,
                            paddingHorizontal: 10,
                            backgroundColor: "#fff",
                            paddingVertical: 15
                        }}>
                            <ListItem
                                bottomDivider={true}
                                chevron={true}
                                onPress={() => {
                                    this.props.navigation.navigate('Daily')
                                }}
                                leftAvatar={
                                    <Image
                                        source={require("../static/my/daka.png")}
                                        style={{width: 26, height: 26}}
                                    />
                                }
                                title="打卡统计"
                                subtitle={null}
                            />
                            <ListItem
                                bottomDivider={true}
                                chevron={true}
                                onPress={() => {
                                    this.props.navigation.navigate('History')
                                }}
                                leftAvatar={
                                    <Image
                                        source={require("../static/my/fangke.png")}
                                        style={{width: 26, height: 26}}
                                    />
                                }
                                title="访客统计"
                                subtitle={null}
                            />
                            <ListItem
                                bottomDivider={true}
                                chevron={true}
                                onPress={() => {
                                    this.props.navigation.navigate('UserLock')
                                }}
                                leftAvatar={
                                    <Image
                                        source={require("../static/my/kaimen.png")}
                                        style={{width: 26, height: 26}}
                                    />
                                }
                                title="开门统计"
                                subtitle={null}
                            />

                        </View>

                        <View style={{
                            marginTop: 15,
                            marginBottom: 25,
                            paddingHorizontal: 10,
                            backgroundColor: "#fff",
                            paddingVertical: 15
                        }}>
                            <ListItem
                                bottomDivider={true}
                                chevron={true}
                                onPress={() => {
                                    this.props.navigation.navigate('Feedback')
                                }}
                                leftAvatar={
                                    <Image
                                        source={require("../static/my/yijian.png")}
                                        style={{width: 26, height: 26}}
                                    />
                                }
                                title="意见反馈"
                                subtitle={null}
                            />
                            <ListItem
                                bottomDivider={true}
                                chevron={true}
                                onPress={() => {
                                    this.props.navigation.navigate('Map')
                                }}
                                leftAvatar={
                                    <Image
                                        source={require("../static/my/about.png")}
                                        style={{width: 26, height: 26}}
                                    />
                                }
                                title="关于我们"
                                subtitle={null}
                            />


                        </View>


                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    loadData() {
        // alert(Global.token)
        let REQUEST_URL = `${Global.baseUrl}lock//app/user/getUser`;
        let params = {"token": Global.token};
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
            if (json.user !== undefined){
                this.setState(
                    {
                        name: json.user.name,
                        company: json.user.companyName,
                        mobile: json.user.phoneNum,
                        address: json.user.centreName,
                        avatar: json.user.headpicture,
                    }
                );
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getMsgNum() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/news/queryNewsNumList`;
        let params = {"token": Global.token};
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
            console.log(json.Number);
            this.setState(
                {
                    msgNum: json.Number
                }
            );

        }).catch((error) => {
            console.error(error);
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4"
    },
    bg: {
        backgroundColor: "#fff",
        position: "relative",
        paddingBottom: 15

    },
    person: {
        height: 180,
        marginBottom: 60,

    },
    right: {
        flex: 1,
        paddingLeft: 20,

    },
    position: {
        backgroundColor: "#fff",
        display: "flex",
        width: "85%",
        position: "absolute",
        marginLeft: "7.5%",
        bottom: -50,
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderStyle: "solid",
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 10,
    }
});
