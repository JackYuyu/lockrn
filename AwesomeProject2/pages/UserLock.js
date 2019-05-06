import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import {Image, ListItem} from 'react-native-elements'
import Global from "./Global";
import {Toast} from '../utils/Toast'

export default class UserLock extends Component {

    constructor(props){
        super(props);
        this.state={
            data: [],
        };

    }
    componentDidMount() {
        this.queryLock();
    }
    render() {

        return (

            <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <ScrollView>
                    {
                        this.state.data.map((item, index) => {
                    return <View key={index}>
                        <View style={styles.wrapper}>
                        <ListItem
                            title={item.houseName}
                            subtitle={item.intoTime}
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
                    </View>
                        })
                    }

                </ScrollView>


            </View>
            </SafeAreaView>
        );
    }
    queryLock() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/longOpen/queryLongOpenList`;
        let params = {"userId": ""};
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
            if (json.msg === 'success') {
                this.setState({
                    data:this.state.data.concat(json.list),
                });
                var movie = this.state.data[0];
                // alert(JSON.stringify(movie.houseName));
                // console.log(movie.images.small);
            }

        }).catch((error) => {
            console.error(error);
        });

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
