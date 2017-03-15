/**
 * Created by nick on 4/28/16.
 */
'use strict';

import React, {
    Component,
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    } from 'react-native';

class MainScreen extends Component {

    render() {
        return (
            <View style={styles.viewContainer}>
                <TouchableOpacity style={styles.testButton} onPress={() => this.onTest()}>
                    <Text>Test</Text>
                </TouchableOpacity>
            </View>
        );
    }

    onTest() {
        var navigator = this.props.navigator;
        navigator.push({id: 2});
    }
}

var styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    testButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
});

module.exports = MainScreen;