import React, { Component } from 'react';
import {AppRegistry, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Image, ListItem} from "react-native-elements";
export default class History extends Component {
    render() {
        return (
            <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <View style={{paddingHorizontal:10,}}>
                    <ListItem
                        bottomDivider={true}
                        chevron={true}
                        onPress={() => {
                            this.props.navigation.navigate('ApplyHistory')
                        }}
                        leftAvatar={
                            <Image
                                source={require("../static/my/shenqing.png")}
                                style={{ width: 26, height: 26 }}
                            />
                        }
                        title="申请历史"
                        subtitle={null}
                    />
                    <ListItem
                        bottomDivider={true}
                        chevron={true}
                        onPress={() => {
                            this.props.navigation.navigate('AuthorizeHistory')
                        }}
                        leftAvatar={
                            <Image
                                source={require("../static/my/shouquan.png")}
                                style={{ width: 26, height: 26 }}
                            />
                        }
                        title="授权历史"
                        subtitle={null}
                    />
                    <ListItem
                        bottomDivider={true}
                        chevron={true}
                        onPress={() => {
                            this.props.navigation.navigate('InviteHistory')
                        }}
                        leftAvatar={
                            <Image
                                source={require("../static/my/yaoyue.png")}
                                style={{ width: 26, height: 26 }}
                            />
                        }
                        title="邀约历史"
                        subtitle={null}
                    />

                </View>

            </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
    }
});
