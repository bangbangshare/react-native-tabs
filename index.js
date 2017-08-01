 'use strict';

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    Easing
} from 'react-native';

class Tabs extends Component {
    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.state = {
            translateY: this.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100]
            })
        }
    }
    onSelect(el){
        if (el.props.onSelect) {
            el.props.onSelect(el);
        } else if (this.props.onSelect) {
            this.props.onSelect(el);
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if(nextProps.scrolling  && nextProps.scrolling != this.props.scrolling){
            var translateY = this.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100]
            })
            this.animate()
            this.setState({
                translateY:translateY
            })
        }else if(!nextProps.scrolling && nextProps.scrolling != this.props.scrolling){
            var translateY = this.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
            })
            this.animate()
            this.setState({
                translateY:translateY
            })
        }
    }

    animate () {
      this.animatedValue.setValue(0)
      const createAnimation = function (value, duration, easing, delay = 50) {
        return Animated.timing(
          value,
          {
            toValue: 1,
            duration,
            easing,
            delay
          }
        )
      }
      Animated.parallel([
        createAnimation(this.animatedValue, 400, Easing.ease),     
      ]).start()
    }

    render(){
        const self = this;
        let selected = this.props.selected
        if (!selected){
            React.Children.forEach(this.props.children.filter(c=>c), el=>{
                if (!selected || el.props.initial){
                    selected = el.props.name || el.key;
                }
            });
        }

        
        return (
            <Animated.View style={[styles.tabbarView, this.props.style, {transform:[{translateY:this.state.translateY}]}]}>
                {React.Children.map(this.props.children.filter(c=>c),(el)=>
                    <TouchableOpacity key={el.props.name+"touch"}
                       style={[styles.iconView, this.props.iconStyle, (el.props.name || el.key) == selected ? this.props.selectedIconStyle || el.props.selectedIconStyle || {} : {} ]}
                       onPress={()=>!self.props.locked && self.onSelect(el)}
                       onLongPress={()=>self.onSelect(el)}
                       activeOpacity={el.props.pressOpacity}>
                         {selected == (el.props.name || el.key) ? React.cloneElement(el, {selected: true, style: [el.props.style, this.props.selectedStyle, el.props.selectedStyle]}) : el}
                    </TouchableOpacity>
                )}
            </Animated.View>
        );
    }
}
var styles = StyleSheet.create({
    tabbarView: {
        position:'absolute',
        bottom:0,
        right:0,
        left:0,
        height:80,
        opacity:1,
        backgroundColor:'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconView: {
        flex: 1,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

module.exports = Tabs;
