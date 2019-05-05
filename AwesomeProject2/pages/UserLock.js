import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import {Image, ListItem} from 'react-native-elements'

export default class UserLock extends Component {

    render() {
        return (

            <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.wrapper}>


                        <ListItem
                            title="307大门"
                            subtitle="2019-13-15 08:24"
                            rightAvatar={
                                <Image
                                    source={require("../static/my/lock.png")}
                                    style={{ width: 60, height: 60 }}
                                />
                            }
                            titleStyle={{color:"#444662 ",fontSize:18,marginBottom:5}}
                            subtitleStyle={{color:"#8D8FA0 ",fontSize:12}}
                            bottomDivider={true}
                        />
                        <ListItem
                            title="307大门"
                            subtitle="2019-13-15 08:24"
                            rightAvatar={
                                <Image
                                    source={require("../static/my/lock.png")}
                                    style={{ width: 60, height: 60 }}
                                />
                            }
                            titleStyle={{color:"#444662 ",fontSize:18,marginBottom:5}}
                            subtitleStyle={{color:"#8D8FA0 ",fontSize:12}}
                            bottomDivider={true}
                        />
                        <ListItem
                            title="307大门"
                            subtitle="2019-13-15 08:24"
                            rightAvatar={
                                <Image
                                    source={require("../static/my/lock.png")}
                                    style={{ width: 60, height: 60 }}
                                />
                            }
                            titleStyle={{color:"#444662 ",fontSize:18,marginBottom:5}}
                            subtitleStyle={{color:"#8D8FA0 ",fontSize:12}}
                            bottomDivider={true}
                        />
                        <ListItem
                            title="307大门"
                            subtitle="2019-13-15 08:24"
                            rightAvatar={
                                <Image
                                    source={require("../static/my/lock.png")}
                                    style={{ width: 60, height: 60 }}
                                />
                            }
                            titleStyle={{color:"#444662 ",fontSize:18,marginBottom:5}}
                            subtitleStyle={{color:"#8D8FA0 ",fontSize:12}}
                            bottomDivider={true}
                        />
                        <ListItem
                            title="307大门"
                            subtitle="2019-13-15 08:24"
                            rightAvatar={
                                <Image
                                    source={require("../static/my/lock.png")}
                                    style={{ width: 60, height: 60 }}
                                />
                            }
                            titleStyle={{color:"#444662 ",fontSize:18,marginBottom:5}}
                            subtitleStyle={{color:"#8D8FA0 ",fontSize:12}}
                            bottomDivider={true}
                        />
                        <ListItem
                            title="307大门"
                            subtitle="2019-13-15 08:24"
                            rightAvatar={
                                <Image
                                    source={require("../static/my/lock.png")}
                                    style={{ width: 60, height: 60 }}
                                />
                            }
                            titleStyle={{color:"#444662 ",fontSize:18,marginBottom:5}}
                            subtitleStyle={{color:"#8D8FA0 ",fontSize:12}}
                            bottomDivider={true}
                        />
                        <ListItem
                            title="307大门"
                            subtitle="2019-13-15 08:24"
                            rightAvatar={
                                <Image
                                    source={require("../static/my/lock.png")}
                                    style={{ width: 60, height: 60 }}
                                />
                            }
                            titleStyle={{color:"#444662 ",fontSize:18,marginBottom:5}}
                            subtitleStyle={{color:"#8D8FA0 ",fontSize:12}}
                            bottomDivider={true}
                        />
                        <ListItem
                            title="307大门"
                            subtitle="2019-13-15 08:24"
                            rightAvatar={
                                <Image
                                    source={require("../static/my/lock.png")}
                                    style={{ width: 60, height: 60 }}
                                />
                            }
                            titleStyle={{color:"#444662 ",fontSize:18,marginBottom:5}}
                            subtitleStyle={{color:"#8D8FA0 ",fontSize:12}}
                            bottomDivider={true}
                        />
                        <ListItem
                            title="307大门"
                            subtitle="2019-13-15 08:24"
                            rightAvatar={
                                <Image
                                    source={require("../static/my/lock.png")}
                                    style={{ width: 60, height: 60 }}
                                />
                            }
                            titleStyle={{color:"#444662 ",fontSize:18,marginBottom:5}}
                            subtitleStyle={{color:"#8D8FA0 ",fontSize:12}}
                            bottomDivider={true}
                        />
                    </View>


                </ScrollView>


            </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#f4f4f4",
    },
    wrapper:{
        paddingHorizontal:10,
        backgroundColor: "#fff"
    }
});
