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

var TapeMeasure = require('../component/TapeMeasure');

class TestScreen extends Component {

    state = {animated: false};

    render() {
        return (
            <View style={styles.viewContainer}>
                <TouchableOpacity style={styles.retryButton} onPress={() => this.onBack()}>
                    <Text>Back</Text>
                </TouchableOpacity>

                <TapeMeasure
                    style={styles.tapeMeasure}
                    initialValue={0}
                    currentValue={30}
                    scrollToValue={50}
                    minValue={30}
                    maxValue={80}
                    />
            </View>
        );
    }

    onBack() {
        var navigator = this.props.navigator;
        navigator.pop();
    }
}

var styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    retryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 4
    },
    tapeMeasure: {
        position: 'absolute',
        width: 300,
        height: 50,
        left: 20,
        top: 200,
    }
});

module.exports = TestScreen;