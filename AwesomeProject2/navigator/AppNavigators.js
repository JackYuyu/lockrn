import React from 'react';
import {
    createAppContainer,
    createStackNavigator,
    createBottomTabNavigator,
    createMaterialTopTabNavigator,
    createSwitchNavigator
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Home from "../pages/Home"
import Lock from "../pages/Lock"
import My from "../pages/My"
import Personal from "../pages/Personal"
import OpenDoor from "../pages/OpenDoor"
import Daily from "../pages/Daily"
import About from "../pages/About"
import Feedback from "../pages/Feedback"
import UserLock from "../pages/UserLock"
import History from "../pages/History"
import ApplyHistory from "../pages/ApplyHistory"
import AuthorizeHistory from "../pages/AuthorizeHistory"
import InviteHistory from "../pages/InviteHistory"
import Notify from "../pages/Notify"
import Login from "../pages/Login"
import Setuppage from "../pages/Setuppage"
import App1 from "../pages/App1" //极光
import Map from "../pages/Map" //定位
import {Text} from "react-native-elements";

const HomeStack = createStackNavigator(
    {
        // 门锁
        Home: {
            screen: Home,
            navigationOptions: {
                title: "首页"
            }
        },
        OpenDoor: {
            screen: OpenDoor,
            navigationOptions: {}

        },

    }, {
        initialRouteName: 'Home',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#0499FF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },

        },
    }
);


const MyStack = createStackNavigator(
    {
        // 我的
        My: {
            screen: My,
            navigationOptions: {
                title: "我的"
            }
        },
        Personal: {
            screen: Personal,
            navigationOptions: {
                title: "个人中心"
            }
        },
        Daily: {
            screen: Daily,
            navigationOptions: {
                title: "打开统计"
            }
        },
        About: {
            screen: About,
            navigationOptions: {
                title: "关于我们"
            }
        },
        //jpush部分代码
        App1: {
            screen: App1,
            navigationOptions: {
                title: "极光"
            }
        },
        Feedback: {
            screen: Feedback,
            navigationOptions: {
                title: "意见反馈"
            },
        },
        History: {
            screen: History,
            navigationOptions: {
                title: "访客统计"
            },
        },
        UserLock: {
            screen: UserLock,
            navigationOptions: {
                title: "开门统计"
            },
        },
        ApplyHistory: {
            screen: ApplyHistory,
            navigationOptions: {
                title: "申请历史"
            },
        },
        AuthorizeHistory: {
            screen: AuthorizeHistory,
            navigationOptions: {
                title: "授权历史"
            },
        },
        InviteHistory: {
            screen: InviteHistory,
            navigationOptions: {
                title: "邀约历史"
            },
        },
        Notify: {
            screen: Notify,
            navigationOptions: {
                title: "通知消息"
            },
        },
        Login: {
            screen: Login,
            navigationOptions: {},
        },
    }, {
        initialRouteName: 'My',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#0499FF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);

// 底部导航
const BottomTabNavigator = createBottomTabNavigator({
    HomeStack: {
        navigationOptions: {
            tabBarIcon: ({tintColor, focused,}) => (
                <FontAwesome
                    name={focused ? 'lock' : 'lock'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
            tabBarLabel: '门锁',
        },
        // path: '/',
        screen: HomeStack,
    },
    Lock: {
        navigationOptions: {
            tabBarIcon: ({tintColor, focused,}) => (
                <FontAwesome
                    name={focused ? 'user' : 'user'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
            tabBarLabel: '访客',
            header: <Text>dddd</Text>
        },
        screen: Lock,
    },
    MyStack: {
        navigationOptions: {
            tabBarIcon: ({tintColor, focused,}) => (
                <FontAwesome
                    name={focused ? 'comments-o' : 'comments-o'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
            tabBarLabel: '我的',
        },
        screen: MyStack,
    },
});

let SwitchNavigator = createSwitchNavigator({
    Setuppage: {
        screen: Setuppage,
        navigationOptions: {
            title: "启动页面"
        },
    },

    Login: {
        screen: Login,
        navigationOptions: {},
    },
    Main: {
        screen: BottomTabNavigator,
        navigationOptions: {},
    },
});

export const AppContainer = createAppContainer(SwitchNavigator);
