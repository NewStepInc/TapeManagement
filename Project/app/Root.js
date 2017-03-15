/**
 * Created by nick on 4/28/16.
 */

'use strict';

import React, {
    Navigator,
    Component,
    } from 'react-native';

class MainNav extends Component {
    render() {
        return (
            <Navigator
                initialRoute={{id: 1}}
                renderScene={this.renderScene}
                configureScene={() => {return Navigator.SceneConfigs.PushFromRight}}
                />
        );
    }
    renderScene(route, navigator) {
        var routeId = route.id;
        if(routeId === 1) {
            var Screen = require("./screen/MainScreen");
            return (
                <Screen navigator={navigator}/>
            );
        } else if(routeId === 2) {
            var Screen = require("./screen/TestScreen");
            return (
                <Screen navigator={navigator}/>
            );
        }
    }
}

module.exports = MainNav;

