/**
 * Created by nick on 4/28/16.
 */

'use strict';

import React, {
    Component,
    View,
    StyleSheet,
    Text,
    PanResponder,
    Animated,
    } from 'react-native';

const UNIT_DISTANCE = 80;
const BACKGROUND_COLOR = '#f3f9fc';
const RULER_COLOR = 'grey';
const BORDER_COLOR = '#d3d9dc';
const MARKER_SIZE = 10;
const CONTAINER_BACKGROUND_COLOR = 'white';


class TapeMeasure extends Component {

    _lastDx = 0;
    _panResponder = {};

    constructor(props) {
        super(props);
        var translateXValue = new Animated.Value(0);
        this.state = {
            layout: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },

            translateXValue,

            minValue: 0,
            maxValue: 0,
        };

        var curValue = 0;

        if (props.initialValue)
            curValue = props.initialValue;

        if (props.currentValue)
            curValue = props.currentValue;

        if (props.minValue)
            this.state.minValue = props.minValue;

        if (props.maxValue)
            this.state.maxValue = props.maxValue;

        curValue = this.calcValidValue(curValue);
        translateXValue.setValue(this.calcTranslateXValue(curValue));
    }

    _handlePanResponderEnter(e: Object, gestureState: Object) {
        this._lastDx = 0;
    }
    _handlePanResponderMove(e: Object, gestureState: Object) {
        var dx = gestureState.dx - this._lastDx;

        debugger;
        var value = this.state.translateXValue.__getValue() + dx;
        value = this.getValue(value);
        value = this.calcValidValue(value);
        //value = this.calcDispValue(value);
        value = this.calcTranslateXValue(value);
        this.state.translateXValue.setValue(value);

        this._lastDx = gestureState.dx;
    }
    _handlePanResponderRelease(e: Object, gestureState: Object) {

    }
    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => true,
            onMoveShouldSetPanResponder: (e, gestureState) => true,
            onPanResponderGrant: (e, gestureState) => this._handlePanResponderEnter(e, gestureState),
            onPanResponderMove: (e, gestureState) => this._handlePanResponderMove(e, gestureState),
            onPanResponderRelease: (e, gestureState) => this._handlePanResponderRelease(e, gestureState),
            onPanResponderTerminate: (e, gestureState) => this._handlePanResponderRelease(e, gestureState),
        });
    }

    onLayout(event) {
        this.setState({
            layout: event.nativeEvent.layout
        });

        if (this.props.scrollToValue) {
            var scrollToValue = this.calcValidValue(this.props.scrollToValue);
            Animated.timing(
                this.state.translateXValue,
                {toValue: this.calcTranslateXValue(scrollToValue), duration: 1000}
            ).start();
        }
    }

    render() {
        if (this.state.layout.width === 0 || this.state.layout.height === 0) {
            return (<View onLayout={(event) => this.onLayout(event)}
                          style={[styles.tapeMeasureContainer, this.props.style, {paddingTop: this.state.layout.height / 8}]}/>);
        } else {
            return (
                <View {...this._panResponder.panHandlers}
                    style={[styles.tapeMeasureContainer, this.props.style, {paddingTop: this.state.layout.height / 8}]}>
                    {this.renderCalibration()}
                    {this.renderMarker()}
                </View>
            );
        }
    }

    renderMarker() {
        return (
            <View style={[styles.entireView, {width: this.state.layout.width, height: this.state.layout.height}]}>
                <View style={[styles.marker, {left: this.state.layout.width / 2 - MARKER_SIZE,
                                            top: this.state.layout.height - MARKER_SIZE - 2,
                                            borderBottomColor: 'darkgrey'}]}/>
                <View style={[styles.marker, {left: this.state.layout.width / 2 - MARKER_SIZE,
                                            top: this.state.layout.height - MARKER_SIZE,
                                            borderBottomColor: CONTAINER_BACKGROUND_COLOR}]}/>
            </View>
        );
    }

    renderCalibration() {
        //var screenStartValue = this.getValue() - (this.state.layout.width / 2 / UNIT_DISTANCE + 1);
        //screenStartValue = this.calcValidValue(screenStartValue);
        //screenStartValue = this.calcDispValue(screenStartValue);
        var screenStartValue = this.state.minValue;

        //var screenEndValue = this.getValue() + (this.state.layout.width / 2 / UNIT_DISTANCE + 1);
        //screenEndValue = this.calcValidValue(screenEndValue);
        //screenEndValue = this.calcDispValue(screenEndValue);
        var screenEndValue = this.state.maxValue;

        var count = (screenEndValue - screenStartValue) / 0.25 + 1;
        //console.log('count : ' + count);
        var calibrations = [];
        for (var i = 0; i < count; i++) {
            var value = Number(Number(screenStartValue) + i * 0.25);
            calibrations.push(this.renderOneRulerTick(value));

            if (isInt(value))
                calibrations.push(this.renderNumber(value % 100));
        }

        return (
            <Animated.View style={[styles.entireView, {width: this.state.layout.width - this.calcTranslateXValue(this.state.maxValue + this.state.minValue), height: this.state.layout.height,
                                                    transform: [{translateX: this.state.translateXValue}]}]}>
                {calibrations}
            </Animated.View>
        );
    }

    renderOneRulerTick(value) {
        var pos = this.calcValuePosition(value);
        var barSize;
        if (isInt(value))
            barSize = this.state.layout.height * 3 / 4;
        else if (isInt(value / 0.5))
            barSize = this.state.layout.height / 2;
        else
            barSize = this.state.layout.height / 4;
        var topOffset = this.state.layout.height / 8;
        var top = topOffset + ((this.state.layout.height - topOffset) - barSize) / 2 - topOffset / 3;

        return (
            <View key={'rulerTick-' + value}
                style={[styles.entireView, {left: pos, top: top, width: 1, height: barSize, backgroundColor: RULER_COLOR}]}>
            </View>
        );
    }

    renderNumber(value) {
        var numbers = [];

        if (value / 10 >= 1)
            numbers.push(this.renderLeftNumber(value, parseInt(value / 10)));

        numbers.push(this.renderRightNumber(value, value % 10));

        return (
            <View key={'number-' + value}
                style={[styles.entireView, {width: this.state.layout.width - this.calcTranslateXValue(this.state.maxValue + this.state.minValue), height: this.state.layout.height}]}>
                {numbers}
            </View>
        )
    }

    renderLeftNumber(value, number) {
        var pos = this.calcValuePosition(value);

        return (
            <Text key={'leftNumber-' + value}
                style={[styles.tickNumber, {width:pos - 3, textAlign:'right'}]}>{number}</Text>
        );
    }

    renderRightNumber(value, number) {
        var pos = this.calcValuePosition(value);

        return (
            <Text key={'rightNumber-' + value}
                style={[styles.tickNumber, {left:pos + 3, textAlign:'left'}]}>{number}</Text>
        );
    }

    calcValuePosition(value) {
        return this.state.layout.width / 2 + (value - this.state.minValue) * UNIT_DISTANCE;
    }

    calcDispValue(value) {
        return ((value / 0.25).toFixed(0) * 0.25).toFixed(2);
    }

    calcValidValue(value) {
        return Math.max(this.state.minValue, Math.min(value, this.state.maxValue));
    }

    calcTranslateXValue(value) {
        return -(value - this.state.minValue) * UNIT_DISTANCE;
    }

    getValue(translateXValue) {
        var curValue = -translateXValue / UNIT_DISTANCE + this.state.minValue;
        return Number(this.calcValidValue(curValue));
    }
}

function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

var styles = StyleSheet.create({
    tapeMeasureContainer: {
        overflow: 'hidden',
        flexDirection: 'row',
        borderWidth: 1,
        borderTopColor: BORDER_COLOR,
        borderLeftColor: BORDER_COLOR,
        borderRightColor: BORDER_COLOR,
        borderBottomColor: 'darkgrey',
        backgroundColor: BACKGROUND_COLOR,
    },
    entireView: {
        position:'absolute',
        left:0,
        top:0,
        backgroundColor:'transparent',
    },
    marker: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: MARKER_SIZE,
        borderRightWidth: MARKER_SIZE,
        borderBottomWidth: MARKER_SIZE,
        borderTopWidth: 0,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    tickNumber: {
        position:'absolute',
        left: 0,
        top: 4,
        fontWeight: '700',
        fontSize: 18
    },

});

module.exports = TapeMeasure;