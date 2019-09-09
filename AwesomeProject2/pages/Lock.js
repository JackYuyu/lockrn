import React, {Component} from 'react';
import {DeviceEventEmitter, ImageBackground, SafeAreaView, StyleSheet, View} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import Apply from "../pages/Apply"
import Authorize from "../pages/Authorize"


export default class Lock extends Component {
    static navigationOptions = {
        title: "dsfsfdi"
    };

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ImageBackground source={require('../static/bg_default.jpg')}
                                 style={{flex: 1}}>
                    <View style={styles.container}>
                        <ScrollableTabView
                            renderTabBar={() => <DefaultTabBar/>}
                            tabBarUnderlineStyle={{
                                backgroundColor: '#02d8f4',
                                height: 2
                            }}
                            tabBarBackgroundColor='#00000000'
                            tabBarActiveTextColor='#ffffff'
                            tabBarInactiveTextColor='#ffffff'
                            tabBarTextStyle={{fontSize: 14}}
                            locked={false}
                            onChangeTab={(obj) => {
                                console.log('current index ： ' + obj.i)
                                if (obj.i === 1)
                                    DeviceEventEmitter.emit("StartAnswer")
                            }}>
                            <View tabLabel='访客邀约'
                                  style={{paddingTop: 20}}>
                                <Apply navigation={this.props.navigation}/>
                            </View>
                            <View tabLabel='访客授权'
                                  style={{paddingTop: 20}}>
                                <Authorize navigation={this.props.navigation}/>
                            </View>
                        </ScrollableTabView>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
    }
});
