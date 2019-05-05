import React from 'react'
import RootToast from 'react-native-root-toast'

const Toast = {

    toast: null,

    show: msg => {
        this.toast = RootToast.show(msg, {
            position: 0,
            duration: 1500
        })
    },

    showLong: msg => {
        this.toast = RootToast.show(msg, {
            position: 0,
            duration: 2000
        })
    },
};

export {Toast}
